npm run build:lib &&
# npm run build:online &&

npm config set registry https://registry.npmjs.org/ &&
npm publish &&
npm config set registry https://registry.npmmirror.com/


VERSION="v$(npm view ./ version)"
git add .
git commit -m "chore: version $VERSION"
git tag $VERSION
git push origin $VERSION
