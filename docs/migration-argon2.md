<p align="center">
  <a href="https://github.com/simonepri/upash">
    <img src="https://github.com/simonepri/upash/raw/master/media/upash.png" alt="upash" width="600"/>
  </a>
</p>

## Migration from `argon2` package
If your are using the [argon2][npm:argon2] package, the migration to
[upash][upash] is straight-forward.  

Just change this:
```js
const argon2 = require('argon2');

/* HASH */
// `timeCost`, `memoryCost` and `parallelism` are optional numeric parameters
const hash = await argon2.hash('password', {timeCost, memoryCost, parallelism});
// save `hash` to the db

/* VERIFY */
// read `hash` from the db
const match = await argon2.verify(hash, 'password');
```

Into this:
```js
const argon2 = require('@upash/argon2');

/* HASH */
// `timeCost`, `memoryCost` and `parallelism` are optional numeric parameters
const hash = await argon2.hash('password', {timeCost, memoryCost, parallelism});
// save `hash` to the db

/* VERIFY */
// read `hash` from the db
const match = await argon2.verify(hash, 'password');
```

Or, if you want to use [@upash/universal][universal], into this:
```js
const upash = require('@upash/universal');
upash.install('argon2', require('@upash/argon2'));

/* HASH */
// `timeCost`, `memoryCost` and `parallelism` are optional numeric parameters
const hash = await upash.hash('argon2', 'password', {timeCost, memoryCost, parallelism});
const hinfo = {func: 'argon2', hash: hash};
const phash = JSON.stringify(hinfo);
// save `phash` to the db

/* VERIFY */
// read new `phash` and old `hash` from the db
let hinfo;
if (phash) {
  hinfo = JSON.parse(phash);
} else {
  // convert passwords hashed before the migration into the new format
  hinfo = {func: 'argon2', hash: hash};
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

[npm:argon2]: https://www.npmjs.com/package/argon2
