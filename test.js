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

test.serial('undefined or empty password with scrypt', async t => {
  let err = await t.throws(pify(m.hash)(undefined, {func: 'scrypt'}));
  t.true(err instanceof Error);
  err = await t.throws(pify(m.hash)('', {func: 'scrypt'}));
  t.true(err instanceof Error);
});

test.serial('undefined or empty password with pbkdf2', async t => {
  let err = await t.throws(pify(m.hash)(undefined, {func: 'pbkdf2'}));
  t.true(err instanceof Error);
  err = await t.throws(pify(m.hash)('', {func: 'pbkdf2'}));
  t.true(err instanceof Error);
});

test.serial('undefined or empty password with argon2', async t => {
  let err = await t.throws(pify(m.hash)(undefined, {func: 'argon2'}));
  t.true(err instanceof Error);
  err = await t.throws(pify(m.hash)('', {func: 'argon2'}));
  t.true(err instanceof Error);
});

test.serial('undefined or empty password with bcrypt', async t => {
  let err = await t.throws(pify(m.hash)(undefined, {func: 'bcrypt'}));
  t.true(err instanceof Error);
  err = await t.throws(pify(m.hash)('', {func: 'bcrypt'}));
  t.true(err instanceof Error);
});
