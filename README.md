# credential-plus
[![Travis CI](https://travis-ci.org/simonepri/credential-plus.svg?branch=master)](https://travis-ci.org/simonepri/credential-plus) [![Codecov](https://img.shields.io/codecov/c/github/simonepri/credential-plus/master.svg)](https://codecov.io/gh/simonepri/credential-plus) [![npm](https://img.shields.io/npm/dm/credential-plus.svg)](https://www.npmjs.com/package/credential-plus) [![npm version](https://img.shields.io/npm/v/credential-plus.svg)](https://www.npmjs.com/package/credential-plus) [![npm dependencies](https://david-dm.org/simonepri/credential-plus.svg)](https://david-dm.org/simonepri/credential-plus) [![npm dev dependencies](https://david-dm.org/simonepri/credential-plus/dev-status.svg)](https://david-dm.org/simonepri/credential-plus#info=devDependencies)
> 🛡 Easy password hashing and verification in Node. Protects against brute force, rainbow tables, and timing attacks.

More advanced version of the awesome [credential](https://github.com/ericelliott/credential) package.
If you find a security flaw in this code, please [report it](issues/new).

## Install

```
$ npm install --save credential-plus
```

## Usage
```js
const credential = require('credential-plus');

// Hash and verify with pbkdf2 and default configs
credential.hash('We are all unicorns', {func: 'pbkdf2'}, (err, hash) => {
  console.log(hash);
  //=> {"hash":"{\"secret\":\"fo3R+bNr2guklSeg1FGoWGIpyrDQ03aPeoTxP90zkVWAISZFIO5S0qQTZtmAAyrmzJFEPdDxK6BX3P3jo+MtG+Fvk5qr+Tfrx2QqemQjrJOLN506SxnqvVs1tlm81QteAgZ5/ZCA55Onv5W9f/EkxgSyrCyqcdkKi/KFXmCRZj4=\",\"salt\":\"6CWbt59QA3jGeQuozB7RhIvRLHtueOu3wLl5eFmU/cCvezPgW0/VuU+estR8HCkgV8CSfP+KM06Sv+ounMBru3zqeuEqbVU+bnRMqbyxJlpD8D0lsytS29LgGNwRx3/UtB7JKsykyR3d4vRW2+2ZLOlcIoc2lnZ5SJXDh8RVkjY=\",\"iterations\":10000,\"keylen\":128,\"digest\":\"sha512\"}","func":"pbkdf2"}
  credential.verify(hash, 'We are all unicorns', (match) =>{
    console.log(match);
    //=> true
  })
});

// Hash and verify with bcrypt and default configs
credential.hash('We are all unicorns', {func: 'bcrypt'}, (err, hash) => {
  console.log(hash);
  //=> {"hash":"$2a$10$fxxhS75tSP7sP/8UNNJs8uspHSfusSCafU.EhTsn15ENdm/9n3IQe","func":"bcrypt"}
  credential.verify(hash, 'We are all unicorns', (match) =>{
    console.log(match);
    //=> true
  })
});

// Hash and verify with scrypt and default configs
credential.hash('We are all unicorns', {func: 'scrypt'}, (err, hash) => {
  console.log(hash);
  //=> {"hash":"c2NyeXB0AA8AAAAIAAAAAdZuQumEF/m0V747VleWqvYZKhjOgXgQGtIsgOmLQwwc6KZuU2t1uEkqs9tABwGZyFHdCGkSxzpBLtMgx6UVtKwfcuRGKM2uGu1FvJt8avmU","func":"scrypt"}
  credential.verify(hash, 'We are all unicorns', (match) =>{
    console.log(match);
    //=> true
  })
});

// Hash and verify with argon2 and default configs
credential.hash('We are all unicorns', {func: 'argon2'}, (err, hash) => {
  console.log(hash);
  //=> {"hash":"$argon2d$v=19$m=4096,t=3,p=1$i5VhaDYfYqSWWoG1uKVBbw$QHpzhFRYJZwIcogtSciXh0hbc8f91PyGBdtWSNocuiE","func":"argon2"}
  credential.verify(hash, 'We are all unicorns', (match) =>{
    console.log(match);
    //=> true
  })
});

// Hash and verify with pbkdf2 and custom configs
credential.hash('We are all unicorns', {func: 'pbkdf2', digest: 'sha1', iterations: 15000}, (err, hash) => {
  console.log(hash);
  //=> {"hash":"{\"secret\":\"0SmO6mZB/pGebWX9rBhUDt06hkQ/2yV3Uso6qzyxEdNlXrvo5aX7QuLz9YlQc6iYbKSAO9s2OGi7V0B45TMzkmgQsFK+iFVqkbOlkk8ySyXHVrkISGZoIj9z+VLZ/3jaRCyDzI2dZfoR4IOI3GhYbK/c5jdTPO+YVp2zJHmNHOo=\",\"salt\":\"cxMTjM7yqvIfUoKjjC0nS5DBVXnQllT69DXrS89S2GmzxJrFZ44FCGwbydSQPE7RzzcDUo7C+l3nSh/79LUxWFhQzN7gaFNCKlBvMfSE4qFxU6jyqRTL12/XW1P7FxzE4dPSySXCql5GbryHJSWxofX7GljBKiVd+iYW4cfkUaM=\",\"iterations\":15000,\"keylen\":128,\"digest\":\"sha1\"}","func":"pbkdf2"}
  credential.verify(hash, 'We are all unicorns', (match) =>{
    console.log(match);
    //=> true
  })
});
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

The number of `pbkdf2` iterations.
The number of iterations recommended to ensure data safety changes every year as
technology improves.

#### keylen

Type: `number`<br>
Default: 128

The length of the generated keys.

#### digest

Type: `string`<br>
Default: 'sha512'

The digest algorithm. Available options are: `'sha1'`, `'sha256'`, `'sha512'`.

### bcrypt

#### rounds

Type: `number`<br>
Default: 10

The cost of processing the data.
See here https://www.npmjs.com/package/bcrypt#a-note-on-rounds

### scrypt

#### maxtime

Type: `number`<br>
Default: 0.15

The maximum amount of time in seconds scrypt will spend when computing the
derived key.

#### maxmem

Type: `number`<br>
Default: 0

The maximum number of bytes of RAM used when computing the derived encryption
key. If not present, will default to 0.

#### maxmemfrac

Type: `number`<br>
Default: 0.5

A double value between 0.0 and 1.0, representing the fraction (normalized
percentage value) of the available RAM used when computing the derived key.

### argon2

#### type

Type: `number`<br>
Default: 0

The type option is flexible and accepts.
`0`, `1` or `2` for `Argon2d`, `Argon2i` and `Argon2id` respectively.

#### timeCost

Type: `number`<br>
Default: 3

The amount of computation realized and therefore the execution time,
given in number of iterations.

#### memoryCost

Type: `number`<br>
Default: 12

The memory usage, given in kibibytes.

#### parallelism

Type: `number`<br>
Default: 1

The number of parallel threads.

#### hashLength

Type: `number`<br>
Default: 32

The length of the generated hash.

## Authors
* **Simone Primarosa** - [simonepri](https://github.com/simonepri)

See also the list of [contributors](https://github.com/simonepri/credential-plus/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
