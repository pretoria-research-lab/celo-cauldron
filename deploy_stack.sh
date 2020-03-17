#!/bin/bash
# This should be run once locally before deploying with .gitlab-ci.yml
# First argument is stage identifer
sls deploy -v --stage $1