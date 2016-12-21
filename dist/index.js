'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function NamedTupleMap(opts) {
  if (opts && 'limit' in opts) {
    this._limit = opts.limit;
  }
  this.clear();
}

NamedTupleMap.prototype = {
  toString: function toString() {
    return '[object NamedTupleMap]';
  },
  _hash: function _hash(tuple) {
    // Speed up hash generation for the folowing pattern:
    // if ( !cache.has(t) ) { cache.set( t, slowFn(t) ); }
    if (tuple === this._lastTuple) {
      return this._lastHash;
    }

    var names = Object.keys(tuple);
    var l = names.length;
    var hash = [];

    for (var i = 0; i < l; i++) {
      var name = names[i];
      var arg = tuple[name];
      var argType = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);

      // if the argument is not a primitive, get a unique (memoized?) id for it
      // (typeof null is "object", but should be considered a primitive)
      if (arg !== null && (argType === 'object' || argType === 'function')) {
        if (this._idMap.has(arg)) {
          hash.push(this._idMap.get(arg));
        } else {
          var id = '#' + this._id++;
          this._idMap.set(arg, id);
          hash.push(id);
        }

        // otherwise, add the argument and its type to the hash
      } else {
        hash.push(argType === 'string' ? '"' + arg + '"' : '' + arg);
      }
    }

    hash.push('{"' + names.join('","') + '"}');

    this._lastTuple = tuple;
    // concatenate serialized arguments using a complex separator
    // (to avoid key collisions)
    this._lastHash = hash.join('/<[MI_SEP]>/');

    return this._lastHash;
  },

  has: function has(tuple) {
    var hash = this._hash(tuple);
    return this._cache.has(hash);
  },

  set: function set(tuple, value) {
    var hash = this._hash(tuple);

    if (this._limit !== undefined) {
      this._cache.delete(hash);
    }

    this._cache.set(hash, value);

    if (this._limit !== undefined && this._cache.size > this._limit) {
      this._cache.delete(this._cache.keys().next().value);
    }

    return this;
  },

  get: function get(tuple) {
    var hash = this._hash(tuple);

    if (this._limit !== undefined && this._cache.has(hash)) {
      var value = this._cache.get(hash);
      this._cache.delete(hash);
      this._cache.set(hash, value);
      return value;
    }

    return this._cache.get(hash);
  },

  clear: function clear() {
    this._cache = new Map();
    this._idMap = new WeakMap();
    this._id = 0;
    delete this._lastTuple;
    delete this._lastHash;
  }
};

exports.default = NamedTupleMap;
module.exports = exports['default'];

//# sourceMappingURL=index.js.map