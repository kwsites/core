#!/bin/bash

set -euo pipefail

if [ -z "$INPUT_BUMP" ]
then
    echo "bump input not specified."
    exit -1
fi

# Ensure necessary files exist
touch ~/.npmrc

# Setup SSH keys so we can push lerna commits and tags to master branch

mkdir -p /root/.ssh
ssh-keyscan -t rsa github.com > /root/.ssh/known_hosts
echo "$GIT_DEPLOY_KEY" > /root/.ssh/id_rsa
chmod 400 /root/.ssh/id_rsa

# The script is run as root so we need to allow npm to execute scripts as root.
echo "unsafe-perm = true" >> ~/.npmrc

# Setup git and pull tags for Lerna

git config user.email "$INPUT_EMAIL"
git config user.name "$INPUT_USERNAME"

git remote set-url origin git@github.com:$GITHUB_REPOSITORY.git

git fetch --unshallow --tags

# Run lerna
node_modules/.bin/lerna publish $INPUT_EXTRA_ARGUMENTS --registry=$INPUT_REGISTRY --yes $INPUT_BUMP
