<p align="center">
  <a href="https://github.com/simonepri/upash">
    <img src="https://github.com/simonepri/upash/raw/master/media/upash.png" alt="upash" width="600"/>
  </a>
</p>

## Migration from custom implementations
If you are using a custom logic for your hashing/verification logic you can
still migrate to [upash][upash] using [@upash/universal][universal].

You just need to create the following two function:
```js
function myHashLogic(password, options) {
  /* Your custom code here */
  return /* The computed hash as string */
}
function myVerifyLogic(hash, password) {
  /* Your custom code here */
  return /* true or false */
}
```

Then you can install them as a custom hashing function in that way:
```js
const upash = require('@upash/universal');
upash.install('custom', {
  hash: myHashLogic,
  verify: myVerifyLogic,
});

/* HASH */
// `options` is an optional object to pass to your custom hash function
const hash = await upash.hash('custom', 'password', options);
// save `hash` to the db

/* VERIFY */
// read `hash` from the db
const match = await upash.verify('custom', hash, 'password');
```

Or, if you want to use [@upash/universal][universal] and make it upgradable, into this:
```js
const upash = require('@upash/universal');
upash.install('custom', {
  hash: myHashLogic,
  verify: myVerifyLogic,
});

/* HASH */
// `options` is an optional object to pass to your custom hash function
const hash = await upash.use('custom').hash('password', options);
const hinfo = {func: 'custom', hash: hash};
const phash = JSON.stringify(hinfo);
// save phash to the db

/* VERIFY */
// read new `phash` and old `hash` from the db
let hinfo;
if (phash) {
  hinfo = JSON.parse(phash);
} else {
  // convert passwords hashed before the migration into the new format
  hinfo = {func: 'custom', hash: hash};
  phash = JSON.stringify(hinfo);
  // update `phash` into the db
}
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
