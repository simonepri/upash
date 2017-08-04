'use strict';

const funcs = {};

/**
 * Creates a new 'unique' hash from a password.
 * @param  {string} password The password to hash.
 * @param  {object} options Options to configure the hash function.
 * @param  {hashCallback} callback Called after the hash has been computed.
 */
 /**
  * @callback hashCallback
  * @param  {object} err  Possible error thrown.
  * @param  {string} hash Stringified hash object that holds the generated hash
  *   string, the name of the function used and the parameters passed to the
  *   hash funciton needed for the verification process.
  */
function toHash(password, options, callback) {
  if (!options || !options.func) {
    return callback(new Error('You must provide an hash function to use.'));
  }
  const hashFunc = funcs[options.func];

  if (!hashFunc) {
    return callback(new Error(options.func + ' hash function not installed.'));
  } else if (typeof password !== 'string' || password.length === 0) {
    return callback(new Error('Password must be a non-empty string.'));
  }

  hashFunc.hash(password, options, (err, hash) => {
    if (err) {
      return callback(err);
    }

    callback(null, JSON.stringify({
      hash,
      func: options.func
    }));
  });
}

/**
 * Determines whether or not the user's input matches the stored password.
 *
 * @param  {string} hash Stringified hash object generated from this package.
 * @param  {string} input User's password input.
 * @param  {verifyCallback} callback Called after the verification process has
 *   been computed.
 */
 /**
  * @callback verifyCallback
  * @param  {object} err Possible error thrown.
  * @param  {boolean} match True if the hash computed for the input matches.
  */
function verifyHash(hash, input, callback) {
  let hashObj;
  try {
    hashObj = JSON.parse(hash);
  } catch (err) {
    return callback(new Error('Couldn\'t parse the provided hash.'));
  }
  if (typeof hashObj.hash !== 'string' || typeof hashObj.func !== 'string' || hashObj.hash === '' || hashObj.func === '') {
    return callback(new Error('The provided hash is invalid.'));
  }

  const hashFunc = funcs[hashObj.func];

  if (!hashFunc) {
    return callback(new Error(hashObj.func + ' hash function not installed.'));
  } else if (typeof (input) !== 'string' || input.length === 0) {
    return callback(new Error('Input password must be a non-empty string.'));
  }

  hashFunc.verify(hashObj.hash, input, callback);
}

/**
 * Installs an hash function plugin.
 * @param {object} plugin A plugin compatible with this package.
 */
function installPlugin(plugin) {
  funcs[plugin.name] = {
    hash: plugin.hash,
    verify: plugin.verify
  };
}

/**
 * @return {array} The array of the available hash functions.
 */
function listPlugins() {
  return Object.keys(funcs);
}

module.exports = {
  verify: verifyHash,
  hash: toHash,
  install: installPlugin,
  plugins: listPlugins
};
