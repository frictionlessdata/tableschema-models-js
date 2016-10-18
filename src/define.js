import _ from 'lodash'
import jts from 'jsontableschema'

/**
 * @param config
 * @constructor
 */
class Model {
  constructor(config, descriptor) {
    if (!config || !config.tableName) {
      throw new Error('Table name is required')
    }

    this.tableName = config.tableName
    this.resource = config.resource
    this.config = config
    this.row = null

    const self = this
      , methods = ['clone', 'keyed']

    if (_.isPlainObject(config.instanceMethods)) {
      _.forOwn(config.instanceMethods, (value, key) => {
        if (methods.indexOf(key) === -1) {
          self[key] = value.bind(self)
        }
      })
    }

    if (!descriptor) {
      return new Promise((resolve, reject) => {
        (new jts.Schema(config.descriptor)).then(schema => {
          self.descriptor = schema
          resolve(self)
        }).catch(error => {
          reject(error)
        })
      })
    }
    self.descriptor = descriptor
    return this
  }

  get data() {
    return this.row
  }

  set data(row) {
    this.row = row
  }

  /**
   * Return object with map of values to headers of the row of values
   * @returns {Object}
   */
  keyed() {
    if (!this.row) {
      return {}
    }
    const result = {}
      , row = this.row

    _.forEach(this.descriptor.headers, (header, index) => {
      result[header] = row[index]
    })
    return result
  }

  clone() {
    return new Model(this.config, this.descriptor)
  }
}

export default config => new Model(config)
