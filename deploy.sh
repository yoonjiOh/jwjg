#!/bin/bash
cd ./build

chmod u+x deploy.sh

npm cache clean --force
rm -rf node_modules package-lock.json

npm install
npm run build
npm run start
