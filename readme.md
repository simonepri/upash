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
<p align="center">
  🔒 Unified APIs for Password Hashing Algorithms

  <br/>

  <sub>
    Coded with ❤️ by <a href="#authors">Simone Primarosa</a>.
  </sub>
</p>

## Synopsis
<img src="https://github.com/simonepri/upash/raw/master/media/api.png" alt="upash api" width="400" align="right"/>

The upash ([pronounced u-pash][upash:pronounce]) project provides you a
**U**nified API to implement secured and well-configured **p**assword
h**ash**ing algorithms inside your application.
***

#### Highlights
- [Single API](#why-a-unified-api) for all password hashing algorithms
- Always up to date secure default configurations
- Makes your hashing logic more maintainable and upgradable
- Allows you to test configurations through the [CLI](#cli)
- It has comprehensive [migration guides](#migrating-your-existing-password-hashing-solution)

Do you believe that this is *useful*?
Has it *saved you time*?
Or maybe you simply *like it*?  
If so, [show your appreciation with a Star ⭐️][start].

## Why a Unified API?
A [simple search on npm](https://www.npmjs.com/search?q=password%20hashing)
should be enough to convince you that there are lots of packages that deals with
password hashing. Some of them are strong and secure, while others are
old and unmaintained.
The only thing they _have in common_ is that each of them have their own API!  

Password hashing is already a pretty complicated topic on its own, why have we
made it even harder?  
To make things easier for everyone, upash provides you a set of packages that
abstracts all the complicated logic behind the common used password hashing
algorithms, giving you no way to use them wrongly.

Moreover an Unified API lets you change your hashing algorithm with ease in
the future!

## Usage
The upash solution is straight-forward but it is important to follow all the
steps carefully.

Firstly you need to install the `@upash/universal` package

```bash
npm install --save @upash/universal
```

Then you need to choose from the [list of available password hashing algorithms](#hash-functions)
the one that best suits your needs and install that too.  
In the following, we will assume that you choose `argon2`, that is also a
suitable solution in case you don't know which one fits better for you.

```bash
npm install --save @upash/argon2
```

Finally you can enjoy the easy APIs.

```js
const upash = require('@upash/universal');

// Install the hashing function.
upash.install('argon2', require('@upash/argon2'));

// Hash API.
const hash = await upash.use('argon2').hash('password provided by the user');
// => "$argon2i$v=19$m=4096,t=3,p=1$mTFYKhlcxmjS/v6Y8aEd5g$IKGY+vj0MdezVEKHQ9bvjpROoR5HPun5/AUCjQrHSIs"

// Verify API.
const match = await upash.use('argon2').verify(hash, 'password provided by the user');
// => true
```

> ⚠️ You can store the hash returned by the `hash` function directly into your database.

## Hash Functions
You can choose from one of the following functions to securely store your
credentials.
- [@upash/argon2][argon2]: is the winner of the
[password hashing competition][argon2:password-competition] and should be
considered as your first choice for new applications. [[specs]][specs:argon2]
- [@upash/pbkdf2][pbkdf2]: when FIPS certification or enterprise support on many platforms is
required. [[specs]][specs:pbkdf2]
- [@upash/scrypt][scrypt]: where resisting any/all hardware accelerated attacks is necessary but
support isn't. [[specs]][specs:scrypt]
- [@upash/bcrypt][bcrypt]: where PBKDF2 or scrypt support is not available. [[specs]][specs:bcrypt]

> ℹ️ We invite you to do your homework and research about all of them before
> talking a choice, our suggestion is to use argon2 if you can.

## Can I trust the defaults configurations?
All the functions provided comes pre-configured but fine tuning is always a good
practice.  
The defaults are maintained by the community and the aim of this project is to
bring together experts to be able to provide you reasonably secure default
configurations.

PLEASE if you know your stuff, have a look to the following issues and
provide your feedback.
- [Default configurations for argon2][configs:argon2]
- [Default configurations for pbkdf2][configs:pbkdf2]
- [Default configurations for scrypt][configs:scrypt]
- [Default configurations for bcrypt][configs:bcrypt]

🙏 Thank you!

## Test configurations through the CLI
<img src="https://github.com/simonepri/upash/raw/master/media/cli.gif" alt="upash cli" width="400" align="right"/>

Each function allows configuration of ‘work factor’. Underlying mechanisms used
to achieve irreversibility and govern work factors (such as time, space, and
parallelism) vary between functions.  

You want to adjust the work factor to keep pace with threats’ increasing hardware
capabilities so as to impede attackers while providing acceptable user experience
and scale.

A common rule of thumb for tuning the work factor (or cost) is to make the
function run as slow as possible without affecting the users' experience and
without increasing the need for extra hardware over budget.

The CLI lets you hash and verify password directly from your terminal.  
You can use it to test work, memory and parallelism parameters on different
machines.

For installation and usage information about the CLI, see the [@upash/cli][cli]
page.

## Migrating your existing password hashing solution
If you're not building a new application, chances are high that you have
already implemented some hash/verify logic for your passwords.
The following documentation provide some good guidance on how to accomplish an
upgrade in place without adversely affecting existing user accounts and future
proofing your upgrade so you can seamlessly upgrade again
(which you eventually will need to do).

- [Migrating from credential-plus][docs:migration-credential-plus]
- [Migrating from credential][docs:migration-credential]
- [Migrating from argon2][docs:migration-argon2]
- [Migrating from scrypt][docs:migration-scrypt]
- [Migrating from bcrypt][docs:migration-bcrypt]
- [Migrating from other libraries][docs:migration-others]

Please if you don't find a migration documentation that fits your case,
[open an issue][new issue].

## Upgrading your password hashing algorithm
Upgrading the hashing algorithm used to hash passwords inside your application
can be a really painful operation if not done well.
You should take a lot of attention in order to not adversely affect existing
user accounts  

[This article][migration:guide] is a
nice start that should give you some ideas on what are the problems related to
that process.  

Example of implementations can be found in the
[dedicated documentation page][docs:upgrade-algorithm].

## Related
- [@upash/universal][universal] -
🔒 Easy to use Unified API for all password hashing algorithms.
- [@upash/cli][cli] -
🔒 Easy to use CLI for all password hashing algorithms.
- [@upash/argon2][argon2] -
🔒 Easy to use Unified API for Argon2 password hashing algorithm.
- [@upash/scrypt][scrypt] -
🔒 Easy to use Unified API for scrypt password hashing algorithm.
- [@upash/bcrypt][bcrypt] -
🔒 Easy to use Unified API for bcrypt password hashing algorithm.
- [@upash/pbkdf2][pbkdf2] -
🔒 Easy to use Unified API for pbkdf2-crypt password hashing algorithm.

## Contributing
Contributions are REALLY welcome and if you find a security flaw in this code,
PLEASE [report it][new issue].  
Please check the [contributing guidelines][contributing] for more details.  
Thanks!

## Authors
- **Simone Primarosa** - *Follow* me on
*Github* ([:octocat:@simonepri][github:simonepri]) and on
*Twitter* ([🐦@simonepri][twitter:simonepri])

See also the list of [contributors][contributors] who participated in this project.

## License
This project is licensed under the MIT License - see the [license][license] file for details.

<!-- Links -->
[start]: https://github.com/simonepri/upash#start-of-content
[new issue]: https://github.com/simonepri/upash/issues/new
[contributors]: https://github.com/simonepri/upash/contributors

[license]: https://github.com/simonepri/upash/tree/master/license
[contributing]: https://github.com/simonepri/upash/tree/master/.github/contributing.md

[cli]: https://github.com/simonepri/upash-cli
[universal]: https://github.com/simonepri/upash-universal
[argon2]: https://github.com/simonepri/upash-argon2
[scrypt]: https://github.com/simonepri/upash-scrypt
[bcrypt]: https://github.com/simonepri/upash-bcrypt
[pbkdf2]: https://github.com/simonepri/upash-pbkdf2

[github:simonepri]: https://github.com/simonepri
[twitter:simonepri]: http://twitter.com/intent/user?screen_name=simoneprimarosa

[argon2:password-competition]: https://password-hashing.net/
[migration:guide]: https://veggiespam.com/painless-password-hash-upgrades/
[upash:pronounce]: https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=u-pash

[specs:argon2]: https://password-hashing.net/argon2-specs.pdf
[specs:pbkdf2]: http://www.ietf.org/rfc/rfc2898.txt
[specs:scrypt]: http://www.tarsnap.com/scrypt/scrypt.pdf
[specs:bcrypt]: https://www.openbsd.org/papers/bcrypt-paper.pdf


[configs:argon2]: https://github.com/simonepri/upash-argon2/issues/5)
[configs:pbkdf2]: https://github.com/simonepri/upash-pbkdf2/issues/5)
[configs:scrypt]: https://github.com/simonepri/upash-scrypt/issues/5)
[configs:bcrypt]: https://github.com/simonepri/upash-bcrypt/issues/5)

[docs:migration-credential-plus]: https://github.com/simonepri/upash/tree/master/docs/migration-credential-plus.md
[docs:migration-credential]: https://github.com/simonepri/upash/tree/master/docs/migration-credential.md
[docs:migration-argon2]: https://github.com/simonepri/upash/tree/master/docs/migration-argon2.md
[docs:migration-scrypt]: https://github.com/simonepri/upash/tree/master/docs/migration-scrypt.md
[docs:migration-bcrypt]: https://github.com/simonepri/upash/tree/master/docs/migration-bcrypt.md
[docs:migration-others]: https://github.com/simonepri/upash/tree/master/docs/migration-others.md
[docs:upgrade-algorithm]: https://github.com/simonepri/upash/tree/master/docs/upgrade-algorithm.md
