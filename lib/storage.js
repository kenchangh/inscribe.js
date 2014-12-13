var storage = {};

/**
 * Utility functions
 */
function tryParse(obj) {
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

function tryStringify(obj) {
  try {
    obj = typeof obj === 'string'
      ? obj
      : JSON.stringify(obj);
    return obj;
  } catch(e) {
    return obj;
  }
}

function storageSupported(storageType) {
  try {
    return storageType in window && window[storageType] !== null;
  } catch(e) {
    return false;
  }
}

storage.works = storageSupported('localStorage');
// someone like you, kill everybody, hello world

/**
 * LRU functions
 * - All these functions involve small entries
 *   so it's not asynchronous
 */
// start off with empty array
// this will filled up based on order of entry
localStorage.setItem('entry', '[]');

function isEnoughSpace(byteLength) {
  return byteLength < storage.left();
}

function updateEntry(key) {
  // prevent adding self
  var entryList = tryParse(localStorage.getItem('entry'));
  var keyIndex = entryList.indexOf(key);
  if (key !== 'entry' && keyIndex > -1) {
    entryList.splice(keyIndex, 1);
    entryList.push(key);
    localStorage.setItem('entry', tryStringify(entryList));
  }
  if (key !== 'entry' && keyIndex === -1) {
    entryList.push(key);
    localStorage.setItem('entry', tryStringify(entryList));
  }
  return entryList;
}

function removeEntry(sizeNeeded) {
  // fulfill/overdue sizeNeeded to allocate
  while (sizeNeeded > 0) {
    var entryList = tryParse(localStorage.getItem('entry'));
    var removedKey = entryList.shift();
    localStorage.setItem('entry', tryStringify(entryList));
    var bytesFreed = getByteLength(removedKey);
    sizeNeeded -= bytesFreed;
    delete localStorage[removedKey];
  }
}

/**
 * Space management
 */

// 5 MB is the official maximum size of localStorage
// But it's set at 4.5 MB, just in case
var MAX_SIZE = 1024 * 1024 * 4.5; 

function getByteLength(normal_val) {
  // Force string type
  normal_val = String(normal_val);

  var byteLen = 0;
  for (var i = 0; i < normal_val.length; i++) {
    var c = normal_val.charCodeAt(i);
    byteLen += c < (1 <<  7) ? 1 :
               c < (1 << 11) ? 2 :
               c < (1 << 16) ? 3 :
               c < (1 << 21) ? 4 :
               c < (1 << 26) ? 5 :
               c < (1 << 31) ? 6 : Number.NaN;
  }
  return byteLen;
}

storage.size = function getStorageSize() {
  var keys = Object.keys(localStorage);
  var keysLength = getByteLength(keys.join(''));
  var value, values = [];
  for (var i = 0; i < keys.length; i++) {
    value = localStorage.getItem(keys[i]);
    values.push(value);
  }
  var valuesLength = getByteLength(values.join(''));
  return keysLength + valuesLength;
};

storage.left = function storageLeft() {
  return MAX_SIZE - this.size();
};

/**
 * Read & write functions
 */
storage.set = function setStorage(key, value, callback) {
  setTimeout(function() {
    //if (value === undefined) throw new Error('Value must be given');
    value = tryStringify(value);
    var byteLength = getByteLength(key + value);
    if (!isEnoughSpace(byteLength)) {
      removeEntry(byteLength);
    }
    updateEntry(key);
    localStorage.setItem(key, value);
    if (typeof callback === 'function') callback();
  }, 0);
};

storage.get = function getStorage(key, callback) {
  setTimeout(function() {
    var value = localStorage.getItem(key);
    if (value) {
      updateEntry(key);
      callback(tryParse(value)); // mandate for a callback 
    } else {
      callback(); // return undefined, no need to handle cache miss
    }
  }, 0);
};
