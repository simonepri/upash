'use strict';

const funcs = {};

/**
 * Gets the hash and verify methods of the algorithm of your choice.
 * @public
 * @param  {string} name The name of the algorithm to use.
 * @return {Object} An object with hash and verify methods.
 */
function use(name) {
  if (typeof name !== 'string' || name === '') {
    throw new TypeError(
      'The hash function name to use must be an non-empty string.'
    );
  }

  const hashFunc = funcs[name];

  if (!hashFunc) {
    throw new Error(name + ' hash function not installed.');
  }

  return hashFunc;
}

/**
 * Installs an hash function.
 * @public
 * @param {string} name The name of the algorithm to install.
 * @param {Object} algorithm An object with hash and verify methods.
 * @param {Function} algorithm.hash The hash function implementation.
 * @param {Function} algorithm.verify The verify function implementation.
 */
function install(name, algorithm) {
  if (typeof name !== 'string' || name === '') {
    throw new TypeError(
      'The hash function name to use must be an non-empty string.'
    );
  }

  if (typeof algorithm.hash !== 'function') {
    throw new TypeError(
      'The hash property of the algorithm object should be a function.'
    );
  }

  if (typeof algorithm.verify !== 'function') {
    throw new TypeError(
      'The verify property of the algorithm object should be a function.'
    );
  }

  funcs[name] = {
    hash: algorithm.hash,
    verify: algorithm.verify,
  };
}

/**
 * Gets the list of the installed password hashing functions.
 * @public
 * @return {Array.<string>} The array of the available hash functions.
 */
function list() {
  return Object.keys(funcs);
}

module.exports = {
  install,
  list,
  use,
};
