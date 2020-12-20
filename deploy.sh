#!/bin/bash
cd ./build

npm cache clean --force
rm -rf node_modules package-lock.json

npm install

npm run build
npm run start
