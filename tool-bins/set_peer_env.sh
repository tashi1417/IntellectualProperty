#!/bin/bash
# Sets the context for native peer commands
function usage {
  echo "Usage: . ./set_peer_env.sh ORG_NAME"
  echo "Sets the organization context for native peer execution"
}
if [ "$1" == "" ]; then
  usage
  exit
fi

echo "ORG_NAME input: $1"

# Computing ORG_CONTEXT
ORG_CONTEXT="${1^}" # Capitalize the first letter of the organization name
ORG_CONTEXT+="MSP" # Append "MSP" to the capitalized organization name

echo "ORG_CONTEXT after computation: $ORG_CONTEXT"

export ORG_NAME=$ORG_CONTEXT
echo "ORG_NAME after computation: $ORG_NAME"

# CORE_PEER_LOCALMSPID should be the same as ORG_NAME
export CORE_PEER_LOCALMSPID=$ORG_NAME
echo "CORE_PEER_LOCALMSPID: $CORE_PEER_LOCALMSPID"

# Logging specifications
export FABRIC_LOGGING_SPEC=INFO
echo "FABRIC_LOGGING_SPEC: $FABRIC_LOGGING_SPEC"

# Location of the core.yaml
export FABRIC_CFG_PATH=/workspaces/intellectualproperty/config/regulatoryauthorities
echo "FABRIC_CFG_PATH: $FABRIC_CFG_PATH"

# Address of the peer
export CORE_PEER_ADDRESS=regulatoryauthorities.$1.com:7051
echo "CORE_PEER_ADDRESS: $CORE_PEER_ADDRESS"

# Local MSP for the admin - Commands need to be executed as org admin
export CORE_PEER_MSPCONFIGPATH=/workspaces/intellectualproperty/config/crypto-config/peerOrganizations/$1.com/users/Admin@$1.com/msp
echo "CORE_PEER_MSPCONFIGPATH: $CORE_PEER_MSPCONFIGPATH"

# Address of the orderer
export ORDERER_ADDRESS=orderer.intellectualproperty.com:7050
echo "ORDERER_ADDRESS: $ORDERER_ADDRESS"

export CORE_PEER_TLS_ENABLED=false
echo "CORE_PEER_TLS_ENABLED: $CORE_PEER_TLS_ENABLED"
