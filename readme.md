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

#### Highlights
- Single API for all password hashing algorithms
- Always up to date secure default configurations
- CLI available

Do you believe that this is *useful*?
Has it *saved you time*?
Or maybe you simply *like it*?  
If so, [show your appreciation with a Star ⭐️][start].

## Background
Media covers the theft of large collections of passwords on an almost daily
basis. Media coverage of password theft discloses the password storage scheme,
the weakness of that scheme, and often discloses a large population of
compromised credentials that can affect multiple websites or other applications.

Proper storage helps prevent theft, compromise, and malicious use of credentials.
Information systems store passwords and other credentials in a variety of
protected forms. Common vulnerabilities allow the theft of protected passwords
through attack vectors such as SQL Injection. Protected passwords can also be
stolen from artifacts such as logs, dumps, and backups.

The function used to protect stored credentials should balance attacker and
defender verification. The defender needs an acceptable response time for
verification of users’ credentials during peak use. However, the time required
to map `<credential> → <protected form>` must remain beyond threats’ hardware
(GPU, FPGA) and technique (dictionary-based, brute force, etc) capabilities.

Adaptive one-way functions compute a one-way (irreversible) transform.
Each function allows configuration of ‘work factor’. Underlying mechanisms
used to achieve irreversibility and govern work factors (such as time, space,
and parallelism) vary between functions.
Defenders adjust work factor to keep pace with threats’ increasing hardware
capabilities. Those implementing adaptive one-way functions must tune work
factors so as to impede attackers while providing acceptable user experience and
scale.

Since resources are normally considered limited, a common rule of thumb for
tuning the work factor (or cost) is to make the function run as slow as
possible without affecting the users' experience and without increasing the need
for extra hardware over budget. So, if the registration and authentication's
cases accept the function taking up to 1 second, you can tune the cost so that
it takes 1 second to run on your hardware. This way, it shouldn't be so slow
that your users become affected, but it should also affect the attackers'
attempt as much as possible. While there is a minimum number of iterations
recommended to ensure data safety, this value changes every year as technology
improves.

<sub>
  Part of the content of this section has been adapted from this
  <a href="https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet">OWASP</a>
  article and is covered by the
  <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
  license.
</sub>

## Functions available
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

## Suggested usage
You can choose to use directly one of the functions listed before, but our
advice is to use them through the [@upash/universal][universal] package.

In that way, in the eventuality that you will ever need to change the hashing
algorithm of your choice in the future, you can do it without any additional
logic by just installing a new function.  
You can find more information about the upgrade process in the following
sections.

```js
const upash = require('@upash/universal');

// Install argon2 hashing functions
upash.install('argon2', require('@upash/argon2'));

// Hash and verify with argon2 using default secure configs
const hash = await upash.hash('argon2', 'Super Secret Password');
const hinfo = {func:'argon2', hash: hash};
// You can store this directly in your database as plain object or stringified

// Then you can verify against it in this way
const match = await upash.verify(hinfo.func, hinfo.hash, 'Super Secret Password');
```

## Migrating your existing password hashing solution
If you're not building a new application, chances are high that you have
already implemented some hash/verify logic for your passwords.
The following documentation provide some good guidance on how to accomplish an
upgrade in place without adversely affecting existing user accounts and future
proofing your upgrade so you can seamlessly upgrade again
(which you eventually will need to do).

- Migrating from [credential-plus][docs:migration-credential-plus]
- Migrating from [credential][docs:migration-credential]
- Migrating from [argon2][docs:migration-argon2]
- Migrating from [scrypt][docs:migration-scrypt]
- Migrating from [bcrypt][docs:migration-bcrypt]
- Migrating from [other libraries][docs:migration-others]

Please if you don't find a migration documentation that fits your case,
[open an issue][new issue].

## Upgrading your password hashing algorithm
Upgrading the hashing algorithm used to hash passwords inside your application
can be a really painful operation if not done well.
You should take a lot of attention in order to not adversely affect existing
user accounts  

[This article](https://veggiespam.com/painless-password-hash-upgrades/) is a
nice start that should give you some ideas on what are the problems related to
that process.  

Example of implementations can be found in the [dedicated documentation page][docs:upgrade-algorithm].

## CLI
<img src="https://github.com/simonepri/upash/raw/master/media/cli.gif" alt="upash cli" width="400" align="right"/>

The idea behind this project is to make Password Hashing Algorithms as
accessible as possible.  
For this reason, the Unified APIs are also available through a CLI.

The CLI lets you hash and verify password directly from your terminal.  
You can use it to test work, memory and parallelism parameters on different
machines.

For installation and usage information about the CLI, see the [@upash/cli][cli]
page.
<br/><br/>


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
[upash:pronounce]: https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=u-pash

[specs:argon2]: https://password-hashing.net/argon2-specs.pdf
[specs:pbkdf2]: http://www.ietf.org/rfc/rfc2898.txt
[specs:scrypt]: http://www.tarsnap.com/scrypt/scrypt.pdf
[specs:bcrypt]: https://www.openbsd.org/papers/bcrypt-paper.pdf

[docs:migration-credential-plus]: https://github.com/simonepri/upash/tree/master/docs/migration-credential-plus.md
[docs:migration-credential]: https://github.com/simonepri/upash/tree/master/docs/migration-credential.md
[docs:migration-argon2]: https://github.com/simonepri/upash/tree/master/docs/migration-argon2.md
[docs:migration-scrypt]: https://github.com/simonepri/upash/tree/master/docs/migration-scrypt.md
[docs:migration-bcrypt]: https://github.com/simonepri/upash/tree/master/docs/migration-bcrypt.md
[docs:migration-others]: https://github.com/simonepri/upash/tree/master/docs/migration-others.md
[docs:upgrade-algorithm]: https://github.com/simonepri/upash/tree/master/docs/upgrade-algorithm.md
