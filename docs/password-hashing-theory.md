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

## Why hash passwords?
Let's start with the most common use of passwords: user authentication.

The general setting is that an individual has a username and a password,
e.g. `username: alice` and `password: hunter2`.

When Alice first registers on a website, a new account is created, and the
password is stored in the database, so that Alice can prove she is indeed Alice

| id | username | password | creation-date | ... |
|----|----------|----------|---------------|-----|
| 1  | alice    | hunter2  | 2017-07-14    | ... |

However, if somebody gains access to this database with malicious intent -
whether external hackers, or internal such as a database admin - Alice's
password is sitting in the open.

This is bad, since Alice is a typical user who likes to re-use the same
password across multiple services. Unfortunately, service providers do
not have the luxury of assuming all users have unique, high-entropy passwords.

Hence we want to apply a [one-way function][owf] `f` to the password, so that
nobody can reverse the function `f(password)` and work out the password, but
given a password `other-password` it is easy to check whether
`f(password) == f(other-password)`.

From the wikipedia page, we learn that SHA256 is a candidate one-way function,
so we go ahead and use this as our hash function.

Now, our database might look something like this:

| id | username | password    | creation-date | ... |
|----|----------|-------------|---------------|-----|
| 1  | alice    | f52fbd32... | 2017-07-14    | ... |

This looks better, now the password isn't revealed in the clear. However, this
is actually not much better than the cleartext version.

**Plain cryptographic hash functions are not suitable for password hashing functions.**

Not SHA256, not SHA512, and no, not MD5.

## Brute force attacks
In the previous example, we simply applied SHA256 to attempt to hide the
password.

The reason for this is due to one of the fundamental requirements of password
hashing algorithms: computing many outputs should be _slow_.

As in the previous example, suppose the attacker has access to the entire
password database, with usernames and SHA256 hashes of passwords.

The attacker can take a list of [common passwords][leaked-pws] and simply test
every single value against the database. Looking at [some commodity hardware][mining-hw],
we see that (at the time of writing), $2,400 USD can get you a machine which computes
14,000,000,000,000 hashes per _second_.

To put that in perspective, that can compute _every_ 7 character password made up of `a-zA-Z0-9` in [less than once second](https://www.wolframalpha.com/input/?i=(26%2B26%2B10)%5E7%2F14000000000000).

Thus we have the great dichotomy of password hashing:

**Computing one password hash should be fast, computing many should be slow**

## Password hashing algorithms
To be resistant to a brute-force attack, password hashing algorithms are
intentionally made to be slow. As a simple example of this, we have
[PBKDF2](https://en.wikipedia.org/wiki/PBKDF2), which is effectively "take a
cryptographic hash function, and repeat it N times".

Password hashing algorithms allow you to choose parameters to slow down the
hash function. For interactive logins (think: website login), choosing
parameters such that login takes half a second is reasonable.

If it takes half a second to compute a single password hash, then guessing a
7 character password as before would take [over 55 thousand years](https://www.wolframalpha.com/input/?i=(26%2B26%2B10)%5E7%2F2+seconds).

However, in practice attackers will be using the list of [common passwords][leaked-pws]
we mentioned before. Even checking the top 10,000 most passwords will only take
about an hour and a half.

Are these password doomed to be recovered that easily?

## Salting password hashes
Before, we saw that many password could be recovered in just an hour and a half.
It was implicitly assumed that for any given password, the value stored in the
database would be the same for any user. Suppose Alice and Charlie happen to share
the same common password:

| id | username | password    | creation-date | ... |
|----|----------|-------------|---------------|-----|
| 1  | alice    | cXmBfX44... | 2017-07-14    | ... |
| 2  | bob      | BlEi9jKX... | 2017-07-10    | ... |
| 3  | charlie  | cXmBfX44... | 2017-07-01    | ... |

Therefore, we typically add what is called a "salt" as an input to a password
hash. This is a per-user unique value. So we get `hash = f(password, salt)`.

Since the salt is unique for each user, any brute force attack would need to
be mounted on a _per-user_ basis. This is a huge improvement when the attacker
is simply interested in recovering as many passwords as possible, but is not
necessarily interested in a specific user.

## Memory hard password hashes
In recent times, such as in the [password hashing competition][phc],
memory hard password hashing has been emphasised as an important part of the
design criteria.

The main concept here is that it can be significantly cheaper to perform
computation on custom hardware (e.g. ASICs), than on a general purpose CPU.

Before, we discussed the requirement that it should be fast to compute a single
output, but slow to compute many. In order to make this as balanced as possible,
we need to ensure that an adversary computing many hashes on custom hardware should
not have an advantage over the innocent party using general-purpose hardware.

As a potential solution to this, memory-hard hashing functions have been
proposed. Reading and writing to memory is an operation which is approximately
equally expensive on custom hardware, and the cost to produce ASICs capable of
handling more memory is significantly higher. Therefore, the advantage of these
custom solutions is reduced.

## Summary
Password hashing is essential to protect passwords from being leaked after a
data breach. However, it is far from straightforward given the many
considerations in play, such as: salting, security-parameters choices and
memory-hardness.

Hence, we created upash to help accommodate the needs of the majority of
use cases, providing an easy-to-use API which removes the necessity for the
technical knowledge to choose appropriate algorithms and parameters.

## Credits
This content has been adapted from [libpasta documentation][libpasta].

[owf]: https://en.wikipedia.org/wiki/One-way_function
[leaked-pws]: https://wiki.skullsecurity.org/Passwords
[mining-hw]: https://en.bitcoin.it/wiki/Mining_hardware_comparison
[phc]: https://password-hashing.net/
[pythia]: https://www.usenix.org/system/files/conference/usenixsecurity15/sec15-paper-everspaugh.pdf
[libpasta]: https://github.com/libpasta/libpasta-hugo
