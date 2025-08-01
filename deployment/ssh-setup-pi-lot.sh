#!/bin/bash

echo "Pi-Lot SSH Setup"
echo "-----------------"

read -p "Raspberry Pi username [default: pi]: " PI_USER
PI_USER=${PI_USER:-pi}

read -p "Raspberry Pi address [default: raspberrypi.local]: " PI_HOST
PI_HOST=${PI_HOST:-raspberrypi.local}

read -p "Raspberry Pi key name [default: id_pi_lot_rsa]: " KEY_NAME
KEY_NAME=${KEY_NAME:-id_pi_lot_rsa}
KEY_PATH="$HOME/.ssh/$KEY_NAME"

if [ ! -f "$KEY_PATH" ]; then
  echo "No SSH key named '$KEY_NAME' found. Creating one..."
  ssh-keygen -t rsa -b 4096 -f "$KEY_PATH" -C "$USER@raspberrypi-pi-lot" -N ""
  echo "SSH key created at $KEY_PATH"
else
  echo "SSH key '$KEY_NAME' already exists at $KEY_PATH"
fi

echo "Copying public key to $PI_USER@$PI_HOST..."

if command -v ssh-copy-id >/dev/null 2>&1; then
  ssh-copy-id -i "$KEY_PATH.pub" "$PI_USER@$PI_HOST"
else
  PUB_KEY_CONTENT=$(cat "$KEY_PATH.pub")
  ssh "$PI_USER@$PI_HOST" "mkdir -p ~/.ssh && echo '$PUB_KEY_CONTENT' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"
fi

echo ""
echo "Testing passwordless SSH using the new key..."

ssh -i "$KEY_PATH" -o PasswordAuthentication=no "$PI_USER@$PI_HOST" "echo 'SSH key setup successful.'"

echo ""

CONFIG_FILE="$HOME/.ssh/config"
mkdir -p "$(dirname "$CONFIG_FILE")"
touch "$CONFIG_FILE"
chmod 600 "$CONFIG_FILE"

if grep -q -E "^Host pi-lot" "$CONFIG_FILE" && grep -q -E "HostName $PI_HOST" "$CONFIG_FILE"; then
  echo "SSH config entry for 'pi-lot' already exists in $CONFIG_FILE"
else
  echo "" >> "$CONFIG_FILE"
  echo "Host pi-lot" >> "$CONFIG_FILE"
  echo "  HostName $PI_HOST" >> "$CONFIG_FILE"
  echo "  User $PI_USER" >> "$CONFIG_FILE"
  echo "  IdentityFile $KEY_PATH" >> "$CONFIG_FILE"
  echo "SSH config entry for 'pi-lot' added to $CONFIG_FILE"
fi

echo ""
echo "You can now connect with: ssh pi-lot"
