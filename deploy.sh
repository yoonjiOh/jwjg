#!/bin/bash
cd ./build

chmod u+x deploy.sh

yarn cache clean --force
rm -rf node_modules package-lock.json

yarn install
yarn build
yarn start
