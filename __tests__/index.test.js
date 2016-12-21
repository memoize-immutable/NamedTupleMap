import NamedTupleMap from '../index';

describe('NamedTupleMap', () => {
  let cache;
  const obj = {'Carole Granade-Segers': 'Human unicorn'};
  const arr = ['Carole', 'Granade', 'Segers', 'we', 'love', 'you'];
  const fun = function() { return 'president forever'; };
  const res = ['♥'];

  beforeEach(() => {
    cache = new NamedTupleMap();
  });

  describe('#_hash', () => {
    it('should create a hash for any number of args of any type', () => {
      const tuple = {
        mars: obj,
        venus: arr,
        earth: '123',
        mercure: 123,
        jupiter: false
      };
      const expectedHash = [
        '#0','#1','"123"','123','false',
        '{"mars","venus","earth","mercure","jupiter"}'
      ].join('/<[MI_SEP]>/');

      expect(cache._hash( tuple )).toEqual( expectedHash );
      expect(cache._lastTuple).toBe( tuple );
      expect(cache._lastHash).toEqual( expectedHash );
      // repeat that test to get 100% code coverage
      expect(cache._hash( tuple )).toEqual( expectedHash );
    });
  });

  describe('new NamedTupleMap({ limit: 3 })', () => {
    it('should limit the size of the cache and keep Last Result Used', () => {
      cache = new NamedTupleMap({ limit: 3 });

      cache.set({ mars: obj}, 0);
      cache.set({ mars: arr}, 1);
      cache.set({ mars: fun}, 2);

      expect(cache.has({ mars: obj})).toEqual(true);
      expect(cache.has({ mars: arr})).toEqual(true);
      expect(cache.has({ mars: fun})).toEqual(true);

      // refresh the very first key of the map, to make sure it's not evicted
      cache.get({mars: obj});
      cache.set({mars: 'str'}, 3);

      expect(cache._cache.size).toEqual(3);

      expect(cache.has({mars: arr})).toEqual(false);
      expect(cache.has({mars: fun})).toEqual(true);
      expect(cache.has({mars: obj})).toEqual(true);
      expect(cache.has({mars: 'str'})).toEqual(true);
    });
  });

  describe('#set, #has and then #get', () => {
    it('should work with `(key1:{})`', () => {
      cache.set([obj], res);

      expect(cache.has([obj])).toEqual(true);
      expect(cache.has([arr])).toEqual(false);
      expect(cache.get([obj])).toBe(res);
      expect(cache.get([fun])).toEqual(undefined);
    });

    it('should work with (key1:{}, key2:"str")', () => {
      cache.set({mars:obj, venus:'str'}, res);

      expect(cache.has({mars:obj, venus:'str'})).toEqual(true);
      expect(cache.get({mars:obj, venus:'str'})).toBe(res);
    });

    it('should work with (key1:{}, key2:"str", key3:arr)', () => {
      cache.set({mars:obj, venus:'str', earth:arr}, res);

      expect(cache.has({mars:obj, venus:'str', earth:arr})).toEqual(true);
      expect(cache.get({mars:obj, venus:'str', earth:arr})).toBe(res);

      cache.set({mars:obj, venus:'str', earth:arr}, fun);

      expect(cache.has({mars:obj, venus:'str', earth:arr})).toEqual(true);
      expect(cache.get({mars:obj, venus:'str', earth:arr})).toBe(fun);
    });
  });

  describe('.toString', () => {
    it('should return a special identifier', () => {
      expect(cache.toString()).toEqual('[object NamedTupleMap]');
    });
  });
});
