/*
 * Author: Maverick Chan
 * License: MIT License
 */

(function() {
/*
 * Module's settings and public API.
 */
var storage = {
  storageType: 'localStorage',
  async: true,
};
storage.works = storageSupported(storage.storageType);
var storageTypes = {
  'localStorage': localStorage,
  'sessionStorage': sessionStorage
};
var defaultStorage = storageTypes[storage.storageType];
var setItem = defaultStorage.setItem.bind(defaultStorage);
var getItem = defaultStorage.getItem.bind(defaultStorage);
var removeItem = defaultStorage.removeItem.bind(defaultStorage);
var clearStorage = defaultStorage.clear.bind(defaultStorage);

/*
 * Check browser support for storage
 *
 * @param {String} storageType
 * @return {Boolean} support for storage
 * @api private
 */
function storageSupported(storageType) {
  try {
    return storageType in window && window[storageType] !== null;
  } catch(e) {
    return false;
  }
}

/*
 * Runs function asynchronously.
 * 
 * Usage:
 * > async(localStorage.setItem)
       .run('hello', 'world', function() {})
 * > var result = async(localStorage.getItem)
 *     .run('hello', function(value){console.log(result)});
 *
 * @param {Function} synchronous function
 * @return {Object} asyncFunc
 * @api private
 */
function async(func) {
  var NOTSTARTED = 0, PENDING = 1, SUCCESS = 2, FAIL = -1;
  var asyncFunc = {};
  asyncFunc.status = NOTSTARTED;
  asyncFunc.run = function doAsyncFunc() {
    var args = Array.prototype.slice.call(arguments);
    var callback = args.pop();
    asyncFunc.status = PENDING;
    // Pushes it to background with 0ms delay
    setTimeout(function() {
      try {
        var result = func.apply(this, args);
        callback(result);
        asyncFunc.status = SUCCESS;
        asyncFunc.result = result;
      } catch(e) {
        asyncFunc.status = FAIL;
        callback(e);
      }
    }, 0);
  };
  return asyncFunc;
}

/*
 * Goes through settings and make changes to module.
 *
 * @api private
 */
(function parseSettings() {
  // Bail if it doesn't work, no fallback
  if (!storage.works) storage = undefined;
})();

/*
 * Attempt to parse string for JSON.
 *
 * @return {String} if not JSON
 * @return {Object} if able to JSON.parse
 * @api private
 */
function parseIfPossible(obj) {
  try {
    /*
    // 'string' will become "'string'"
    obj = typeof obj === 'string'
      ? obj
      : JSON.parse(obj);*/
    return JSON.parse(obj);
  } catch(e) {
    return obj;
  }
}

/*
 * Attempt to stringify JSON.
 *
 * @return {String} if serializable
 * @return {Object} if JSON.stringify fails
 * @api private
 */
function stringifyIfPossible(obj) {
  try {
    obj = typeof obj === 'string'
      ? obj
      : JSON.stringify(obj);
    return obj;
  } catch(e) {
    return obj;
  }
}

/*
 * Functions for accessing storage:
 * get, getSync, getMulti
 * set, setSync, setMulti
 * remove, removeSync, removeMulti 
 */

/*
 * Wrapper function for localStorage.setItem
 * which is asynchronous and deserializes to string.
 * Callback accepts no parameters.
 *
 * @param {String} key
 * @param {Object} value
 * @param {Function} callback
 * @api public
 */
// FIXME
// Apparently this runs really slow, at 88ms
// NOW at 120ms....
storage.set = function setStorage(key, value, callback) {
  value = stringifyIfPossible(value);
  async(setItem).run(key, value, function(){
    if (typeof callback === 'function') callback();
  });
};

/*
 * Wrapper function for localStorage.setItem
 * which just deserializes to string.
 *
 * @param {String} key
 * @param {Object} value
 * @api public
 */
storage.setSync = function(key, value) {
  defaultStorage.setItem(key, stringifyIfPossible(value));
};

/*
 * Iterates through keyValue Object and does storage.set.
 * Callback accepts no parameters.
 *
 * @param {Object} keyValue
 * @param {Function} callback
 * @api public
 */
storage.setMulti = function(keyValue, callback) {
  var keys = Object.keys(keyValue);
  var counter = 0;
  function incrementCounter() {
    counter++;
    if (counter === keys.length &&
      typeof callback === 'function') callback();
  }
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = keyValue[key];
    storage.set(key, value, incrementCounter);
  }
};

/*
 * Wrapper function for localStorage.getItem
 * which is asynchronous and serializes to JSON.
 * Callback accepts value as parameter.
 *
 * @param {String} key
 * @param {Function} callback with value passed
 *   @param {Object} value (null if not present)
 * @api public
 */
storage.get = function getStorage(key, callback) {
  async(getItem).run(key, function(value) {
    // null if not present
    callback(parseIfPossible(value));
  });
};

// For syntactic sugar
storage.has = storage.get;

/*
 * Wrapper function for localStorage.setItem
 * which just deserializes to string.
 *
 * @param {String} key
 * @param {Object} value
 * @api public
 */
storage.getSync = function(key) {
  return parseIfPossible(defaultStorage.getItem(key));
};

/*
 * Iterates through keys and does storage.get.
 * Callback accepts array of values as parameter.
 *
 * @param {Array} keys
 * @param {Function} callback
 *   @param {Array} values
 * @api public
 */
storage.getMulti = function getMultiStorage(keys, callback) {
  var values = [];
  function rememberValue(value) {
    values.push(parseIfPossible(value));
    if (values.length === keys.length) callback(values);
  }
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    storage.get(key, rememberValue);
  }
};

