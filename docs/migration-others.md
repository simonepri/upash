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

## Migration from custom implementations
If you are using a custom logic for your hashing/verification logic you can
still migrate to [upash][upash].

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
const hash = await upash.use('custom').hash('password', options);
// save `hash` to the db

/* VERIFY */
// read `hash` from the db
const match = await upash.use('custom').verify(hash, 'password');
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
