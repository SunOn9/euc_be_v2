#!/usr/bin/bash

rm -rf generated/*

mkdir -p generated/euc
mkdir -p generated/mailer
mkdir -p generated/profile

pwd=$(pwd)

cd protos/mailer

PLUGIN_PATH="$pwd/node_modules/.bin/protoc-gen-ts_proto"

OPTION="--ts_proto_opt=useOptionals=none,\
snakeToCamel=true,\
stringEnums=true,\
addNestjsRestParameter=true,\
usePrototypeForDefaults=true,\
useSnakeTypeName=true,\
outputServices=grpc-js"

#generate for euc

# PROTO_OUT="--ts_proto_out=$pwd/generated/euc"
# protoc --plugin=$PLUGIN_PATH "$OPTION" "$PROTO_OUT" ./euc/api.proto

#generate for mailer

PROTO_OUT_MAILER="--ts_proto_out=$pwd/generated/mailer/"

protoc --plugin=$PLUGIN_PATH --ts_proto_opt=nestJs=true "$PROTO_OUT_MAILER" ./api.proto

protoc --plugin=$PLUGIN_PATH $OPTION "$PROTO_OUT_MAILER" ./mailer.request.proto ./mailer.reply.proto

#generate for profile

# PROTO_OUT_PROFILE="--ts_proto_out=$pwd/generated/profile/"

# protoc --plugin=$PLUGIN_PATH --ts_proto_opt=nestJs=true "$PROTO_OUT_PROFILE" ./profile/api.proto
