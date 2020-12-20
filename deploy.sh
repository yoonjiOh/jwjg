#!/bin/bash
cd /home/ec2-user/build

chmod u+x deploy.sh

npm install
npm run build
npm run start
