import _ from 'lodash'
import jts from 'jsontableschema'

/**
 * @param config
 * @constructor
 */
class Model {
  constructor(config, descriptor) {
    if (!config.tableName) {
      throw new Error('Table name is required')
    }

    this.tableName = config.tableName
    this.resource = config.resource
    this.config = config
    this.data = null

    const self = this
    if (_.isPlainObject(config.instanceMethods)) {
      _.forOwn(config.instanceMethods, (value, key) => {
        self[key] = value.bind(self)
      })
    }

    if (!descriptor) {
      return new Promise((resolve, reject) => {
        (new jts.Schema(config.descriptor)).then(schema => {
          self.descriptor = schema
          resolve(self)
        }, error => {
          reject(error)
        })
      })
    } else {
      this.descriptor = descriptor
    }
  }

  setData(row) {
    this.data = row
  }

  /**
   * Return object with map of values to headers of the row of values
   * @returns {Object}
   */
  mapped() {
    if (!this.data) {
      return {}
    }
    const result = {}
      , row = this.data

    _.forEach(this.descriptor.headers(), (header, index) => {
      result[header] = row[index]
    })
    return result
  }

  clone() {
    return new Model(this.config, this.descriptor)
  }
}

export default config => new Model(config)
