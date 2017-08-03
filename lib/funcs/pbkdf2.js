const crypto = require('crypto');

const _ = require('lodash');

/**
 * Default configurations used to generate a new hash.
 * @type {Object}
 */
const defaultConfigs = {
  // Minimum number of iterations recommended to ensure data safety,
  // this value changes every year as technology improves.
  iterations: 10000,

  // According to the PBKDF2 standard, the minimum recommended size for the salt
  // is 64 bits
  keylen: 128,

  // SHA-1 is sufficient however, using SHA-256 or SHA-512 has the benefit of
  // significantly increasing the memory requirements, which increases the cost
  // for an attacker wishing to attack use hardware-based password crackers
  // based on GPUs or ASICs.
  digest: 'sha512'
};

/**
 * Generates a cryptographically secure random string for use as a password salt
 * using Node's built-in crypto.randomBytes().
 *
 * @param  {number} length The length of the salt to be generated.
 * @param  {function} callback Called after the salt has been generated.
 */
function createSalt(length, callback) {
  crypto.randomBytes(length, (err, buff) => {
    if (err) {
      return callback(err);
    }
    callback(null, buff.toString('base64'));
  });
}

/**
 * Generates an unique hash and the data needed to verify it.
 * @param  {string} password The password to hash.
 * @param  {object} configs  Configurations related to the hashing function.
 * @param  {generateCallback} callback Called after the hash has been generated.
 */
 /**
  * @callback generateCallback
  * @param  {object} err  Possible error thrown.
  * @param  {string} hash Generated hash string
  * @param  {object} data Object that olds parameters passed to the
  *   hash funciton needed for the verification process.
  */
function newHash(password, configs, callback) {
  const cfgs = _.extend(defaultConfigs, configs);

  createSalt(cfgs.keylen, (err, salt) => {
    if (err) {
      callback(err);
      return;
    }
    const data = {
      salt,
      iterations: cfgs.iterations,
      keylen: cfgs.keylen,
      digest: cfgs.digest
    };
    toHash(password, data, (err, hash) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, hash, data);
    });
  });
}

/**
 * Hash a password using the data provided.
 * @param  {password} password The password to hash.
 * @param  {object} data Data object generated from this package.
 * @param  {hashCallback} callback Called after the hash has been computed.
 */
 /**
  * @callback hashCallback
  * @param  {object} err Possible error thrown.
  * @param  {string} hash Computed hash string.
  */
function toHash(password, data, callback) {
  crypto.pbkdf2(password, data.salt, data.iterations, data.keylen, data.digest, (err, hash) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, hash.toString('base64'));
  });
}

module.exports = {
  hash: toHash,
  generate: newHash
};
