#!/bin/bash

OUTPUT_FILE=".env"


# Here the order matters.
#
# if a key is already process by the first file
# it will be ignored from the second file
# Inshort, "keys from first file take precedence"
# 
# echo "" will add a new line to the output file
# after processing first file and this will
# avoid messing the variables in the output file
#
# awk -F= '!seen[$1]++' makes sure that only
# one occurence should be part of the output file
{
  cat config/.env.global
  echo ""
  cat config/.env.${NODE_ENV:-production_preview}
} | grep -v '^#' | grep -v '^$' | awk -F= '!seen[$1]++' > $OUTPUT_FILE

echo ".env file has been generated."
