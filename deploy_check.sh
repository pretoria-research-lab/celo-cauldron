#!/bin/bash

# First argument is stage identifer

BUCKET=pretoria-celo-cauldron-$1
STATUS=$(aws s3api head-bucket --bucket $BUCKET 2>&1)

if echo "$STATUS" | grep 'Not Found';
then
  echo "Bucket $BUCKET doesn't exist, deploying first time ...";
  sls deploy -v --stage $1;
elif echo "$STATUS" | grep 'Forbidden';
then
  echo "Bucket $BUCKET exists but not owned";
  return 1;
elif echo "$STATUS" | grep 'Bad Request';
then
  echo "Bucket $BUCKET is less than 3 or greater than 63 characters"
else
  echo "Bucket $BUCKET exists, no further action";
fi