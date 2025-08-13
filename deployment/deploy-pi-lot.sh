#!/bin/bash

echo "Pi-Lot Deployment Script"
echo "-------------------------"

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

read -p "Raspberry Pi username [default: pi]: " PI_USER
PI_USER=${PI_USER:-pi}

read -p "Raspberry Pi address [default: raspberrypi.local]: " PI_HOST
PI_HOST=${PI_HOST:-raspberrypi.local}

read -p "Target directory for Angular client [default: /var/www/pi-lot-client]: " CLIENT_TARGET
CLIENT_TARGET=${CLIENT_TARGET:-/var/www/pi-lot-client}

read -p "Target directory for Node server [default: /home/$PI_USER/pi-lot]: " SERVER_TARGET
SERVER_TARGET=${SERVER_TARGET:-/home/$PI_USER/pi-lot}

read -p "Delete existing Angular client files before upload? [default: y] [y/N]: " DELETE_CLIENT
DELETE_CLIENT=${DELETE_CLIENT:-y}
read -p "Delete existing Node server files before upload? [default: y] [y/N]: " DELETE_SERVER
DELETE_SERVER=${DELETE_SERVER:-y}

if grep -q -E "^Host pi-lot" ~/.ssh/config 2>/dev/null && grep -q -E "HostName $PI_HOST" ~/.ssh/config 2>/dev/null; then
  SSH_TARGET="pi-lot"
  echo "Using SSH alias 'pi-lot' from ~/.ssh/config"
else
  SSH_TARGET="$PI_USER@$PI_HOST"
  echo "Using SSH target $SSH_TARGET"
fi

echo "Building Angular client..."
(cd "$BASE_DIR/pi-lot-client" && npm run client:build) || { echo "Angular client build failed"; exit 1; }

echo "Preparing Angular client on Raspberry Pi..."
ssh "$SSH_TARGET" "
  sudo mkdir -p $CLIENT_TARGET
  sudo chown -R $PI_USER:$PI_USER $CLIENT_TARGET
  case \"$DELETE_CLIENT\" in
      [yY])
        echo 'Deleting existing Angular client files...'
        rm -rf $CLIENT_TARGET/*
        ;;
      *)
        echo 'Keeping existing Angular client files.'
        ;;
  esac
"

echo "Uploading Angular client to $CLIENT_TARGET..."
scp -r "$BASE_DIR/pi-lot-client/dist/pi-lot-client/"* "$SSH_TARGET":$CLIENT_TARGET

echo "Setting permissions for www-data..."
ssh "$SSH_TARGET" "
  sudo chown -R www-data:www-data $CLIENT_TARGET
  sudo find $CLIENT_TARGET -type d -exec chmod 755 {} \;
  sudo find $CLIENT_TARGET -type f -exec chmod 644 {} \;
"

echo "Uploading nginx config..."
scp "$BASE_DIR/deployment/nginx.conf" "$SSH_TARGET:/tmp/pi-lot-nginx.conf"

echo "Setting up nginx configuration..."
ssh "$SSH_TARGET" '
  if [ ! -f /etc/nginx/sites-available/pi-lot-client ]; then
    sudo mv /tmp/pi-lot-nginx.conf /etc/nginx/sites-available/pi-lot-client
    sudo ln -sf /etc/nginx/sites-available/pi-lot-client /etc/nginx/sites-enabled/pi-lot-client
    sudo nginx -t && sudo systemctl reload nginx
    rm -f /tmp/pi-lot-nginx.conf
  else
    echo "nginx config already exists. Skipping creation."
    rm -f /tmp/pi-lot-nginx.conf
  fi
'

echo "Building Node.js server..."
(cd "$BASE_DIR/pi-lot-server" && npm run server:build) || { echo "Node.js server build failed"; exit 1; }

echo "Preparing Node.js server on Raspberry Pi..."
ssh "$SSH_TARGET" "
  mkdir -p $SERVER_TARGET
  case \"$DELETE_SERVER\" in
        [yY])
          echo 'Deleting existing Node.js server files...'
          rm -rf $SERVER_TARGET/*
          ;;
        *)
          echo 'Keeping existing Node.js server files.'
          ;;
    esac
"

echo "Uploading server files and package.json..."
scp -r "$BASE_DIR/pi-lot-server/dist/"* "$SSH_TARGET":$SERVER_TARGET
scp "$BASE_DIR/pi-lot-server/package.json" "$SSH_TARGET":$SERVER_TARGET

echo "Installing server dependencies..."
ssh "$SSH_TARGET" "
  cd $SERVER_TARGET/pi-lot-server
  npm install --production
"

echo "Checking if pm2 is installed on Raspberry Pi..."
PM2_INSTALLED=$(ssh "$SSH_TARGET" 'command -v pm2 >/dev/null 2>&1 && echo yes || echo no')

if [ "$PM2_INSTALLED" = "no" ]; then
  echo "pm2 is not installed."

  read -p "Do you want to install pm2 globally on the Raspberry Pi now? [y/N]: " INSTALL_PM2
  INSTALL_PM2=${INSTALL_PM2:-n}

  if [[ "$INSTALL_PM2" =~ ^[Yy]$ ]]; then
    echo "Installing pm2 globally..."
    ssh "$SSH_TARGET" 'sudo npm install -g pm2'
  else
    echo ""
    echo "Skipping pm2 setup."
    echo "To install it later, run: ssh $SSH_TARGET 'sudo npm install -g pm2'"
    echo "Then you can start the server manually:"
    echo "  ssh $SSH_TARGET"
    echo "  cd $SERVER_TARGET/pi-lot-server/src"
    echo "  pm2 start index.js --name pi-lot-server --env production"
    echo ""
    echo "Deployment finished without starting the Node.js server."
    exit 0
  fi
else
  echo "pm2 is already installed."
fi

echo "Starting Node.js server with pm2..."
ssh "$SSH_TARGET" "
  cd $SERVER_TARGET/pi-lot-server/src
  pm2 stop pi-lot-server || true
  pm2 delete pi-lot-server || true
  pm2 start index.js --name pi-lot-server --env production
  pm2 save
"

echo "Deployment completed. Open http://$PI_HOST in your browser."
