#!/bin/bash
cd /home/ec2-user/build

npm cache clean --force
rm -rf node_modules package-lock.json

npm install

npm run build
npm run start
