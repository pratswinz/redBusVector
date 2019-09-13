#!/bin/bash


rsync -avz -e "ssh -i ./prat_key.pem" ../redBusVector/ ubuntu@ec2-3-83-130-211.compute-1.amazonaws.com://home/ubuntu/redBusVector/ --exclude node_modules --exclude .git


