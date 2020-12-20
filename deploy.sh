#!/bin/bash
chmod u+x deploy.sh

npm install
npm run build
npm run start
