#!/bin/bash
cd ./build

npm cache clean --force
rm -rf node_modules/

npm install
npm run build
npm run start
