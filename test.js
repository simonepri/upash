import test from 'ava';

import m from '.';

const ponyHash = {
  hash: password => {
    return new Promise((resolve, reject) => {
      if (password === 'pony') {
        reject(new Error('Cannot hash pony passwords'));
        return;
      }
      resolve(password);
    });
  },
  verify: (hash, password) => {
    return new Promise((resolve, reject) => {
      if (password === 'pony') {
        reject(new Error('Cannot verify pony passwords'));
        return;
      }
      resolve(hash === password);
    });
  },
  name: 'pony'
};

m.install(ponyHash);

test('should verify a correct password', async t => {
  const hash = await m.hash('hello world', {func: 'pony'});
  t.true(typeof hash === 'string');
  t.true(await m.verify(hash, 'hello world'));
});

test('should not verify a wrong password', async t => {
  const hash = await m.hash('Hello world', {func: 'pony'});
  t.true(typeof hash === 'string');
  t.false(await m.verify(hash, 'hello world'));
});

test('should throw an error hasing a pony password', async t => {
  const err = await t.throws(m.hash('pony', {func: 'pony'}));
  t.is(err.message, 'Cannot hash pony passwords');
});

test('should throw an error verifying a pony password', async t => {
  const hash = await m.hash('hello world', {func: 'pony'});
  const err = await t.throws(m.verify(hash, 'pony'));
  t.is(err.message, 'Cannot verify pony passwords');
});

test('should throw an error tring to hash an empty string', async t => {
  const err = await t.throws(m.hash('', {func: 'pony'}));
  t.is(err.message, 'Password must be a non-empty string.');
});

test('should throw an error tring to verify an empty string', async t => {
  const hash = await m.hash('hello world', {func: 'pony'});
  const err = await t.throws(m.verify(hash, ''));
  t.is(err.message, 'Input password must be a non-empty string.');
});

test('should throw an error tring to verify with and invalid hash', async t => {
  let err = await t.throws(m.verify('invalid hash', 'hello world'));
  t.is(err.message, 'Couldn\'t parse the provided hash.');
  err = await t.throws(m.verify('{}', 'hello world'));
  t.is(err.message, 'The provided hash is invalid.');
});

test('should throw an error tring to hash with an hash function not installed', async t => {
  const err = await t.throws(m.hash('strong password', {func: 'unicorn'}));
  t.is(err.message, 'unicorn hash function not installed.');
});

test('should throw an error tring to verify with an hash function not installed', async t => {
  const hash = JSON.stringify({hash: 'strong password', func: 'unicorn'});
  const err = await t.throws(m.verify(hash, 'strong password'));
  t.is(err.message, 'unicorn hash function not installed.');
});

test('should throw an error tring to hash without passing an hash function to use', async t => {
  const err = await t.throws(m.hash('strong password', {}));
  t.is(err.message, 'You must provide an hash function to use.');
});

test('should return the list of hash functions installed', t => {
  const list = m.list();
  t.is(list.length, 1);
  t.is(list[0], 'pony');
});
