NamedTupleMap [![npm version](https://badge.fury.io/js/namedtuplemap.svg)](https://badge.fury.io/js/namedtuplemap) [![Build Status](https://travis-ci.org/memoize-immutable/NamedTupleMap.svg?branch=master)](https://travis-ci.org/memoize-immutable/NamedTupleMap) [![Dependency Status](https://david-dm.org/memoize-immutable/NamedTupleMap.svg)](https://david-dm.org/memoize-immutable/NamedTupleMap) [![Coverage Status](https://coveralls.io/repos/github/memoize-immutable/NamedTupleMap/badge.svg?branch=master)](https://coveralls.io/github/memoize-immutable/NamedTupleMap?branch=master)
=============

A Map which accepts a named tuple as a key.
This lib is one of the several possible cache for [memoize-immutable](/louisremi/memoize-immutable),
but it can suit other use-cases as it implements a usual Map API.

## Install

`npm install --save NamedTupleMap`

This lib has no dependency, but requires a native implementation of Map.

## Usage

```js
var NamedTupleMap = require('NamedTupleMap');

// When the `limit` option is set, NamedTupleMap turns into an LRU cache.
// Clearing the map every X seconds can also be an acceptable strategy sometimes.
var cache = new NamedTupleMap({ limit: 10000 });

var keyPart1 = {};
var keyPart2 = 'yolo';
var keyPart3 = [];
var value = {any: 'thing'};

// Note that following named tuples are wrapped in new objects that are !==
// (otherwise a Map would have been enough).
cache.set({
  oh: keyPart1,
  my: keyPart2,
  goodness: keyPart3
}, value);

cache.has({
  oh: keyPart1,
  my: keyPart2,
  goodness: keyPart3
}) === true;
cache.get({
  oh: keyPart1,
  my: keyPart2,
  goodness: keyPart3
}) === value;
```

## Author

[@louis_remi](https://twitter.com/louis_remi)

## License

MPL-2.0
