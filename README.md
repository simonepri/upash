<h1 align="center">
  <img src="./media/credential-plus.png" alt="credential-plus" />
</h1>
<div align="center">
  <a href="https://travis-ci.org/simonepri/credential-plus"> <img src="https://travis-ci.org/simonepri/credential-plus.svg?branch=master" alt="build status"></a>
  <a href="https://codecov.io/gh/simonepri/credential-plus"><img src="https://img.shields.io/codecov/c/github/simonepri/credential-plus/master.svg" alt="code coverage" /></a>
  <a href="https://github.com/sindresorhus/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg" alt="code style" /></a>
  <a href="https://www.npmjs.com/package/credential-plus"><img src="https://img.shields.io/npm/v/credential-plus.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/credential-plus"><img src="https://img.shields.io/npm/dm/credential-plus.svg" alt="npm downloads" /></a>
  <a href="https://david-dm.org/simonepri/credential-plus"><img src="https://david-dm.org/simonepri/credential-plus.svg" alt="dependencies" /></a>
  <a href="https://david-dm.org/simonepri/credential-plus#info=devDependencies"><img src="https://david-dm.org/simonepri/credential-plus/dev-status.svg" alt="dev dependencies" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/simonepri/credential-plus-bcrypt.svg" alt="license" /></a>
</div>
<br />
<div align="center">
  🛡 Easy password hashing and verification in Node.
</div>
<div align="center">
  <sub>
    Protects against brute force, rainbow tables, and timing attacks.
  </sub>
</div>

## Install

```
$ npm install --save credential-plus
```

# Plugins

In order to use this package you need at least one plugin. (aka hash function)
You can chose one ore more of those plugins:

* [credential-plus-pbkdf2](https://github.com/simonepri/credential-plus-pbkdf2)
* [credential-plus-bcrypt](https://github.com/simonepri/credential-plus-bcrypt)
* [credential-plus-scrypt](https://github.com/simonepri/credential-plus-scrypt)
* [credential-plus-argon2](https://github.com/simonepri/credential-plus-argon2)

If you create your own plugin, please open a PR and add it to this list.

## Usage
Lets call `X` the plugin package of your choice.

```js
const credential = require('credential-plus');

// Installs the plugin. Replace 'X' with your choice.
credential.install(require('credential-plus-X'));

// Hash and verify with default configs.
credential.hash('We are all humans', {func: 'X'}, (err, hash) => {
  console.log(hash);
  //=> '{"hash":"generated hash", "func":"X"}'
  credential.verify(hash, 'We are all humans', (match) =>{
    console.log(match);
    //=> true
  })
  credential.verify(hash, 'We are all unicorns', (match) =>{
    console.log(match);
    //=> false
  })
});
```

You can find more detailed usage in the ***usage*** section of each plugin:

* [pbkdf2](https://github.com/simonepri/credential-plus-pbkdf2#usage)
* [bcrypt](https://github.com/simonepri/credential-plus-bcrypt#usage)
* [scrypt](https://github.com/simonepri/credential-plus-scrypt#usage)
* [argon2](https://github.com/simonepri/credential-plus-argon2#usage)

## API

### hash(password, options, callback)

Creates a new 'unique' hash from a password.

#### password

Type: `string`

The password to hash.

#### options

Type: `object`

Configurations for the hash function.

##### func

Type: `string`<br>

The name of the plugin (hash function) to use.
This is the only option field required.

Options available are different for each hash function.<br>
See the API section of the plugin you choose for more details:

* [pbkdf2](https://github.com/simonepri/credential-plus-pbkdf2#options)
* [bcrypt](https://github.com/simonepri/credential-plus-bcrypt#options)
* [scrypt](https://github.com/simonepri/credential-plus-scrypt#options)
* [argon2](https://github.com/simonepri/credential-plus-argon2#options)

#### callback(err, hash)

Type: `function`

Called after the hash has been computed.

#### err

Type: `object`

Possible error thrown.

#### hash

Type: `object`

The generated hash.

### verify(hash, input, callback)

Determines whether or not the user's input matches the stored password.

#### hash

Type: `string`

An hash generated from this package.

#### input

Type: `string`

User's input input.

#### callback(err, valid)

Type: `string`

Called after the verification process has been computed.

#### err

Type: `object`

Possible error thrown.

##### valid

Type: `boolean`

True if the hash computed for the input matches.

### install(plugin)

Installs an hash function plugin.

#### plugin

A plugin compatible with this package.

### plugins()

Returns the array of the installed plugins (hash functions).

## Authors
* **Simone Primarosa** - [simonepri](https://github.com/simonepri)

See also the list of [contributors](https://github.com/simonepri/credential-plus/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
