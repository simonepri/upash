import test from 'ava';

import M from '.';

const rot = function(n) {
  const obj = {
    hash: password => {
      const hash = password.replace(/([A-M])|([N-Z])/gi, (m, p1) =>
        String.fromCharCode(m.charCodeAt(0) + (p1 ? n : -n))
      );
      return Promise.resolve(`$rot${n}$${hash}`);
    },
    verify: async (hashstr, password) =>
      Promise.resolve(hashstr === (await obj.hash(password))),
    identifiers: () => [`rot${n}`]
  };
  return obj;
};

test.serial('should install and uninstall a valid algorithm', t => {
  const upash = new M();

  t.deepEqual(upash.list(), []);

  t.notThrows(() => upash.install('rot13', rot(13)));
  t.deepEqual(upash.list(), ['rot13']);

  t.notThrows(() => upash.uninstall('rot13'));
  t.deepEqual(upash.list(), []);
});

test.serial('should install and uninstall multiple algorithms', t => {
  const upash = new M();

  t.deepEqual(upash.list(), []);

  t.notThrows(() => upash.install('rot13', rot(13)));
  t.notThrows(() => upash.install('rot5', rot(5)));
  t.deepEqual(upash.list(), ['rot13', 'rot5']);

  t.notThrows(() => upash.uninstall('rot13'));
  t.deepEqual(upash.list(), ['rot5']);

  t.notThrows(() => upash.uninstall('rot5'));
  t.deepEqual(upash.list(), []);
});

test.serial(
  'should throw an error if while installing multiple algorithms there is a clash with the identifiers',
  t => {
    const upash = new M();

    t.deepEqual(upash.list(), []);

    t.notThrows(() => upash.install('rot13', rot(13)));
    const err = t.throws(() => upash.install('rot5', rot(13)));
    t.is(
      err.message,
      'The identifiers property of the algorithm object clashes with the ones of another algorithm.'
    );

    t.notThrows(() => upash.uninstall('rot13'));
    t.deepEqual(upash.list(), []);
  }
);

test('should trow an error passing an invalid algorithm name to install', t => {
  let err;
  const upash = new M();

  err = t.throws(() => upash.install('', rot(13)));
  t.is(err.message, 'The algorithm name must be an non-empty string.');
  err = t.throws(() => upash.install(undefined, rot(13)));
  t.is(err.message, 'The algorithm name must be an non-empty string.');
  err = t.throws(() => upash.install(null, rot(13)));
  t.is(err.message, 'The algorithm name must be an non-empty string.');
});

test('should throw an error if an invalid algorithm object is given to install', async t => {
  let err;
  const upash = new M();

  err = await t.throws(() => upash.install('a', undefined));
  t.is(err.message, 'The algorithm object must be an object.');
  err = await t.throws(() => upash.install('a', null));
  t.is(err.message, 'The algorithm object must be an object.');
  err = await t.throws(() => upash.install('a', []));
  t.is(err.message, 'The algorithm object must be an object.');

  err = await t.throws(() =>
    upash.install('a', {
      verify: () => false,
      identifiers: () => []
    })
  );
  t.is(
    err.message,
    'The hash property of the algorithm object should be a function.'
  );
  err = await t.throws(() =>
    upash.install('a', {
      hash: () => '',
      identifiers: () => []
    })
  );
  t.is(
    err.message,
    'The verify property of the algorithm object should be a function.'
  );
  err = await t.throws(() =>
    upash.install('a', {
      hash: () => '',
      verify: () => false
    })
  );
  t.is(
    err.message,
    'The identifiers property of the algorithm object should be a function.'
  );
});

test.serial(
  'should thow an error trying to install the same algorithms more than once',
  t => {
    const upash = new M();

    t.deepEqual(upash.list(), []);

    t.notThrows(() => upash.install('rot13', rot(13)));

    const err = t.throws(() => upash.install('rot13', rot(13)));
    t.regex(err.message, /algorithm is already installed/);

    upash.uninstall('rot13');
    t.deepEqual(upash.list(), []);
  }
);

