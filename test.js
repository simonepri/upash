import test from 'ava';
import pify from 'pify';

import m from './src';

test.serial('should verify a correct password with pbkdf2', async t => {
  const hash = await pify(m.hash)('hello world');
  t.true(typeof hash === 'string');
  t.true(await pify(m.verify)(hash, 'hello world'));
});

test.serial('should not verify a wrong password with pbkdf2', async t => {
  const hash = await pify(m.hash)('Hello world');
  t.true(typeof hash === 'string');
  t.false(await pify(m.verify)(hash, 'hello world'));
});

test.serial('should verify a correct password with bcrypt', async t => {
  const hash = await pify(m.hash)('hello world', {func: 'bcrypt'});
  t.true(typeof hash === 'string');
  t.true(await pify(m.verify)(hash, 'hello world'));
});

test.serial('should not verify a wrong password with bcrypt', async t => {
  const hash = await pify(m.hash)('Hello world', {func: 'bcrypt'});
  t.true(typeof hash === 'string');
  t.false(await pify(m.verify)(hash, 'hello world'));
});

test.serial('should verify a correct password with scrypt', async t => {
  const hash = await pify(m.hash)('hello world', {func: 'scrypt'});
  t.true(typeof hash === 'string');
  t.true(await pify(m.verify)(hash, 'hello world'));
});

test.serial('should not verify a wrong password with scrypt', async t => {
  const hash = await pify(m.hash)('Hello world', {func: 'scrypt'});
  t.true(typeof hash === 'string');
  t.false(await pify(m.verify)(hash, 'hello world'));
});

test.serial('should verify a correct password with argon2', async t => {
  const hash = await pify(m.hash)('hello world', {func: 'argon2'});
  t.true(typeof hash === 'string');
  t.true(await pify(m.verify)(hash, 'hello world'));
});

test.serial('should not verify a wrong password with argon2', async t => {
  const hash = await pify(m.hash)('Hello world', {func: 'argon2'});
  t.true(typeof hash === 'string');
  t.false(await pify(m.verify)(hash, 'hello world'));
});

test.serial('the time of processing with round 2 is less than round 10 with bcrypt', async t => {
  const mill1 = Date.now();
  await pify(m.hash)('Hello world', {func: 'bcrypt', rounds: 2});
  const mill2 = Date.now();
  await pify(m.hash)('Hello world', {func: 'bcrypt', rounds: 10});
  const mill3 = Date.now();
  t.true(mill2 - mill1 < mill3 - mill2);
});

test.serial('the time of processing with maxtime 0.15 is less than maxtime 0.20 with scrypt', async t => {
  const mill1 = Date.now();
  await pify(m.hash)('Hello world', {func: 'scrypt', maxtime: 0.15});
  const mill2 = Date.now();
  await pify(m.hash)('Hello world', {func: 'scrypt', maxtime: 0.20});
  const mill3 = Date.now();
  t.true(mill2 - mill1 < mill3 - mill2);
});

test.serial('the time of processing with timeCost 3 is less than timeCost 5 with argon2', async t => {
  const mill1 = Date.now();
  await pify(m.hash)('Hello world', {func: 'argon2', timeCost: 3});
  const mill2 = Date.now();
  await pify(m.hash)('Hello world', {func: 'argon2', timeCost: 5});
  const mill3 = Date.now();
  t.true(mill2 - mill1 < mill3 - mill2);
});
