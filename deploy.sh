#!/bin/bash
cd /home/ec2-user/build

npm install
npm run build
npm run start

exit 0
