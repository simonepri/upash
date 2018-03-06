import test from 'ava';

import m from '.';

const rot13 = {
  hash: password => {
    const hash = password.replace(/([A-M])|([N-Z])/g, (m, p1) =>
      String.fromCharCode(m.charCodeAt(0) + (p1 ? 13 : -13))
    );
    return Promise.resolve(hash);
  },
  verify: async (hash, password) => {
    return Promise.resolve(hash === (await rot13.hash(password)));
  },
};

m.install('rot13', rot13);

test('should verify a correct password', async t => {
  const pass = 'hello world';
  const hash = await m.use('rot13').hash(pass);

  t.true(typeof hash === 'string');
  t.true(await m.use('rot13').verify(hash, pass));
});

test('should not verify a wrong password', async t => {
  const pass = 'Hello world';
  const wrong = 'hello world';
  const hash = await m.use('rot13').hash(pass);

  t.true(typeof hash === 'string');
  t.false(await m.use('rot13').verify(hash, wrong));
});

test('should throw an error if the hash function name is not installed', async t => {
  const err = await t.throws(() => m.use('custom'));

  t.is(err.message, 'custom hash function not installed.');
});

test('should throw an error if the hash function name is empty', async t => {
  let err = await t.throws(() => m.use(''));

  t.is(
    err.message,
    'The hash function name to use must be an non-empty string.'
  );

  err = await t.throws(() => {
    m.install('', {hash: a => a, verify: (a, b) => a === b});
  });

  t.is(
    err.message,
    'The hash function name to use must be an non-empty string.'
  );
});

test('should throw an error if trying to install without the hash or verify methods', async t => {
  let err = await t.throws(() => {
    m.install('custom', {verify: (a, b) => a === b});
  });

  t.is(
    err.message,
    'The hash property of the algorithm object should be a function.'
  );

  err = await t.throws(() => {
    m.install('custom', {hash: a => a});
  });

  t.is(
    err.message,
    'The verify property of the algorithm object should be a function.'
  );
});

test('should return the list of hash functions installed', t => {
  const list = m.list();
  t.is(list.length, 1);
  t.is(list[0], 'rot13');
});
