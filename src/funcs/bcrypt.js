const bcrypt = require('bcrypt');

const _ = require('lodash');

/**
 * Default configurations used to generate a new hash.
 * @type {Object}
 */
const defaultConfigs = {
  // The cost of processing the data.
  // See here https://www.npmjs.com/package/bcrypt#a-note-on-rounds
  rounds: 10
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

  bcrypt.genSalt(cfgs.rounds)
    .then(salt => {
      bcrypt.hash(password, salt)
        .then(hash => callback(null, hash))
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
  bcrypt.compare(password, hash)
    .then(match => callback(null, match))
    .catch(callback);
}

module.exports = {
  hash: hashFunc,
  verify: verifyFunc
};
