# post-npm-install [<img src="https://jonathantneal.github.io/js-logo.svg" alt="post-npm-install" width="90" height="90" align="right">][post-npm-install]

[<img alt="npm version" src="https://img.shields.io/npm/v/post-npm-install.svg" height="20">](https://www.npmjs.com/package/post-npm-install)
[<img alt="build status" src="https://img.shields.io/travis/jonathantneal/post-npm-install.svg" height="20">](https://travis-ci.org/jonathantneal/post-npm-install)

[post-npm-install] runs `npm install` when package.json dependencies have
changed post-merge or post-rebase.

```sh
npm install post-npm-install --save-dev
```

## NPM CI

[post-npm-install] supports NPM CI if the repository has a `package-lock.json` and the `npm ci` command is present.
To make use of `npm ci`, just add `ci` as the first argument to `post-npm-install`.

```sh
post-npm-install ci
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
`postNpmInstall` takes a boolean argument indicating whether or not to use `npm ci`.
```js
const postNpmInstall = require('post-npm-install');

postNpmInstall(true);
```

[husky]: https://github.com/typicode/husky
[post-npm-install]: https://github.com/jonathantneal/post-npm-install
