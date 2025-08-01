# Pi-Lot

## Disclaimer
This is a test project for an Angular 19 and NodeJS app. Work is still in progress.

## Prerequisites

To deploy pi-lot on a raspberrypi you have to make sure the following tools are installed on it:
- `nginx`
- `node` `npm`
- (`pm2`, you will be asked to install during [`deploy-pi-lot.sh`](deployment/deploy-pi-lot.sh))

## Deployment (automatically)

### 1. Setup SSH authentication (optional)

To deploy pi-lot on a raspberrypi you will have to use several `ssh` commands. Therefore you might want to create
a key so you will not be asked for your password every time you use a command that requires your password.

You can use the [`ssh-setup-pi-lot.sh`](deployment/ssh-setup-pi-lot.sh) script to create a new key.
It will create and store a new SSH key using `ssh-keygen` in your user directory in `/.ssh`, like `/home/<USER-NAME>/.ssh/` or in windows 
`C:\Users\<USER-NAME>\.ssh\`.

The [`deploy-pi-lot.sh`](deployment/deploy-pi-lot.sh) will check for the key and use it for deployment.

### 2. Deploy

You can execute [`deploy-pi-lot.sh`](deployment/deploy-pi-lot.sh) to deploy pi-lot on your raspberrypi.

The script will ask for some information before uploading pi-lot to
your raspberrypi:

````
Raspberry Pi username [default: pi]:
Raspberry Pi address [default: raspberrypi.local]:
Target directory for Angular client [default: /var/www/pi-lot-client]:
Target directory for Node server [default: /home/<USER-NAME>/pi-lot]:
Delete existing Angular client files before upload? [y/N]:
Delete existing Node server files before upload? [y/N]:
````

It is recommended to delete all existing files before uploading pi-lot. Consider creating a backup of your `pi-lot.db`
since it will be overwritten and your data will be lost. Database backup and migration is planned for future updates.

The default location for the database file: `/home/<USER-NAME>/pi-lot/pi-lot-server/src/database/pi-lot.db`

The script will create an entry for `nginx` in `/etc/nginx/sites-available/pi-lot-client` using the
[`nginx.conf`](deployment/nginx.conf). It will also create a symlink in `/etc/nginx/sites-enabled/pi-lot-client` and 
reload `nginx`.

The required rights for the `www-data` user will be automatically set:

````
sudo chown -R www-data:www-data /var/www/pi-lot-client
sudo find /var/www/pi-lot-client -type d -exec chmod 755 {} \;
sudo find /var/www/pi-lot-client -type f -exec chmod 644 {} \;
````

After the NodeJS server is uploaded to your raspberrypi you will be asked to install `pm2`, if not already installed.
It is recommended to use `pm2` for a convenient way to start and stop the server. It will be installed globally on
your raspberrypi with `sudo npm install -g pm2`.

If you have `pm2` installed the script will start the server under the name `pi-lot-server`.

The deployment is now completed and you can access pi-lot at your configured address.

## Deployment (manually)

### 1. Build pi-lot-client
Use the npm script

`client:build`

or execute

````
ng build --configuration production
````

This will create a production build in the `pi-lot-client/dist/pi-lot-client` directory.

### 2. Copy to raspberrypi
You can manually copy the created directory `pi-lot-client/dist/pi-lot-client` to your raspberrypi
or use the following command:

`scp -r pi-lot-client/dist/pi-lot-client/* <USER-NAME>@<RASPBERRYPI-ADDRESS>:<TARGET-DIRECTORY>`

- `<USER-NAME>`: your username on the raspberrypi (default: pi)
- `<RASPBERRYPI-ADDRESS>`: the IP address or hostname of your raspberrypi (default: raspberrypi.local)
- `<TARGET-DIRECTORY>`: where the created directory will be copied to (default: /var/www/pi-lot-client)

With default values:

````
scp -r pi-lot-client/dist/pi-lot-client/* pi@raspberrypi.local:/var/www/pi-lot-client
````

### 3. Set rights for www-data

nginx uses the `www-data` user to access the files, so you have to execute the following commands to adjust them:

````
sudo chown -R www-data:www-data /var/www/pi-lot-client
sudo find /var/www/pi-lot-client -type d -exec chmod 755 {} \;
sudo find /var/www/pi-lot-client -type f -exec chmod 644 {} \;
````

Otherwise, you may encounter a `403 Forbidden` response when trying to access the pi-lot-client via a browser.

### 4. nginx configuration

Create the following config on your raspberrypi:

````
sudo nano /etc/nginx/sites-available/pi-lot-client
````

(you can find it here: [`deployment/nginx.conf`](deployment/nginx.conf))

````
server {
    listen 80;
    server_name _;

    root /var/www/pi-lot-client/browser;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

````

and symlink it to enable it:

````
sudo ln -s /etc/nginx/sites-available/pi-lot-client /etc/nginx/sites-enabled/
````

You may notice that you could use the contents of the `browser` directory to deploy the pi-lot-client.
It is kept intentionally if you want to use SSR (Server Side Rendering) in Angular + NodeJS. This project does not aim
to use SSR, but feel free to configure it the way you like.

You can now check and reload nginx, and the pi-lot-client should be up and running!

Check syntax:
````
sudo nginx -t
````

Reload nginx:
````
sudo systemctl reload nginx
````

### 5. Build pi-lot-server

When building the pi-lot-server with the npm script `server:build` it will create two directories:

````
/dist/pi-lot-interfaces
/dist/pi-lot-server
````

The most basic and easiest way to deploy the pi-lot-server to the raspberrypi is to copy both directories:

````
scp -r pi-lot-server/dist/* pi@raspberrypi.local:/home/<USER-NAME>/pi-lot
````

After that you will have to copy the `package.json` to install the required modules:

````
scp pi-lot-server/package.json pi@raspberrypi.local:/home/<USER-NAME>/pi-lot
````

Install the packages and you're good to go!

Run this in `/home/<USER-NAME>/pi-lot/pi-lot-server`

````
npm install --production
````

and start the server from `/home/<USER-NAME>/pi-lot/pi-lot-server/src`

````
node index.js
````

You can also use `pm2` to start the server in a more convenient way. 

````
sudo npm install -g pm2
````

````
pm2 start index.js --name pi-lot-server
````

### 6. Useful commands

Check if nodejs is running
````
ps aux | grep node
````

#### pm2

Start server process
````
pm2 start index.js --name pi-lot-server
````

Stop server process
````
pm2 stop pi-lot-server
````

Delete server process
````
pm2 delete pi-lot-server
````

Show all processes
````
pm2 list
````

#### nginx

Check nginx status
````
systemctl status nginx
````

Start nginx
````
systemctl start nginx
````

Reload config for nginx
````
systemctl reload nginx
````

Restart nginx
````
systemctl restart nginx
````

Stop nginx
````
systemctl stop nginx
````

### 7. Database management

TBD

- pi-lot-server/dist/pi-lot-server/src/database/pi-lot.db
- backup
- migration

## Todo

- Tests
- Authentication, Security
- Cookies for auth
- Raspberry Pi monitor and features
- Multi user feature
- User feature (profile, settings)
- Game with websockets (Quiz Show)
- Architecture cleanup
- Deploy script
- Angular Update 20
- nginx config
- docker for nodejs server
- check readme and configure commands for win and linux
- nginx config in deploy script as file
- logs in deploy script and start nodejs server refactor
- deprecated npm packages
