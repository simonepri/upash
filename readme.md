<p align="center">
  <a href="https://github.com/simonepri/upash">
    <img src="https://github.com/simonepri/upash/raw/master/media/upash.png" alt="upash" width="600"/>
  </a>
</p>
<p align="center">
  <!-- CI - TravisCI -->
  <a href="https://travis-ci.com/simonepri/upash">
    <img src="https://img.shields.io/travis/com/simonepri/upash/master.svg?label=MacOS%20%26%20Linux" alt="Mac/Linux Build Status" />
  </a>
  <!-- CI - AppVeyor -->
  <a href="https://ci.appveyor.com/project/simonepri/upash">
    <img src="https://img.shields.io/appveyor/ci/simonepri/upash/master.svg?label=Windows" alt="Windows Build status" />
  </a>
  <!-- Coverage - Codecov -->
  <a href="https://codecov.io/gh/simonepri/upash">
    <img src="https://img.shields.io/codecov/c/github/simonepri/upash/master.svg" alt="Codecov Coverage report" />
  </a>
  <!-- DM - Snyk -->
  <a href="https://snyk.io/test/github/simonepri/upash?targetFile=package.json">
    <img src="https://snyk.io/test/github/simonepri/upash/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" />
  </a>
  <!-- DM - David -->
  <a href="https://david-dm.org/simonepri/upash">
    <img src="https://david-dm.org/simonepri/upash/status.svg" alt="Dependency Status" />
  </a>

  <br/>

  <!-- Code Style - XO-Prettier -->
  <a href="https://github.com/xojs/xo">
    <img src="https://img.shields.io/badge/code_style-XO+Prettier-5ed9c7.svg" alt="XO Code Style used" />
  </a>
  <!-- Test Runner - AVA -->
  <a href="https://github.com/avajs/ava">
    <img src="https://img.shields.io/badge/test_runner-AVA-fb3170.svg" alt="AVA Test Runner used" />
  </a>
  <!-- Test Coverage - Istanbul -->
  <a href="https://github.com/istanbuljs/nyc">
    <img src="https://img.shields.io/badge/test_coverage-NYC-fec606.svg" alt="Istanbul Test Coverage used" />
  </a>
  <!-- Init - ni -->
  <a href="https://github.com/simonepri/ni">
    <img src="https://img.shields.io/badge/initialized_with-ni-e74c3c.svg" alt="NI Scaffolding System used" />
  </a>
  <!-- Release - np -->
  <a href="https://github.com/sindresorhus/np">
    <img src="https://img.shields.io/badge/released_with-np-6c8784.svg" alt="NP Release System used" />
  </a>

  <br/>

  <!-- Mentioned - Awesome NodeJS -->
  <a href="https://github.com/sindresorhus/awesome-nodejs#security">
    <img src="https://awesome.re/mentioned-badge.svg" alt="Mentioned in Awesome NodeJS" />
  </a>
  <!-- Version - npm -->
  <a href="https://www.npmjs.com/package/upash">
    <img src="https://img.shields.io/npm/v/upash.svg" alt="Latest version on npm" />
  </a>
  <!-- License - MIT -->
  <a href="https://github.com/simonepri/upash/tree/master/license">
    <img src="https://img.shields.io/github/license/simonepri/upash.svg" alt="Project license" />
  </a>
</p>
<p align="center">
  🔒 <b>U</b>nified API for <b>PAS</b>sword <b>H</b>ashing algorithms

  <br/>

  <sub>
    Coded with ❤️ by <a href="#authors">Simone Primarosa</a>.
  </sub>
</p>

## Synopsis
Password breaches have become more and more frequent.  
See: [Yahoo][breach:yahoo] ([twice][breach:yahoo2]), [LinkedIn][breach:linkedin], [Adobe][breach:adobe],
[Ashley Madison][breach:ashley-madison], and [a whole lot more][breach:hibp-breaches].

