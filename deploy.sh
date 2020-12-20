#!/bin/bash

case "$1" in
	start)
		npm install
		npm run build
		npm run start
		;;
esac
exit 0
