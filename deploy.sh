#!/bin/bash
cd ./build

echo 1
npm cache clean --force
echo 2
rm -rf node_modules/
echo 3

npm install
echo 4
npm run build
echo 5
npm run start
echo 6s
