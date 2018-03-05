<p align="center">
  <a href="https://github.com/simonepri/upash">
    <img src="https://github.com/simonepri/upash/raw/master/media/upash.png" alt="upash" width="600"/>
  </a>
</p>

## Upgrading your password hashing algorithm
If you are using the [@upash/universal][universal] package, upgrading to a new
hashing algorithm is straight-forward.  

Let's assume that your `registration` and `login` logic looks like this:

```js
const upash = require('@upash/universal');
upash.install('pbkdf2', require('@upash/pbkdf2'));

async function registration(email, password) {
  const hash = upash.hash('pbkdf2', password);
  const hinfo = {func: 'pbkdf2', hash: hash};
  const phash = JSON.stringify(hinfo);
  // db.users.new({email: email, phash: phash});
}

async function login(email, password) {
  // const user = db.users.find({email: email});
  const hinfo = JSON.parse(user.phash);
  const match = upash.verify(hinfo.func, hinfo.hash);
  // do something with the match variable
}
```

And that you want to change `pbkdf2` to `argon2`.  
What you need to do, is just change your code to:

```js
const upash = require('@upash/universal');
upash.install('pbkdf2', require('@upash/pbkdf2'));
upash.install('argon2', require('@upash/argon2'));

async function registration(email, password) {
  const hash = upash.hash('argon2', password);
  const hinfo = {func: 'argon2', hash: hash};
  const phash = JSON.stringify(hinfo);
  // db.users.new({email: email, phash: phash});
}

async function login(email, password) {
  // const user = db.users.find({email: email});
  let hinfo = JSON.parse(user.phash);
  const match = upash.verify(hinfo.func, hinfo.hash);

  if (match && hinfo.func !== 'argon2') {
    const hash = upash.hash('argon2', password);
    hinfo = {func: 'argon2', hash: hash};
    const phash = JSON.stringify(hinfo);
    // db.users.update({email: email, phash: phash});
  }
  // do something with the match variable
}
```

## Contributing
Contributions are REALLY welcome and if you find a security flaw in this code,
or the guide seems you incomplete PLEASE [report it][new issue].  
Please check the [contributing guidelines][contributing] for more details.  
Thanks!

## License
This project is licensed under the MIT License - see the [license][license] file for details.

<!-- Links -->
[new issue]: https://github.com/simonepri/upash-scrypt/issues/new

[license]: https://github.com/simonepri/upash/tree/master/license
[contributing]: https://github.com/simonepri/upash-scrypt/tree/master/.github/contributing.md

[universal]: https://github.com/simonepri/upash-universal