/*
 * Wrapper function for localStorage.removeItem
 * which is asynchronous.
 * Callback takes no parameters.
 *
 * @param {String} key
 * @param {Function} callback
 * @api public
 */
storage.remove = function removeStorage(key, callback) {
  async(removeItem).run(key, function() {
    if (typeof callback === 'function') callback();
  });
};

/*
 * Wrapper function for localStorage.removeItem
 * which is behaves exactly the same.
 *
 * @param {String} key
 * @api public
 */
storage.removeSync = function removeSyncStorage(key) {
  defaultStorage.removeItem(key);
};

/*
 * Iterates through keys and does storage.remove.
 * Callback accepts array of values as parameter.
 *
 * @param {Array} keys
 * @param {Function} callback
 * @api public
 */
storage.removeMulti = function removeMultiStorage(keys, callback) {
  var counter = 0;
  function incrementCounter() {
    counter++;
    if (counter === keys.length &&
      typeof callback === 'function') callback();
  }
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    storage.remove(key, incrementCounter);
  }
};

storage.clear = function asyncClearStorage(callback) {
  async(clearStorage).run(function() {
    if (typeof callback === 'function') callback();
  });
};

/*
 * Runs function on each storage item asynchronously.
 *
 * @param {Array} key
 * @param {Function} callback
 *   @param {Boolean} hasValue
 * @api public
 */
storage.forEach = function forEach(keys, func) {
  var newValues, keyValue;
  storage.getMulti(keys, function(values) {
    newValues = values.forEach(func);
    keyValue = constructKeyValue(keys, newValues);
    storage.setMulti(keyValue); // callback not compulsory here
  });

  // constructKeyValue([1, 2, 3], [2, 3, 4])
  // => {1: 2, 2: 3, 3: 4}
  function constructKeyValue(keys, values) {
    var keyValue = {};
    for (var i = 0; i < keys.length; i++) {
      keyValue[keys[i]] = values[i];
    }
    return keyValue;
  }
};

/*
 * Functions for space management:
 * size, left
 */

var MAX_SIZE = 1024 * 1024 * 5;  // 5 MB is default size of storage

/*
 * Iterates through keys and values, records their lengths.
 * An asynchronous function.
 * 
 * @param {Function} callback
 *   @param {Number} storageSize
 * @api public
 */
storage.size = function getStorageSize(callback) {
  var keys = Object.keys(defaultStorage);
  var keysLength = keys.join('').length;
  var value, values = [];
  for (var i = 0; i < keys.length; i++) {
    // localize 'i' into the function
    (function(i) {
      async(getItem).run(keys[i], function(value) {
        values.push(value);
        if (values.length === keys.length &&
          typeof callback === 'function') {
          var valuesLength = values.join('').length;
          callback(keysLength + valuesLength);
        }
      });
    })(i);
  }
};

/*
 * Performs subtraction between MAX_SIZE and storage.size
 * Callback accepts storage left as param
 *
 * @api public
 */
storage.left = function getStorageLeft(callback) {
  storage.size(function(storageSize) {
    callback(MAX_SIZE - storageSize);
  });
};

window.storey = storage;

})();  // storage.js encapsulation
