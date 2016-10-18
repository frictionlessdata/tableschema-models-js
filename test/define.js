/* global describe, beforeEach, it, require */
import { assert } from 'chai'
import define from '../src/define'

describe('Define', () => {
  it('should instantiate model', done => {
    define(
      {
        tableName: 'name'
        , resource: '../data/example1.csv'
        , descriptor: require('../data/schema_example1.json')
      }
    ).then(model => {
      assert.isFunction(model.clone)
      assert.isFunction(model.keyed)
      done()
    }).catch(error => {
      // never should get here
      assert.isNull(error)
      done()
    })
  })

  it('should add methods to a class', done => {
    define(
      {
        tableName: 'name'
        , resource: '../data/example1.csv'
        , descriptor: require('../data/schema_example1.json')
        , instanceMethods: {
        method: () => 'test'
        , method2: function () {
          return this.data
        }
      }
      }
    ).then(model => {
      model.data = 123
      assert.isFunction(model.method)
      assert.isFunction(model.method2)
      assert.equal(model.method(), 'test')
      assert.equal(model.method2(), '123')
      done()
    }).catch(error => {
      // never should get here
      assert.isNull(error)
      done()
    })
  })

  it('should not override standard methods', done => {
    define(
      {
        tableName: 'name'
        , resource: '../data/example1.csv'
        , descriptor: require('../data/schema_example1.json')
        , instanceMethods: {
        clone: () => 'test'
        , keyed: () => 'test'
      }
      }
    ).then(model => {
      assert.isFunction(model.clone)
      assert.notEqual(model.clone(), 'test')
      assert.notEqual(model.keyed(), 'test')
      done()
    }).catch(error => {
      // never should get here
      assert.isNull(error)
      done()
    })
  })

  it('should preserve methods of a class in clone', done => {
    define(
      {
        tableName: 'name'
        , resource: '../data/example1.csv'
        , descriptor: require('../data/schema_example1.json')
        , instanceMethods: {
        method: () => 'test'
        , method2: function () {
          return this.data
        }
      }
      }
    ).then(model => {
      const cloned = model.clone()
      cloned.data = 123
      assert.isFunction(cloned.method)
      assert.isFunction(cloned.method2)
      assert.equal(cloned.method(), 'test')
      assert.equal(cloned.method2(), '123')
      done()
    }).catch(error => {
      // never should get here
      assert.isNull(error)
      done()
    })
  })
})
