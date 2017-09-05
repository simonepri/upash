'use strict';

const funcs = {};

/**
 * Creates a new 'unique' hash from a password.
 * @public
 * @param  {string} password The password to hash.
 * @param  {object} options Options to configure the hash function.
 * @param  {string} options.func The name of the hash function to use.
 * @returns {Promise<string>} A promise that contains a stringified object
 *  that holds the generated hash string, the name of the function used to hash
 *  it.
 */
function toHash(password, options) {
  return new Promise((resolve, reject) => {
    if (!options || !options.func) {
      return reject(new Error('You must provide an hash function to use.'));
    }
    const hashFunc = funcs[options.func];

    if (!hashFunc) {
      return reject(new Error(options.func + ' hash function not installed.'));
    } else if (typeof password !== 'string' || password.length === 0) {
      return reject(new Error('Password must be a non-empty string.'));
    }

    hashFunc.hash(password, options)
      .then(hash => {
        resolve(JSON.stringify({
          hash,
          func: options.func
        }));
      })
      .catch(reject);
  });
}

/**
 * Determines whether or not the user's input matches the stored password.
 * @public
 * @param  {string} hash Stringified hash object generated from this package.
 * @param  {string} input User's password input.
 * @returns {Promise<boolean>} A promise that contains a boolean that is true if
 *   if the hash computed for the input matches.
 */
function verifyHash(hash, input) {
  return new Promise((resolve, reject) => {
    let hashObj;
    try {
      hashObj = JSON.parse(hash);
    } catch (err) {
      return reject(new Error('Couldn\'t parse the provided hash.'));
    }
    if (typeof hashObj.hash !== 'string' || typeof hashObj.func !== 'string' || hashObj.hash === '' || hashObj.func === '') {
      return reject(new Error('The provided hash is invalid.'));
    }

    const hashFunc = funcs[hashObj.func];

    if (!hashFunc) {
      return reject(new Error(hashObj.func + ' hash function not installed.'));
    } else if (typeof (input) !== 'string' || input.length === 0) {
      return reject(new Error('Input password must be a non-empty string.'));
    }

    hashFunc.verify(hashObj.hash, input)
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Installs an hash function hashFunction.
 * @public
 * @param {object} hashFunction An hash function compatible with this package.
 */
function installFunction(hashFunction) {
  funcs[hashFunction.name] = {
    hash: hashFunction.hash,
    verify: hashFunction.verify
  };
}

/**
 * @public
 * @return {array} The array of the available hash functions.
 */
function listFunctions() {
  return Object.keys(funcs);
}

module.exports = {
  verify: verifyHash,
  hash: toHash,
  install: installFunction,
  list: listFunctions
};
