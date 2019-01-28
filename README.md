# post-npm-install [<img src="https://jonathantneal.github.io/js-logo.svg" alt="post-npm-install" width="90" height="90" align="right">][post-npm-install]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]

[post-npm-install] runs `npm install` when package.json dependencies have
changed post-merge or post-rebase.

```sh
npm install post-npm-install --save-dev
```

## Git Usage

The post-merge hook runs after a successful merge command, which may
automatically occur after `git pull`. If `package.json` dependencies have
changed, [post-npm-install] automatically updates your local dependencies.

```sh
# create the post-merge hook
echo -e "#\!/usr/bin/env bash\npost-npm-install" > .git/hooks/post-merge

# make the post-merge hook executable
chmod +x .git/hooks/post-merge
```

## Husky Usage

[husky] makes git hooks easy.

```js
// package.json
{
  "husky": {
    "hooks": {
      "post-merge": "post-npm-install",
      "post-rebase": "post-npm-install"
    }
  }
}
```

## Node Usage

```js
const postNpmInstall = require('post-npm-install');

postNpmInstall();
```

[npm-url]: https://www.npmjs.com/package/post-npm-install
[npm-img]: https://img.shields.io/npm/v/post-npm-install.svg
[cli-url]: https://travis-ci.org/jonathantneal/post-npm-install
[cli-img]: https://img.shields.io/travis/jonathantneal/post-npm-install.svg

[husky]: https://github.com/typicode/husky
[post-npm-install]: https://github.com/jonathantneal/post-npm-install
