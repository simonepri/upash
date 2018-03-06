<p align="center">
  <a href="https://github.com/simonepri/upash">
    <img src="https://github.com/simonepri/upash/raw/master/media/upash.png" alt="upash" width="600"/>
  </a>
</p>

## Migration from `credential` package
If your are using the [credential][npm:credential] package, the migration to
[upash][upash] is straight-forward.  

Change this:
```js
const pify = require('pify');
const credential = require('credential')();

/* HASH */
// `iterations`, `keylen` and `digest` are optional parameters
const hash = await pify(credential.hash)(password);
// save `hash` to the db

/* VERIFY */
// read `hash` from the db
const match = await pify(credential.verify)(hash, password);
```

Into this:
```js
const pbkdf2 = require('@upash/pbkdf2');

/* HASH */
// `timeCost`, `memoryCost` and `parallelism` are optional numeric parameters
const hash = await pbkdf2.hash('password', {timeCost, memoryCost, parallelism});
// save `hash` to the db

/* VERIFY */
// read `hash` from the db
try {
  // convert passwords hashed before the migration into the new format
  const hdata = JSON.parse(hash);
  hash = [hdata.hash, hdata.salt, hdata.iterations, hdata.keyLength, 'sha1'].join(',');
  // update `hash` into the db
} catch (err) {}
const match = await pbkdf2.verify(hash, 'password');
```

Or, if you want to use [@upash/universal][universal], into this:
```js
const upash = require('@upash/universal');
upash.install('pbkdf2', require('@upash/pbkdf2'));

// `iterations`, `keylen` and `digest` are optional parameters
const hash = await upash.use('pbkdf2').hash(password, {iterations, keylen, digest});
const hinfo = {func: 'pbkdf2', hash: hash};
const phash = JSON.stringify(hinfo);
// save `phash` to the db

/* VERIFY */
// read the new `phash` or the old `hash` from the db
const hinfo;
if (phash) {
  hinfo = JSON.parse(phash);
} else {
  // convert passwords hashed before the migration into the new format
  const hdata = JSON.parse(hash);
  hinfo = {
    func: 'pbkdf2',
    hash: [hdata.hash, hdata.salt, hdata.iterations, hdata.keyLength, 'sha1'].join(',')
  };
  phash = JSON.stringify(hinfo);
  // update `phash` into the db
} catch (err) {}
const match = await upash.use(hinfo.func).verify(hinfo.hash, password);
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

[npm:credential]: https://www.npmjs.com/package/credential
