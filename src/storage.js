'use strict';
var Promise = require('bluebird');
var _ = require('lodash');
var jts = require('jsontableschema');
var collections = {};
var models = {};

module.exports = {
  /**
   * Add to collection. If collection does not exists, creates new.
   * @param tableName
   * @param items
   */
  add: function(tableName, items) {
    if (!collections[tableName]) {
      collections[tableName] = [];
    }
    collections[tableName].push(items);
  },

  /**
   * Get all data from table. Returns model for each row
   * @param tableName
   * @returns Array of models
   */
  all: function(tableName) {
    var result = [];
    var model = models[tableName];

    if (!model) {
      return result;
    }

    _.forEach(collections[model.tableName], function(row) {
      var cloned = model.clone();
      cloned.setData(row);
      result.push(cloned);
    });

    return result;
  },

  /**
   * Load data of model to memory
   *
   * @param model
   * @returns {Promise}
   */
  load: function(model) {
    return new Promise(function(resolve, reject) {

      new jts.Resource(model.descriptor, model.resource).then(
        function(resource) {
          var values = [];
          resource.iter(iterator, true, false).then(function() {
            // Set collection with data. If collection exists, reset it to new
            // data set
            collections[model.tableName] = values;
            // add model to the set of known models by storage
            models[model.tableName] = model;
            resolve();
          }, function(errors) {
            reject(errors);
          });

          function iterator(items) {
            values.push(items);
          }
        }, function(error) {
          reject(error);
        });
    });
  }
};
