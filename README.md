# credential-plus
[![Travis CI](https://travis-ci.org/simonepri/credential-plus.svg?branch=master)](https://travis-ci.org/simonepri/credential-plus) [![Codecov](https://img.shields.io/codecov/c/github/simonepri/credential-plus/master.svg)](https://codecov.io/gh/simonepri/credential-plus) [![npm](https://img.shields.io/npm/dm/credential-plus.svg)](https://www.npmjs.com/package/credential-plus) [![npm version](https://img.shields.io/npm/v/credential-plus.svg)](https://www.npmjs.com/package/credential-plus) [![npm dependencies](https://david-dm.org/simonepri/credential-plus.svg)](https://david-dm.org/simonepri/credential-plus) [![npm dev dependencies](https://david-dm.org/simonepri/credential-plus/dev-status.svg)](https://david-dm.org/simonepri/credential-plus#info=devDependencies)
> 🛡 Easy password hashing and verification in Node. Protects against brute force, rainbow tables, and timing attacks.

## Install

```
$ npm install --save credential-plus
```

## Usage
```js
const credential = require('credential-plus');
// Coming soon.
```

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
Default: `'pbkdf2'`

The name of the hash function to use.
Can be one of: `'pbkdf2'`, `'bcrypt'`, `'scrypt'`,`'argon2'`

Options available are different for each hash function. See [here](#options-1)
the list.

#### callback(err, hash)

Type: `function`

Called after the hash has been computed.

#### err

Type: `object`

Possible error thrown.

#### hash

Type: `object`

Stringified hash object that holds the generated hash string, the name of the
function used and the parameters passed to the hash funciton needed for the
verification process.


### verify(hash, input, callback)

Determines whether or not the user's input matches the stored password.

#### hash

Type: `string`

Stringified hash object generated from this package.

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

## Options

### pbkdf2

#### iterations

Type: `number`<br>
Default: 10000

Description

#### keylen

Type: `number`<br>
Default: 128

Description

#### digest

Type: `string`<br>
Default: 'sha512'

Description

### bcrypt

#### rounds

Type: `number`<br>
Default: 10

Description

### scrypt

#### maxtime

Type: `number`<br>
Default: 0.15

Description

#### maxmem

Type: `number`<br>
Default: 0

Description

#### maxmemfrac

Type: `number`<br>
Default: 0.5

Description

### argon2

#### type

Type: `number`<br>
Default: 0

Description

#### timeCost

Type: `number`<br>
Default: 3

Description

#### memoryCost

Type: `number`<br>
Default: 12

Description

#### parallelism

Type: `number`<br>
Default: 1

Description

#### hashLength

Type: `number`<br>
Default: 32

Description

## Authors
* **Simone Primarosa** - [simonepri](https://github.com/simonepri)

See also the list of [contributors](https://github.com/simonepri/credential-plus/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
