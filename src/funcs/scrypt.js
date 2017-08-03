'use strict';

const scrypt = require('scrypt');
const Buffer = require('safe-buffer').Buffer;

const _ = require('lodash');

/**
 * Default configurations used to generate a new hash.
 * @type {Object}
 */
const defaultConfigs = {
  // The maximum amount of time in seconds scrypt will spend when computing the
  // derived key.
  maxtime: 0.15,
  // The maximum number of bytes of RAM used when computing the derived
  // encryption key. If not present, will default to 0.
  maxmem: 0,
  // A double value between 0.0 and 1.0, representing the fraction (normalized
  // percentage value) of the available RAM used when computing the derived key.
  // If not present, will default to 0.5.
  maxmemfrac: 0.5
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

  scrypt.params(cfgs.maxtime, cfgs.maxmem, cfgs.maxmemfrac)
    .then(params => {
      scrypt.kdf(password, params)
        .then(hash => callback(null, hash.toString('base64')))
        .catch(callback);
    })
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
  scrypt.verifyKdf(Buffer.from(hash, 'base64'), Buffer.from(password))
    .then(match => callback(null, match))
    .catch(callback);
}

module.exports = {
  hash: hashFunc,
  verify: verifyFunc
};
