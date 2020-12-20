#!/bin/bash
cd ./build

chmod u+x deploy.sh

rm -rf node_modules
npm install
npm run build
npm run start
