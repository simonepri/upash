<p align="center">
  <a href="https://github.com/simonepri/upash">
    <img src="https://github.com/simonepri/upash/raw/upash/media/upash.png" alt="upash" width="600"/>
  </a>
</p>

## Migration from `credential-plus` package
If your are using the [credential-plus][npm:credential-plus] package, the
migration to [upash][upash] is straight-forward.  

### If you were using it in combination with `credential-plus-argon2`

Change this:
```js
const credential = require('credential-plus');
credential.install(require('credential-plus-argon2'));

/* HASH */
// `timeCost`, `memoryCost` and `parallelism` are optional numeric parameters
const phash = await credential.hash(password, {func: 'argon2', timeCost, memoryCost, parallelism});
// save `phash` to the db

/* VERIFY */
// read `phash` from the db
const match = await credential.verify(phash, password);
```

Into this:
```js
const upash = require('@upash/universal');
upash.install('argon2', require('@upash/argon2'));

/* HASH */
// `timeCost`, `memoryCost` and `parallelism` are optional numeric parameters
const hash = await upash.hash('argon2', password, {timeCost, memoryCost, parallelism});
const hinfo = {func: 'argon2', hash: hash};
const phash = JSON.stringify(hinfo);
// save `phash` to the db

/* VERIFY */
// read `phash` from the db
const hinfo = JSON.parse(phash);
const match = await upash.verify(hinfo.func, hinfo.hash, password);
```

### If you were using it in combination with `credential-plus-scrypt`
Change this:
```js
const credential = require('credential-plus');
credential.install(require('credential-plus-scrypt'));

/* HASH */
// `maxtime`, `maxmem` and `maxmemfrac` are optional numeric parameters
const phash = await credential.hash(password, {func: 'scrypt', maxtime, maxmem, maxmemfrac});
// save `phash` to the db

/* VERIFY */
// read `phash` from the db
const match = await credential.verify(phash, password);
```

Into this:
```js
const upash = require('@upash/universal');
upash.install('scrypt', require('@upash/scrypt'));

/* HASH */
// `maxtime`, `maxmem` and `maxmemfrac` are optional numeric parameters
const hash = await upash.hash('scrypt', password, {maxtime, maxmem, maxmemfrac});
const hinfo = {func: 'scrypt', hash: hash};
const phash = JSON.stringify(hinfo);
// save `phash` to the db

/* VERIFY */
// read `phash` from the db
const hinfo = JSON.parse(phash);
const match = await upash.verify(hinfo.func, hinfo.hash, password);
```

### If you were using it in combination with `credential-plus-bcrypt`
Change this:
```js
const credential = require('credential-plus');
credential.install(require('credential-plus-bcrypt'));

/* HASH */
// `rounds` is an optional numeric parameter
const phash = await credential.hash(password, {func: 'bcrypt', rounds});
// save `phash` to the db

/* VERIFY */
// read `phash` from the db
const match = await credential.verify(phash, password);
```

Into this:
```js
const upash = require('@upash/universal');
upash.install('bcrypt', require('@upash/bcrypt'));

/* HASH */
// `rounds` is an optional numeric parameter
const hash = await upash.hash('bcrypt', password, {rounds});
const hinfo = {func: 'bcrypt', hash: hash};
const phash = JSON.stringify(hinfo);
// save `phash` to the db

/* VERIFY */
// read `phash` from the db
const hinfo = JSON.parse(phash);
const match = await upash.verify(hinfo.func, hinfo.hash, password);
```

### If you were using it in combination with `credential-plus-pbkdf2`
Change this:
```js
const credential = require('credential-plus');
credential.install(require('credential-plus-pbkdf2'));

/* HASH */
// `iterations`, `keylen` and `digest` are optional parameters
const phash = await credential.hash(password, {func: 'pbkdf2', iterations, keylen, digest});
// save `phash` to the db

/* VERIFY */
// read `phash` from the db
const match = await credential.verify(phash, password);
```

Into this:
```js
const upash = require('@upash/universal');
upash.install('pbkdf2', require('@upash/pbkdf2'));

// `iterations`, `keylen` and `digest` are optional parameters
const hash = await upash.hash('pbkdf2', password, {iterations, keylen, digest});
const hinfo = {func: 'pbkdf2', hash: hash};
const phash = JSON.stringify(hinfo);
// save `phash` to the db

/* VERIFY */
// read the new `phash` or the old `phash` from the db
const hinfo = JSON.parse(phash);
try {
  // convert passwords hashed before the migration into the new format
  const hdata = JSON.parse(hinfo.hash);
  hinfo.hash = [hdata.secret, hdata.salt, hdata.iterations, hdata.keylen, hdata.digest].join(',');
  phash = JSON.stringify(hinfo);
  // update `phash` into the db
} catch (err) {}
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

[npm:credential-plus]: https://www.npmjs.com/package/credential-plus
