'use strict';
var Promise = require('bluebird');
var _ = require('lodash');
var jts = require('../jsontableschema');

module.exports = function(config) {
  return new Model(config);
};

/**
 * @param config
 * @constructor
 */
function Model(config, descriptor) {
  var self = this;

  if (!config.tableName) {
    throw new Error('Table name is required');
  }

  this.tableName = config.tableName;
  this.resource = config.resource;
  this.config = config;
  this.data = null;

  if (_.isPlainObject(config.instanceMethods)) {
    _.forOwn(config.instanceMethods, function(value, key) {
      self[key] = value.bind(self);
    });
  }

  if (!descriptor) {
    return new Promise(function(resolve, reject) {
      (new jts.Schema(config.descriptor)).then(function(descriptor) {
        self.descriptor = descriptor;
        resolve(self);
      }, function(error) {
        reject(error);
      });
    });
  } else {
    this.descriptor = descriptor;
  }
}

Model.prototype = {
  setData: function(row) {
    this.data = row;
  },

  mapped: function() {
    return _map(this, this.data);
  },

  clone: function() {
    return new Model(this.config, this.descriptor);
  }
};

/**
 * Return object with map of values to headers of the row of values
 * @param instance
 * @param row
 * @returns {Object}
 */
function _map(instance, row) {
  var result = {};

  if (!row) {
    return result;
  }

  _.forEach(instance.descriptor.headers(), function(header, index) {
    result[header] = row[index];
  });

  return result;
}