test('should trow an error passing an invalid algorithm name to uninstall', t => {
  let err;
  const upash = new M();

  err = t.throws(() => upash.uninstall(''));
  t.is(err.message, 'The algorithm name must be an non-empty string.');
  err = t.throws(() => upash.uninstall(undefined));
  t.is(err.message, 'The algorithm name must be an non-empty string.');
  err = t.throws(() => upash.uninstall(null));
  t.is(err.message, 'The algorithm name must be an non-empty string.');
});

test.serial(
  'should thow an error trying to uninstall the same algorithms more than once',
  t => {
    const upash = new M();

    t.deepEqual(upash.list(), []);

    t.notThrows(() => upash.install('rot13', rot(13)));
    t.notThrows(() => upash.uninstall('rot13'));
    t.deepEqual(upash.list(), []);

    const err = t.throws(() => upash.uninstall('rot13'));
    t.regex(err.message, /algorithm is not installed/);
  }
);

test('should trow an error passing an invalid algorithm name to use', t => {
  let err;
  const upash = new M();

  err = t.throws(() => upash.use(''));
  t.is(err.message, 'The algorithm name must be an non-empty string.');
  err = t.throws(() => upash.use(null));
  t.is(err.message, 'The algorithm name must be an non-empty string.');
});

test.serial(
  'should thow an error trying to use an algorithms that is not installed',
  t => {
    const upash = new M();
    t.deepEqual(upash.list(), []);

    const err = t.throws(() => upash.use('rot13'));
    t.regex(err.message, /algorithm is not installed/);
  }
);

test.serial(
  'should thow an error trying to verify without an algorithm installed',
  async t => {
    const upash = new M();
    t.deepEqual(upash.list(), []);

    const err = await t.throws(() =>
      upash.verify('$rot13$cnffjbeq', 'password')
    );
    t.is(err.message, 'No algorithm installed.');
  }
);

test.serial(
  'should thow an error trying to hash without an algorithm installed',
  async t => {
    const upash = new M();
    t.deepEqual(upash.list(), []);

    const err = await t.throws(() => upash.hash('password'));
    t.is(err.message, 'No algorithm installed.');
  }
);

test.serial('should verify a correct password', async t => {
  const upash = new M(
    {
      rot13: rot(13)
    },
    {
      default: 'rot13'
    }
  );

  const pass = 'password';

  const hashstr1 = await upash.use('rot13').hash(pass);
  t.true(typeof hashstr1 === 'string');
  t.true(await upash.use('rot13').verify(hashstr1, pass));

  const hashstr2 = await upash.hash(pass);
  t.true(typeof hashstr2 === 'string');
  t.true(await upash.verify(hashstr2, pass));
});

test.serial('should not verify a wrong password', async t => {
  const upash = new M(
    {
      rot13: rot(13)
    },
    {
      default: 'rot13'
    }
  );

  const pass = 'password';
  const wrong = 'Password';

  const hashstr1 = await upash.use('rot13').hash(pass);
  t.true(typeof hashstr1 === 'string');
  t.false(await upash.use('rot13').verify(hashstr1, wrong));

  const hashstr2 = await upash.hash(pass);
  t.true(typeof hashstr2 === 'string');
  t.false(await upash.verify(hashstr2, wrong));

  upash.uninstall('rot13');
  t.deepEqual(upash.list(), []);
});

test.serial(
  'should throw an error verifying a wrong formatted hash',
  async t => {
    const upash = new M(
      {
        rot13: rot(13)
      },
      {
        default: 'rot13'
      }
    );

    let err;
    const pass = 'password';
    const hashstr = 'rot13$cnffjbeq';
    err = await t.throws(() => upash.verify(hashstr, pass));
    t.is(
      err.message,
      'The hashstr param provided is not in a supported format.'
    );

    err = await t.throws(() => upash.verify(undefined, pass));
    t.is(err.message, 'The hashstr param must be an non-empty string.');

    err = await t.throws(() => upash.verify(null, pass));
    t.is(err.message, 'The hashstr param must be an non-empty string.');

    err = await t.throws(() => upash.verify('', pass));
    t.is(err.message, 'The hashstr param must be an non-empty string.');

    upash.uninstall('rot13');
    t.deepEqual(upash.list(), []);
  }
);
