#!/bin/bash
cd app
yarn build 
cd ..
serverless syncToS3
serverless invalidateCloudFrontCache