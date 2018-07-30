<p align="center">
  <a href="https://github.com/simonepri/upash">
    <img src="https://github.com/simonepri/upash/raw/master/media/upash.png" alt="upash" width="300"/>
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

## Upgrading your password hashing algorithm
If you are using the [upash][upash] package, upgrading to a new hashing algorithm
is straight-forward.  

Let's assume that you are currently using the `@phc/pbkdf2` package and that
your `registration` and `login` logic looks like this:

```js
const upash = require('upash');
upash.install('pbkdf2', require('@phc/pbkdf2'));

async function registration(email, password) {
  const hashstr = await upash.hash(password);

  // Create the new user into the database.
  const user = await db.users.new({email: email, hashstr: hashstr});
  return user;
}

async function login(email, password) {
  // Find the user in the database.
  const user = await db.users.find({email: email});
  if (user === null) return false;

  const match = await upash.verify(user.hashstr, password);
  return match;
}
```

And that you want to upgrade from `@phc/pbkdf2` to `@phc/argon2`.  
What you need to do, is just change your code to something like this:

```js
const upash = require('upash');
upash.install('pbkdf2', require('@phc/pbkdf2'));
upash.install('argon2', require('@phc/argon2'));

async function registration(email, password) {
  const hashstr = await upash.hash(password);

  // Create the new user into the database.
  const user = await db.users.new({email: email, hashstr: hashstr});
  return user;
}

async function login(email, password) {
  // Find the user in the database.
  const user = await db.users.find({email: email});
  if (user === null) return false;

  const match = await upash.verify(user.hashstr, password);

  if (match && upash.which(user.hashstr) !== 'argon2') {
    // Re-Hash using the new algorithm.
    const hashstr = await upash.use('argon2').hash(password);
    // Update the hash for the user into the database.
    user.hashstr = hashstr;
    await user.save();
  }
  return match;
}
```

## Contributing
Contributions are REALLY welcome and if you find a security flaw in this code,
or the guide seems you incomplete PLEASE [report it][new issue].  

## License
This project is licensed under the MIT License - see the [license][license] file for details.

<!-- Links -->
[upash]: https://github.com/simonepri/upash
[new issue]: https://github.com/simonepri/upash/issues/new

[license]: https://github.com/simonepri/upash/tree/master/license
