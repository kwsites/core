#!/bin/bash

set -euo pipefail

if [ -z "$INPUT_BUMP" ]
then
    echo "bump input not specified."
    exit -1
fi

# Generate environment variables
REMOTE_REPO="https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

# Configure the root user's npmrc file
NPM_CONFIG_FILE="${NPM_CONFIG_FILE-"$HOME/.npmrc"}"
NPM_HOST="${NPM_HOST-registry.npmjs.org}"
NPM_STRICT_SSL="${NPM_STRICT_SSL-true}"
NPM_SCHEMA="https"
if ! $NPM_STRICT_SSL; then
 NPM_SCHEMA="http"
fi

printf "//%s/:_authToken=%s\\nregistry=%s\\nstrict-ssl=%s" "$NPM_HOST" "$NPM_AUTH_TOKEN" "${NPM_SCHEMA}://$NPM_HOST" "${NPM_STRICT_SSL}" > "$NPM_CONFIG_FILE"
chmod 0600 "$NPM_CONFIG_FILE"

# Configure source control
git config http.sslVerify false
git config user.email "$INPUT_EMAIL"
git config user.name "$INPUT_USERNAME"

git remote add kwsites $REMOTE_REPO
git show-ref
git fetch kwsites --unshallow --tags

git branch --verbose

echo "tags"
git tag
git status

# Run lerna
node_modules/.bin/lerna run build --since
node_modules/.bin/lerna version --git-remote=kwsites --yes $INPUT_BUMP
node_modules/.bin/lerna publish --git-remote=kwsites --registry=$INPUT_REGISTRY --yes from-git

echo "tags"
git tag
git status
git push kwsites HEAD --tags
