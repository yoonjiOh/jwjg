#!/bin/bash
cd ./build

chmod u+x deploy.sh

npm install
npm run build
npm run start
