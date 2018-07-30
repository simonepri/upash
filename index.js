'use strict';

const funcs = {};
const queue = [];

/**
 * Installs a compatible password hashing function.
 * @public
 * @param {string} name The name of the password hashing function.
 * @param {Object} algorithm The password hashing function object.
 * @param {Function} algorithm.hash A function that takes a password and returns
 * a cryptographically secure password hash string.
 * @param {Function} algorithm.verify A function that takes a secure password
 * hash string and a password and returns whether or not the password is valid
 * for the given hash string.
 * @param {Function} algorithm.identifiers A function that returns the list of
 * identifiers that this password hashing algorithm is able to generate / verify.
 */
function install(name, algorithm) {
  if (typeof name !== 'string' || name === '') {
    throw new TypeError('The algorithm name must be an non-empty string.');
  }
  if (
    typeof algorithm !== 'object' ||
    algorithm === null ||
    Array.isArray(algorithm)
  ) {
    throw new TypeError('The algorithm object must be an object.');
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

  if (typeof algorithm.identifiers !== 'function') {
    throw new TypeError(
      'The identifiers property of the algorithm object should be a function.'
    );
  }

  if (funcs[name] !== undefined) {
    throw new TypeError(`The ${name} algorithm is already installed.`);
  }

  const idfs = algorithm.identifiers();
  for (const an of queue) {
    if (funcs[an].identifiers().some(idf => idfs.indexOf(idf) !== -1)) {
      throw new Error(
        'The identifiers property of the algorithm object clashes with the ones of another algorithm.'
      );
    }
  }

  funcs[name] = Object.assign({}, algorithm);
  Object.freeze(funcs[name]);
  queue.push(name);
}

/**
 * Uninstalls a password hashing function previously installed.
 * @public
 * @param {string} name The name of the algorithm to uninstall or 'last' to
 * uninstall the last one installed.
 */
function uninstall(name) {
  if (typeof name !== 'string' || name === '') {
    throw new TypeError('The algorithm name must be an non-empty string.');
  }

  const hashFunc = funcs[name];

  if (!hashFunc) {
    throw new TypeError(`The ${name} algorithm is not installed`);
  }

  delete funcs[name];
  queue.splice(queue.indexOf(name), 1);
}

/**
 * Gets the list of the installed password hashing functions.
 * @public
 * @return {string[]} The array of the available password hashing
 * functions.
 */
function list() {
  return queue.slice(0);
}

/**
 * Selects manually which password hashing function to use.
 * You can call hash and verify on the object returned.
 * @public
 * @param {string|undefined} name The name of the algorithm to use.
 * @return {Object} The password hashing function object.
 */
function use(name) {
  if (name === undefined) {
    if (queue.length === 0) {
      throw new Error('No algorithm installed.');
    }
    name = queue[queue.length - 1];
  } else if (typeof name !== 'string' || name === '') {
    throw new TypeError('The algorithm name must be an non-empty string.');
  }

  const hashFunc = funcs[name];

  if (!hashFunc) {
    throw new TypeError(`The ${name} algorithm is not installed`);
  }

  return hashFunc;
}

/**
 * Returns the name of the algorithm that has generated the hash string.
 * @public
 * @param {string} hashstr Secure hash string generated from this package.
 * @return {string|null} The name of password hashing algorithm.
 */
function which(hashstr) {
  if (typeof hashstr !== 'string' || hashstr === '') {
    throw new TypeError('The hashstr param must be an non-empty string.');
  }
  const fields = hashstr.split('$');

  if (fields.length < 3 || fields[0] !== '') {
    throw new TypeError(
      'The hashstr param provided is not in a supported format.'
    );
  }
  const idf = fields[1];

  if (queue.length === 0) {
    throw new Error('No algorithm installed.');
  }

  for (const name of queue) {
    if (funcs[name].identifiers().indexOf(idf) === -1) continue;
    return name;
  }
  return null;
}

/**
 * Determines whether or not the hash provided matches the hash generated for
 * the given password choosing the right algorithm based on the identifier
 * contained in the hash.
 * @public
 * @param {string} hashstr Secure hash string generated from this package.
 * @param {string} password User's password input.
 * @returns {Promise.<boolean>} A boolean that is true if the hash computed
 * for the password matches.
 */
function verify(hashstr, password) {
  const name = which(hashstr);

  if (name === null) {
    throw new TypeError('No compatible algorithm installed.');
  }

  return use(name).verify(hashstr, password);
}

/**
 * Computes the hash string of the given password using the 'last' algorithm
 * installed.
 * @public
 * @param {string} password The password to hash.
 * @param {Object} [options] Optional configurations related to the hashing
 * function. See the algorithm specific documentation for the options supported.
 * @returns {Promise.<string>} The generated secure hash string.
 */
function hash(password, options) {
  return use().hash(password, options);
}

module.exports = Object.freeze({
  install,
  uninstall,
  list,
  use,
  which,

  verify,
  hash
});
