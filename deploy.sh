#!/bin/bash
cd ./build

npm install
npm run build
pm2 start npm --name "next" -- start
