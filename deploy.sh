#!/bin/bash
source /home/ec2-user/.bash_profile
cd /home/ec2-user/build
npm run install
npm run build
npm run start
