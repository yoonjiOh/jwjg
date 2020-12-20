#!/bin/bash
cd ./build

sudo npm cache clean --force
sudo rm -rf node_modules package-lock.json

sudo npm install

sudo npm run build
sudo npm run start
