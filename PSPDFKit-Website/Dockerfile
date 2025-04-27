FROM ruby:2.6.2

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=en_US.UTF-8 \
    LC_ALL=en_US.UTF-8 \
    BUNDLER_VERSION=2.0.1 \
    NODEJS_VERSION=10.15.3 \
    YARN_VERSION=1.16.0

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      ca-certificates \
      build-essential \
      locales \
      wget \
    && echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen && locale-gen \
    && wget https://nodejs.org/dist/v${NODEJS_VERSION}/node-v${NODEJS_VERSION}-linux-x64.tar.gz -O /tmp/node.tar.gz \
    && wget https://github.com/yarnpkg/yarn/releases/download/v${YARN_VERSION}/yarn-v${YARN_VERSION}.tar.gz -O /tmp/yarn.tar.gz \
    && mkdir -p /usr/local/nodejs && cd /usr/local/nodejs && tar xfz /tmp/node.tar.gz --strip-components=1 \
    && mkdir -p /usr/local/yarn && cd /usr/local/yarn && tar xfz /tmp/yarn.tar.gz --strip-components=1 --warning=no-unknown-keyword \
    && rm -rf /tmp/* \
    && mkdir -p /srv/www.pspdfkit.com/web/current \
    && chmod 777 -R /srv \
    && gem install bundler:${BUNDLER_VERSION} --no-document

ENV PATH=/usr/local/yarn/bin:/usr/local/nodejs/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    BUNDLE_PATH=/srv/www.pspdfkit.com/shared/bundle \
    BUNDLE_JOBS=6 \
    HISTFILE=/dev/null

WORKDIR /srv/www.pspdfkit.com/shared

ADD Gemfile Gemfile.lock ./
RUN gem install bundler --version "$BUNDLER_VERSION" --no-document && bundle install

ADD package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

WORKDIR /srv/www.pspdfkit.com/web/current

ADD ci/scripts/docker-entrypoint.sh /usr/local/bin
ENTRYPOINT ["docker-entrypoint.sh"]
