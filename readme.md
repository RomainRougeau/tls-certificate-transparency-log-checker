# tls-certificate-transparency-log-checker

[![Travis CI build status](https://travis-ci.org/neilstuartcraig/tls-certificate-transparency-log-checker.svg)](https://travis-ci.org/neilstuartcraig/tls-certificate-transparency-log-checker)  [![Known Vulnerabilities](https://snyk.io/test/npm/tls-certificate-transparency-log-checker/badge.svg)](https://snyk.io/test/npm/tls-certificate-transparency-log-checker)


## HEALTH WARNING!
**This is still in early stage development and subject to change, prone to bugs and only partially complete.**

## Overview
A super simple program to check TLS certificate transparency logs for one or more domain name patterns and alert on new or unexpected (e.g. issued by a certificate authority that you don't normally use) certificates.

This app offers both simple, unix-style command line functionality and a consumable API/library. The end goal is to create a small service which can be used (as an example) as an AWS Lambda function which is triggered by a Cloudwatch event and can raise Cloudwatch alarms which can notify e.g. an ops team.

The source of data for this package is [crt.sh](https://crt.sh), a certificate transparency log aggregator. We make use of the RSS feeds crt.sh provides so please don't abuse them (e.g. by running tests very frequently).

## Prerequisites

* [NodeJS](https://nodejs.org/) and [NPM](https://www.npmjs.com/) (NPM is included in the installers from nodejs.org)


## Installation

```
npm install tls-certificate-transparency-log-checker --production
```

Note: If you're looking to do development work on this, omit the `--production` argument - but you know that :smile:.

## Using tls-certificate-transparency-log-checker

### Using tls-certificate-transparency-log-checker as a library
You can simply `require` or `import` the library side of this package by listing it as a dependency in your `package.json` file and `require`ing or `import`ing as you would any other library. There's an example

### Using tls-certificate-transparency-log-checker as a command line client (CLI)
When you `npm install -g` this package, NPM will link a "binary" (yeah, it's not a binary, it's an executable - but that's a convention we have for some weird reason) which will allow you (from any path on your computer) to run:

```
check-ct-logs <args>
```

`tls-certificate-transparency-log-checker` is pretty typical of a \*nix-style CLI program in that it outputs to stdout (which means you can pipe or redirect its output) and it can return non-zero exit codes (see below or `-h`).

#### Arguments
To show available arguments, you can run:

```
check-ct-logs -h
```

#### Examples

See [examples page](./examples.md).  

#### Configuration helper
There's also a helper "binary" which will create a template config file for you in your current working directory:

```
create-ct-log-check-config
```

You can then edit this (the config file is a JSON doc with a simple [commonJS](https://en.wikipedia.org/wiki/CommonJS) wrapper) and run `check-ct-logs` using this new config file via:

```
check-ct-logs -c ./tls-certificate-transparency-log-checker-config.js
```

#### Non-global installations
Note that if you are *not* installing globally (i.e. you omit the `-g` from the `npm install -g ...` above) and you want to run the "binary", you'll need to use the configured script and the standard NPM argument semantic of prefixing the arguments with `--` e.g.:

```
npm run start -- <args>
```

## Development
I've set this project up such that it builds via [babel](https://babeljs.io/). I write code in [atom](https://atom.io/) and use the [language-babel](https://atom.io/packages/language-babel) plugin to automatically build on save - this is configured in the `.language-babel` config file in the project root. Source code is in `<project root>/src/` and transpiled files are in `<project root>/dist/`. Also noteworthy is the use of the babel plugin [babel-plugin-typecheck](https://github.com/codemix/babel-plugin-typecheck) which adds [flow](https://flowtype.org/) style function argument types but additionally over flow, enforces these at runtime (which I like very much, YMMV).


## Semver
This project aims to maintain the [semver](http://semver.org/) version numbering scheme.


## Changelog
See the [changelog](./changelog.md) file


## To do
* Improve testing & coverage
* Test and amend any problems running as Lambda Function (tests now pass on node v4)
* Make the mocked tests work with the `http2` library (they currently cheat and use `https` which is API-compatible)
* Get user feedback and implement improvements and fixes
* Look at whether it's worthwhile removing the dependency on crt.sh and querying the CT log API's directly (or not)


## Contributing
Contributions are *very* welcome for fixes, improvements, new features, documentation, bug reports and/or ideas. Please create a Github issue initially so we can discuss and agree actions/approach - that should save time all-round.

The ideal way to receive contributions is via a [Github Pull Request](https://help.github.com/articles/using-pull-requests/) from the master branch. Please ensure that at least unit tests (you can run these via `npm test`) and if possible, linter rules (`npm run lint`).

If you find a sensitive, security issue with this application, please email me privately in the first instance: `neil [dot] craig [at] thedotproduct [dot] org`.


## License
[MIT license](./license.md)
