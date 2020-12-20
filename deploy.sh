#!/bin/bash
cd ./build

npm cache clean --force


npm install
npm run build
pm2 start npm --name "next" -- start
