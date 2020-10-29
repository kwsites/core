FROM node:14.9-alpine

LABEL version="1.0.0"
LABEL repository="http://github.com/kwsites/core"
LABEL homepage="http://kwsites.co.uk"

LABEL com.github.actions.name="Lerna Publish"
LABEL com.github.actions.description="Lerna publish monorepo to npm"
LABEL com.github.actions.icon="package"

RUN apk add --no-cache bash git openssh

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