Indeed, the above examples doubles as a list of "how NOT to do password
storage": simple hashing, unsalted values, misuse of encryption, and failed
password migration. (For more information on why these are bad, see our [introduction to password hashing theory][docs:password-hashing-theory])

There are two possible interpretations here: first, companies do not put adequate resources in securing passwords; and secondly, getting password hashing right is hard. Furthermore, even if you have followed previous best practice, keeping it right is another technical challenge: algorithm choices, security levels, parameter selection change regularly.

## Make passwords painless
<img src="https://github.com/simonepri/upash/raw/master/media/api.png" alt="upash api" width="400" align="right"/>

The upash ([pronounced u-pash][upash:pronounce]) project aims is to allow you to
have a clean and easy-to-use API to use any password hashing algorithm
seamlessly in your application.
***

#### Highlights
- Simple API for all password hashing algorithms
- Easy to maintain and [upgradable](#upgrading-your-password-hashing-algorithm) logic
- Easy to test configurations through the [CLI](#test-configurations-through-the-cli)
- Step by step [migration guide](#migrating-your-existing-password-hashing-solution)
- Comprehensive list of supported [hashing algorithms](#recommended-algorithms-implementations)

## Usage
The upash solution is straight-forward but it is important to follow all the
steps carefully.

Firstly, you need to install this package.

```bash
npm install --save upash
```
Then, you need to choose from the [list of supported password hashing algorithms](#hash-functions)
the one that best suits your needs and install that too.  
In the following, we will assume that you choose `@phc/argon2`, that is also a
suitable solution in case you don't know which one fits better for you.

```bash
npm install --save @phc/argon2
```

Finally, you can enjoy the easy APIs.

```js
const upash = require('@upash');

// Install the algorithm of your choice.
upash.install('argon2', require('@phc/argon2'));

// Hash API
const hashstr = await upash.hash('password');
// => "$argon2id$v=19$m=4096,t=3,p=1$PcEZHj1maR/+ZQynyJHWZg$2jEN4xcww7CYp1jakZB1rxbYsZ55XH2HgjYRtdZtubI"

// Verify API
const match = await upash.verify(hashstr, 'password');
// => true
```

You can store the hash returned by the `hash` function directly into your database.

You can also install more than one algorithm at once.  
This is really handy when you want to update your current password hashing
algorithm.

```js
const upash = require('@upash');

// Install the algorithms of your choice.
upash.install('pbkdf2', require('@phc/pbkdf2'));
upash.install('argon2', require('@phc/argon2'));

// You can explicitly tell upash which algorithm to use.
const hashstr_pbkdf2 = await upash.use('pbkdf2').hash('password');
// => "$pbkdf2-sha512$i=10000$O484sW7giRw+nt5WVnp15w$jEUMVZ9adB+63ko/8Dr9oB1jWdndpVVQ65xRlT+tA1GTKcJ7BWlTjdaiILzZAhIPEtgTImKvbgnu8TS/ZrjKgA"

// If you don't do so it will automatically use the last one installed.
const hashstr_argon2 = await upash.hash('password');
// => "$argon2i$v=19$m=4096,t=3,p=1$mTFYKhlcxmjS/v6Y8aEd5g$IKGY+vj0MdezVEKHQ9bvjpROoR5HPun5/AUCjQrHSIs"

// When you verify upash will automatically choose the algorithm to use based
// on the identifier contained in the hash string.
const match_pbkdf2 = await upash.verify(hashstr_pbkdf2, 'password');
// => true

// This will allow you to easily migrate from an algorithm to another.
const match_argon2 = await upash.verify(hashstr_argon2, 'password');
// => true
```

## Recommended algorithms implementations
The following is a curated list of algorithms that adhere to the upash APIs
guidelines and are ready to work at a production level straight out of the box.  
All the functions come pre-configured but fine-tuning is always a good practice.  
The defaults are maintained by the community and the aim of this project is also
to bring together experts to be able to provide you reasonably secure default
configurations.

#### Packages that adhere to the PHC string format
- [@phc/argon2][alg:@phc/argon2]
- [@phc/pbkdf2][alg:@phc/pbkdf2]
- [@phc/scrypt][alg:@phc/scrypt]
- [@phc/bcrypt][alg:@phc/bcrypt]

#### Other packages
- N/A

Want your package listed here? [Open an issue][new issue] and we will review it.

## Test configurations through the CLI
<img src="https://github.com/simonepri/upash/raw/master/media/cli.gif" alt="upash cli" width="400" align="right"/>

Generally, each function allows configuration of 'work factors’.
Underlying mechanisms used to achieve irreversibility and govern work factors
(such as time, space, and parallelism) vary between functions.  

You want to adjust the work factor to keep pace with threats' increasing hardware
capabilities so as to impede attackers while providing acceptable user experience
and scale.

A common rule of thumb for tuning the work factor (or cost) is to make the
function run as slow as possible without affecting the users' experience and
without increasing the need for extra hardware over budget.

The CLI lets you hash and verify password directly from your terminal.  
You can use it to test work, memory and parallelism parameters on different
machines.

For installation and usage information about the CLI, see the
[upash-cli][gh:upash-cli] page.

## Migrating your existing password hashing solution
If you are not building a new application, chances are high that you have
already implemented some hash/verify logic for your passwords.  
The [migration guide][docs:migration-guide] provides some good guidance on how
to accomplish an upgrade in place without adversely affecting existing user
accounts and future proofing your upgrade so you can seamlessly upgrade again
(which you eventually will need to do).

Please if you do not find a migration documentation that fits your case,
[open an issue][new issue].

## Upgrading your password hashing algorithm
Upgrading the hashing algorithm used to hash passwords inside your application
can be a really painful operation if not done well.
You should take a lot of attention in order to not adversely affect existing
user accounts.  

[This article][docs:ext:upgrade-algorithm] is a nice start that should give you
some ideas on what are the problems related to that process.  

Example of implementations can be found in the
[upgrade algorithm guide][docs:upgrade-algorithm].

## API
<dl>
<dt><a href="#install">install(name, algorithm)</a></dt>
<dd><p>Installs a compatible password hashing function.</p>
</dd>
<dt><a href="#uninstall">uninstall(name)</a></dt>
<dd><p>Uninstalls a password hashing function previously installed.</p>
</dd>
<dt><a href="#list">list()</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Gets the list of the installed password hashing functions.</p>
</dd>
<dt><a href="#use">use(name)</a> ⇒ <code>Object</code></dt>
<dd><p>Selects manually which password hashing function to use.
You can call hash and verify on the object returned.</p>
</dd>
<dt><a href="#which">which(hashstr)</a> ⇒ <code>string</code> | <code>null</code></dt>
<dd><p>Returns the name of the algorithm that has generated the hash string.</p>
</dd>
<dt><a href="#verify">verify(hashstr, password)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Determines whether or not the hash provided matches the hash generated for
the given password choosing the right algorithm based on the identifier
contained in the hash.</p>
</dd>
<dt><a href="#hash">hash(password, [options])</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Computes the hash string of the given password using the &#39;last&#39; algorithm
installed.</p>
</dd>
</dl>

<a name="install"></a>

### install(name, algorithm)
Installs a compatible password hashing function.

**Kind**: global function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the password hashing function. |
| algorithm | <code>Object</code> | The password hashing function object. |
| algorithm.hash | <code>function</code> | A function that takes a password and returns a cryptographically secure password hash string. |
| algorithm.verify | <code>function</code> | A function that takes a secure password hash string and a password and returns whether or not the password is valid for the given hash string. |
| algorithm.identifiers | <code>function</code> | A function that returns the list of identifiers that this password hashing algorithm is able to generate / verify. |

<a name="uninstall"></a>

### uninstall(name)
Uninstalls a password hashing function previously installed.

**Kind**: global function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the algorithm to uninstall or 'last' to uninstall the last one installed. |

<a name="list"></a>

### list() ⇒ <code>Array.&lt;string&gt;</code>
Gets the list of the installed password hashing functions.

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - The array of the available password hashing
functions.  
**Access**: public  
<a name="use"></a>

### use(name) ⇒ <code>Object</code>
Selects manually which password hashing function to use.
You can call hash and verify on the object returned.

**Kind**: global function  
**Returns**: <code>Object</code> - The password hashing function object.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>undefined</code> | The name of the algorithm to use. |

<a name="which"></a>

### which(hashstr) ⇒ <code>string</code> \| <code>null</code>
Returns the name of the algorithm that has generated the hash string.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>null</code> - The name of password hashing algorithm.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| hashstr | <code>string</code> | Secure hash string generated from this package. |

<a name="verify"></a>

### verify(hashstr, password) ⇒ <code>Promise.&lt;boolean&gt;</code>
Determines whether or not the hash provided matches the hash generated for
the given password choosing the right algorithm based on the identifier
contained in the hash.

**Kind**: global function  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - A boolean that is true if the hash computed
for the password matches.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| hashstr | <code>string</code> | Secure hash string generated from this package. |
| password | <code>string</code> | User's password input. |

<a name="hash"></a>

### hash(password, [options]) ⇒ <code>Promise.&lt;string&gt;</code>
Computes the hash string of the given password using the 'last' algorithm
installed.

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - The generated secure hash string.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | The password to hash. |
| [options] | <code>Object</code> | Optional configurations related to the hashing function. See the algorithm specific documentation for the options supported. |

## Contributing
Contributions are REALLY welcome and if you find a security flaw in this code,
PLEASE [report it][new issue].  

## Authors
- **Simone Primarosa** - *Github* ([@simonepri][github:simonepri]) • *Twitter* ([@simoneprimarosa][twitter:simoneprimarosa])

See also the list of [contributors][contributors] who participated in this project.

## License
This project is licensed under the MIT License - see the [license][license] file for details.

<!-- Links -->
[start]: https://github.com/simonepri/upash#start-of-content
[new issue]: https://github.com/simonepri/upash/issues/new
[contributors]: https://github.com/simonepri/upash/contributors

[license]: https://github.com/simonepri/upash/tree/master/license

[gh:upash-cli]: https://github.com/simonepri/upash-cli

[alg:@phc/argon2]: https://github.com/simonepri/upash-argon2
[alg:@phc/scrypt]: https://github.com/simonepri/upash-scrypt
[alg:@phc/bcrypt]: https://github.com/simonepri/upash-bcrypt
[alg:@phc/pbkdf2]: https://github.com/simonepri/upash-pbkdf2

[github:simonepri]: https://github.com/simonepri
[twitter:simoneprimarosa]: http://twitter.com/intent/user?screen_name=simoneprimarosa

[argon2:password-competition]: https://password-hashing.net/
[upash:pronounce]: https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=u-pash

[docs:migration-guide]: https://github.com/simonepri/upash/tree/master/docs/migrate-your-solution.md
[docs:upgrade-algorithm]: https://github.com/simonepri/upash/tree/master/docs/upgrade-algorithm.md
[docs:password-hashing-theory]: https://github.com/simonepri/upash/tree/master/docs/password-hashing-theory.md
[docs:ext:upgrade-algorithm]: https://veggiespam.com/painless-password-hash-upgrades/

[breach:yahoo]: https://help.yahoo.com/kb/account/SLN27925.html
[breach:yahoo2]: https://help.yahoo.com/kb/account/sln28092.html
[breach:linkedin]: https://motherboard.vice.com/en_us/article/78kk4z/another-day-another-hack-117-million-linkedin-emails-and-password
[breach:adobe]: https://www.troyhunt.com/adobe-credentials-and-serious/
[breach:ashley-madison]: https://krebsonsecurity.com/2015/07/online-cheating-site-ashleymadison-hacked/
[breach:hibp-breaches]: https://haveibeenpwned.com/PwnedWebsites
