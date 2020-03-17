#!/bin/bash

# First argument is stage identifer

if aws s3api head-bucket --bucket "pretoria-celo-cauldron-$1" 2>/dev/null;
then
    echo "Bucket $1 already exists, do not need to recreate ..."
else
    echo "Bucket $1 does not exist, creating serverless stack from scratch ..."
    sls deploy -v --stage $1
fi