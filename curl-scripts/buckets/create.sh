#!/bin/bash

API="http://localhost:4741"
URL_PATH="/buckets"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "bucket": {
      "description": "'"${TEXT}"'",
      "title": "'"${TITLE}"'"
    }
  }'

echo
