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

## Migrate your own password hashing solution
If you are not building a new application, chances are high that you have
already implemented some hash/verify logic for your passwords.  

After everything is set, we strongly suggest you
[upgrade your algorithm][docs:upgrade-algorithm] by picking one of the ones
recommended.

You just need to create the following two function:

```js
async function myHashLogic(password, options) {
  /* Your custom code to generate the hash here. */
  const yourhash = /* Your own hash string */

  const hashstr = `$customidf$${yourhash}`;
  return hashstr;
}

async function myVerifyLogic(hashstr, password) {
  const yourhash = hashstr.split('$')[2];

  /* Your custom code to verify the hash here. */
  const match = /* True or false. */

  return match;
}
```

Then you can install them as a custom hashing function in that way:
```js
const upash = require('upash');
upash.install('custom', {
  hash: myHashLogic,
  verify: myVerifyLogic,
  identifiers: () => ['customidf'],
});

async function registration(email, password) {
  const hashstr = await upash.hash(password);
  const yourhash = hashstr.split('$')[2];

  // Create the new user into the database.
  const user = await db.users.new({email: email, yourhash: yourhash});
  return user;
}

async function login(email, password) {
  // Find the user in the database.
  const user = await db.users.find({email: email});
  if (user === null) return false;

  const yourhash = user.yourhash;
  const hashstr = `$customidf$${yourhash}`;

  const match = await upash.verify(hashstr, password);
  return match;
}
```

Note that you can change `customidf` with whatever string you want.
This is just to allow upash to understand which algorithm to use.

If the string that your logic generates it's already in [MCF][specs:mcf] or
[PHC][specs:phc] format, then you can just use the identifier contained in the
string instead of adding an artificial one.

<!-- Links -->
[upash]: https://github.com/simonepri/upash
[new issue]: https://github.com/simonepri/upash/issues/new

[specs:mcf]: https://github.com/ademarre/binary-mcf
[specs:phc]: https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md

[docs:upgrade-algorithm]: https://github.com/simonepri/upash/tree/master/docs/upgrade-algorithm.md

[license]: https://github.com/simonepri/upash/tree/master/license
