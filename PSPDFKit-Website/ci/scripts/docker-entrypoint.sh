#!/usr/bin/env bash

# See: https://stackoverflow.com/a/52092711/4616472

node_modules_destination="/srv/www.pspdfkit.com/web/current/node_modules"

if ! [ -d "$node_modules_destination" ]; then
  cp -r /srv/www.pspdfkit.com/shared/node_modules "$node_modules_destination"
fi

exec "$@"
