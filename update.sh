#!/bin/bash
cd app
yarn build 
cd ..
serverless syncToS3 -v --stage $1
serverless invalidateCloudFrontCache -v --stage $1