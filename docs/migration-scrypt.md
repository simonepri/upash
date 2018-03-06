<p align="center">
  <a href="https://github.com/simonepri/upash">
    <img src="https://github.com/simonepri/upash/raw/master/media/upash.png" alt="upash" width="600"/>
  </a>
</p>
<p align="center">
  <!-- Mentioned - Awesome NodeJS -->
  <a href="https://github.com/sindresorhus/awesome-nodejs#security">
    <img src="https://awesome.re/mentioned-badge.svg" alt="Mentioned in Awesome NodeJS" />
  </a>
  <!-- License - MIT -->
  <a href="https://github.com/simonepri/upash/tree/master/license">
    <img src="https://img.shields.io/github/license/simonepri/upash.svg" alt="Project license" />
  </a>
</p>

## Migration from `scrypt` package
If your are using the [scrypt][npm:scrypt] package, the migration to
[upash][upash] is straight-forward.  

Just change this:

```js
const scrypt = require('scrypt');
const Buffer = require('safe-buffer').Buffer;

/* HASH */
// `maxtime`, `maxmem` and `maxmemfrac` are optional numeric parameters
const hash = await = scrypt
  .params(maxtime, maxmem, maxmemfrac)
  .then(params => scrypt.kdf(password, params))
  .then(hash => hash.toString('base64'));
// save `hash` to the db

/* VERIFY */
// read `hash` from the db
const match = await scrypt.verifyKdf(Buffer.from(hash, 'base64'), Buffer.from(password));
```

Into this:

```js
const upash = require('@upash/universal');
upash.install('scrypt', require('@upash/scrypt'));

/* HASH */
// `maxtime`, `maxmem` and `maxmemfrac` are an optional numeric parameters
const hash = await upash.use('scrypt').hash('password', {maxtime, maxmem, maxmemfrac});
// save `hash` to the db

/* VERIFY */
// read `hash` from the db
const match = await upash.use('scrypt').verify(hash, 'password');
```

## Contributing
Contributions are REALLY welcome and if you find a security flaw in this code,
or the guide seems you incomplete PLEASE [report it][new issue].  
Please check the [contributing guidelines][contributing] for more details.  
Thanks!

## License
This project is licensed under the MIT License - see the [license][license] file for details.

<!-- Links -->
[upash]: https://github.com/simonepri/upash

[new issue]: https://github.com/simonepri/upash-scrypt/issues/new

[license]: https://github.com/simonepri/upash/tree/master/license
[contributing]: https://github.com/simonepri/upash-scrypt/tree/master/.github/contributing.md

[npm:scrypt]: https://www.npmjs.com/package/scrypt
