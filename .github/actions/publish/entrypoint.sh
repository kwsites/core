#!/bin/bash

set -euo pipefail

if [ -z "$INPUT_BUMP" ]
then
    echo "bump input not specified."
    exit -1
fi

# Generate environment variables
REMOTE_REPO="https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

# Ensure required files exist
touch ~/.npmrc

# Setup SSH keys so we can push lerna commits and tags to master branch

# The script is run as root so we need to allow npm to execute scripts as root.
echo "unsafe-perm = true" >> ~/.npmrc

# Configure source control
git config http.sslVerify false
git config user.email "$INPUT_EMAIL"
git config user.name "$INPUT_USERNAME"

git remote add kwsites $REMOTE_REPO
git show-ref
git fetch kwsites --unshallow --tags

git branch --verbose
git remote --verbose

# Run lerna
node_modules/.bin/lerna publish $INPUT_EXTRA_ARGUMENTS --git-remote=kwsites --registry=$INPUT_REGISTRY --yes $INPUT_BUMP
