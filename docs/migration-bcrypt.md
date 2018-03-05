<p align="center">
  <a href="https://github.com/simonepri/upash">
    <img src="https://github.com/simonepri/upash/raw/upash/media/upash.png" alt="upash" width="600"/>
  </a>
</p>

## Migration from `bcrypt` package
If your are using the [bcrypt][npm:bcrypt] package, the migration to
[upash][upash] is straight-forward.  

Just change this:
```js
const bcrypt = require('bcrypt');

/* HASH */
// `rounds` is an optional numeric parameter
const hash = await bcrypt.genSalt(rounds).then(salt => bcrypt.hash(password, salt));
// save `hash` to db

/* VERIFY */
// read `hash` from the db
const match = await bcrypt.compare('password', hash);
```

Into this:
```js
const bcrypt = require('@upash/bcrypt');

/* HASH */
// `rounds` is an optional numeric parameter
const hash = await bcrypt.hash('password', {rounds});
// save `hash` to db

/* VERIFY */
// read `hash` from the db
const match = await bcrypt.verify(hash, 'password');
```

Or, if you want to use [@upash/universal][universal], into this:
```js
const upash = require('@upash/universal');
upash.install('bcrypt', require('@upash/bcrypt'));

/* HASH */
// `rounds` is an optional numeric parameter
const hash = await upash.hash('bcrypt', 'password', {rounds});
const hinfo = {func: 'bcrypt', hash: hash};
const phash = JSON.stringify(hinfo);
// save `phash` to db

/* VERIFY */
// read new `phash` and old `hash` from the db
let hinfo;
if (phash) {
  hinfo = JSON.parse(phash);
} else {
  // convert passwords hashed before the migration into the new format
  hinfo = {func: 'bcrypt', hash: hash};
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

[npm:bcrypt]: https://www.npmjs.com/package/bcrypt
