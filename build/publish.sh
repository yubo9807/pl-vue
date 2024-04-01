npm run build:lib &&
npm run build:online &&

npm config set registry https://registry.npmjs.org/ &&
npm publish &&
npm config set registry https://registry.npmmirror.com/

PACKAGE_VERSION = $(jq '.version' package.json)
git tag "v$PACKAGE_VERSION" -a $PACKAGE_VERSION
git push origin "v$PACKAGE_VERSION"
git push origin main
