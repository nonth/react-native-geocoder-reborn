#!/usr/bin/env bash
set -ex
set -o nounset
set -o errtrace
set -o errexit
set -o pipefail

npm pack > /dev/null

PROJECT="GeocoderE2EApp"
NPM_PACKAGE="react-native-geocoder-*.tgz"

cd e2e
echo "Init project ${PROJECT}"
rm -rf $PROJECT
npx react-native init $PROJECT

cd $PROJECT
echo "Install package under test ${NPM_PACKAGE}"
npm install ../../$NPM_PACKAGE > /dev/null
rm -rf ../../$NPM_PACKAGE

# echo "Prepare android"
# rnpm link react-native-geocoder

echo "Prepare JS app"
cp ../js/index.android.js .

echo "Compile android"
cd android
./gradlew clean assembleDebug
