#!/bin/bash

# Script to seed the two dev connectors with test data using curl
# Usage: ./seed_dataspace.sh <endpoint_url_1> <endpoint_url_2>

# Function to check and install required commands
check_and_install() {
  local cmd=$1
  local package=$2

  if ! command -v "$cmd" &> /dev/null; then
    echo "$cmd is not installed. Attempting to install..."
    if command -v apt-get &> /dev/null; then
      sudo apt-get update && sudo apt-get install -y "$package"
    elif command -v yum &> /dev/null; then
      sudo yum install -y "$package"
    else
      echo "Unsupported package manager. Please install $cmd manually."
      exit 1
    fi
  else
    echo "$cmd is already installed."
  fi
}

# Check for required commands
check_and_install "curl" "curl"
check_and_install "jq" "jq"

# Configurations
TEST_API_KEY=${TEST_API_KEY:-"my-test-api-key"}
TEST_DATA_FOLDER_PATH="$(realpath "$(dirname "$0")")/test-data"

# Functions
send_data() {
  local endpoint=$1
  local data=$2
  local path=$3

  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "x-api-key: $TEST_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$data" "$endpoint/$path")

  if [ "$RESPONSE" -eq 200 ] || [ "$RESPONSE" -eq 201 ]; then
    echo "Data successfully sent to $endpoint/$path."
  else
    echo "Failed to send data to $endpoint/$path. HTTP response code: $RESPONSE."
    RESPONSE_BODY=$(curl -s -X POST \
      -H "x-api-key: $TEST_API_KEY" \
      -H "Content-Type: application/json" \
      -d "$data" "$endpoint/$path")
    echo "Response body: $RESPONSE_BODY"
  fi
}

generate_asset_json() {
  local id=$1
  local title=$2
  local description=$3
  local spatial=$4

  jq --arg id "$id" \
     --arg title "$title" \
     --arg description "$description" \
     --arg spatial "$spatial" \
     '.["@id"] = $id |
      .properties["dct:title"] = $title |
      .properties["dct:description"] = $description |
      .properties["dct:spatial"]["skos:prefLabel"] = $spatial' \
     "$TEST_DATA_FOLDER_PATH/asset-default-template.json"
}

generate_contract_json() {
  local id=$1
  local access_policy=$2
  local contract_policy=$3

  jq --arg id "$id" \
     --arg access_policy "$access_policy" \
     --arg contract_policy "$contract_policy" \
     '.["@id"] = $id |
      .accessPolicyId = $access_policy |
      .contractPolicyId = $contract_policy' \
     "$TEST_DATA_FOLDER_PATH/offer-all-template.json"
}

# Main Logic
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <endpoint_url_1> <endpoint_url_2>"
  exit 1
fi

ENDPOINT_URL_1=$1
ENDPOINT_URL_2=$2

# Register Assets
for ((i=1; i<=12; i++)); do
  ASSET_JSON=$(generate_asset_json "asset-$i-id" "Asset $i" "Description for Asset $i" "geo-location-$i")
  ENDPOINT=$([ "$i" -le 7 ] && echo "$ENDPOINT_URL_1" || echo "$ENDPOINT_URL_2")
  send_data "$ENDPOINT" "$ASSET_JSON" "v3/assets"
done

# Register Contract Definitions
CONTRACT_JSON=$(generate_contract_json "offer-all-assets" "always-true" "always-true")
send_data "$ENDPOINT_URL_1" "$CONTRACT_JSON" "v3/contractdefinitions"
send_data "$ENDPOINT_URL_2" "$CONTRACT_JSON" "v3/contractdefinitions"
