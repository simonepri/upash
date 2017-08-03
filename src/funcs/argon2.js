'use strict';

const argon2 = require('argon2');

const _ = require('lodash');

/**
 * Default configurations used to generate a new hash.
 * @type {Object}
 */
const defaultConfigs = {
  // The type option is flexible and accepts
  // 0, 1 or 2 for Argon2d, Argon2i andArgon2id respectively.
  type: 0,

  // You can also modify time, memory and parallelism constraints passing the
  // object as the third parameter, with keys timeCost, memoryCost and
  // parallelism, respectively defaulted to 3, 12 (meaning 2^12 KB) and 1 (threads)
  timeCost: 3,
  memoryCost: 12,
  parallelism: 1,

  // The length of the generated hash default 32
  hashLength: 32
};

/**
 * Generates an unique hash.
 * @param  {string} password The password to hash.
 * @param  {object} configs  Configurations related to the hashing function.
 * @param  {generateCallback} callback Called after the hash has been generated.
 */
 /**
  * @callback generateCallback
  * @param  {object} err  Possible error thrown.
  * @param  {string} hash Generated hash string.
  */
function hashFunc(password, configs, callback) {
  const cfgs = _.extend(defaultConfigs, configs);

  cfgs.raw = false;

  argon2.hash(password, cfgs)
    .then(hash => callback(null, hash))
    .catch(callback);
}

/**
 * Determines whether or not the user's input matches the stored password.
 * @param  {object} hash Previously hashed password.
 * @param  {password} password User's password input.
 * @param  {hashCallback} callback Called after the hash has been computed.
 */
 /**
  * @callback hashCallback
  * @param  {object} err Possible error thrown.
  * @param  {string} match True if the hash computed for the input matches.
  */
function verifyFunc(hash, password, callback) {
  argon2.verify(hash, password)
    .then(match => callback(null, match))
    .catch(callback);
}

module.exports = {
  hash: hashFunc,
  verify: verifyFunc
};
