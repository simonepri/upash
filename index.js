'use strict';

function Upash(algorithms, options) {
  this.funcs = {};
  this.queue = [];
  this.default = options && (options.default || null);

  const install = (name, algorithm) => {
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

    if (this.funcs[name] !== undefined) {
      throw new TypeError(`The ${name} algorithm is already installed.`);
    }

    const idfs = algorithm.identifiers();
    for (const an of this.queue) {
      if (this.funcs[an].identifiers().some(idf => idfs.indexOf(idf) !== -1)) {
        throw new Error(
          'The identifiers property of the algorithm object clashes with the ones of another algorithm.'
        );
      }
    }

    this.funcs[name] = Object.assign({}, algorithm);
    Object.freeze(this.funcs[name]);
    this.queue.push(name);
  };

  if (algorithms) {
    Object.keys(algorithms).forEach(current => {
      install(current, algorithms[current]);
    });
  }
}

/**
 * Gets the list of the installed password hashing functions.
 * @public
 * @return {string[]} The array of the available password hashing
 * functions.
 */
Upash.prototype.list = function() {
  return this.queue.slice(0);
};

/**
 * Selects manually which password hashing function to use.
 * You can call hash and verify on the object returned.
 * @public
 * @param {string|undefined} name The name of the algorithm to use.
 * @return {Object} The password hashing function object.
 */
Upash.prototype.use = function(name) {
  if (name === undefined) {
    if (this.queue.length === 0 || !this.default) {
      throw new Error('No algorithm installed.');
    }
    name = this.default;
  } else if (typeof name !== 'string' || name === '') {
    throw new TypeError('The algorithm name must be an non-empty string.');
  }

  const hashFunc = this.funcs[name];

  if (!hashFunc) {
    throw new TypeError(`The ${name} algorithm is not installed`);
  }

  this.default = name;
  return hashFunc;
};

/**
 * Returns the name of the algorithm that has generated the hash string.
 * @public
 * @param {string} hashstr Secure hash string generated from this package.
 * @return {string|null} The name of password hashing algorithm.
 */
Upash.prototype.which = function(hashstr) {
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

  if (this.queue.length === 0) {
    throw new Error('No algorithm installed.');
  }

  for (const name of this.queue) {
    if (this.funcs[name].identifiers().indexOf(idf) === -1) continue;
    return name;
  }
  return null;
};

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
Upash.prototype.verify = function(hashstr, password) {
  const name = this.which(hashstr);

  if (name === null) {
    throw new TypeError('No compatible algorithm installed.');
  }

  return this.use(name).verify(hashstr, password);
};

/**
 * Computes the hash string of the given password using the 'last' algorithm
 * installed.
 * @public
 * @param {string} password The password to hash.
 * @param {Object} [options] Optional configurations related to the hashing
 * function. See the algorithm specific documentation for the options supported.
 * @returns {Promise.<string>} The generated secure hash string.
 */
Upash.prototype.hash = function(password, options) {
  return this.use().hash(password, options);
};

module.exports = Upash;
