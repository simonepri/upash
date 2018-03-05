<p align="center">
  <a href="https://github.com/simonepri/upash">
    <img src="https://github.com/simonepri/upash/raw/master/media/upash.png" alt="upash" width="600"/>
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
const scrypt = require('@upash/scrypt');

/* HASH */
// `maxtime`, `maxmem` and `maxmemfrac` are an optional numeric parameters
const hash = await scrypt.hash('password', {maxtime, maxmem, maxmemfrac});
// save `hash` to the db

/* VERIFY */
// read `hash` from the db
const match = await scrypt.verify(hash, 'password');
```

Or, if you want to use [@upash/universal][universal], into this:
```js
const upash = require('@upash/universal');
upash.install('scrypt', require('@upash/scrypt'));

/* HASH */
// `maxtime`, `maxmem` and `maxmemfrac` are an optional numeric parameters
const hash = await upash.hash('scrypt', 'password', {maxtime, maxmem, maxmemfrac});
const hinfo = {func: 'scrypt', hash: hash};
const phash = JSON.stringify(hinfo);
// save phash to the db

/* VERIFY */
// read new `phash` and old `hash` from the db
let hinfo;
if (phash) {
  hinfo = JSON.parse(phash);
} else {
  // convert passwords hashed before the migration into the new format
  hinfo = {func: 'scrypt', hash: phash};
  phash = JSON.stringify(hinfo);
  // update `phash` into the db
}
const match = await upash.verify(hinfo.func, hinfo.hash, password);
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

[universal]: https://github.com/simonepri/upash-universal

[npm:scrypt]: https://www.npmjs.com/package/scrypt
