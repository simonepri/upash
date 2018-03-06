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
const upash = require('@upash/universal');
upash.install('bcrypt', require('@upash/bcrypt'));

/* HASH */
// `rounds` is an optional numeric parameter
const hash = await upash.use('bcrypt').hash('password', {rounds});
// save `hash` to db

/* VERIFY */
// read `hash` from the db
const match = await upash.use('bcrypt').verify(hash, 'password');
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

[npm:bcrypt]: https://www.npmjs.com/package/bcrypt
