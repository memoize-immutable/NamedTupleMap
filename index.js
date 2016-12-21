function NamedTupleMap( opts ) {
  if ( opts && 'limit' in opts ) {
    this._limit = opts.limit;
  }
  this.clear();
}

NamedTupleMap.prototype = {
  toString: function() {
    return '[object NamedTupleMap]';
  },
  _hash: function( tuple ) {
    // Speed up hash generation for the folowing pattern:
    // if ( !cache.has(t) ) { cache.set( t, slowFn(t) ); }
    if ( tuple === this._lastTuple ) {
      return this._lastHash;
    }

    const names = Object.keys(tuple);
    const l = names.length;
    const hash = [];

    for ( let i = 0; i < l; i++ ) {
      const name = names[i];
      const arg = tuple[name];
      const argType = typeof arg;

      // if the argument is not a primitive, get a unique (memoized?) id for it
      // (typeof null is "object", but should be considered a primitive)
      if ( arg !== null && ( argType === 'object' || argType === 'function' ) ) {
        if ( this._idMap.has( arg ) ) {
          hash.push( this._idMap.get(arg) );
        } else {
          const id = '#' + this._id++;
          this._idMap.set( arg, id );
          hash.push( id );
        }

      // otherwise, add the argument and its type to the hash
      } else {
        hash.push( argType === 'string' ? '"' + arg + '"' : '' + arg );
      }
    }

    hash.push('{"' + names.join('","') + '"}');

    this._lastTuple = tuple;
    // concatenate serialized arguments using a complex separator
    // (to avoid key collisions)
    this._lastHash = hash.join('/<[MI_SEP]>/');

    return this._lastHash;
  },

  has: function( tuple ) {
    const hash = this._hash( tuple );
    return this._cache.has( hash );
  },

  set: function( tuple, value ) {
    const hash = this._hash( tuple );

    if ( this._limit !== undefined ) {
      this._cache.delete( hash );
    }

    this._cache.set( hash, value );

    if ( this._limit !== undefined && this._cache.size > this._limit ) {
      this._cache.delete( this._cache.keys().next().value );
    }

    return this;
  },

  get: function( tuple ) {
    const hash = this._hash( tuple );

    if ( this._limit !== undefined && this._cache.has( hash ) ) {
      const value = this._cache.get( hash );
      this._cache.delete( hash );
      this._cache.set( hash, value );
      return value;
    }

    return this._cache.get( hash );
  },

  clear: function() {
    this._cache = new Map();
    this._idMap = new WeakMap();
    this._id = 0;
    delete this._lastTuple;
    delete this._lastHash;
  },
};

export default NamedTupleMap;
