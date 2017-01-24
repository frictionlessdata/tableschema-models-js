import _ from 'lodash'
import jts from 'jsontableschema'

const collections = {}
  , models = {}

export default {
  /**
   * Add to collection. If collection does not exists, creates new.
   * @param tableName
   * @param items
   */
  add: (tableName, items) => {
    if (!collections[tableName]) {
      collections[tableName] = []
    }
    collections[tableName].push(items)
  }

  /**
   * Get all data from table. Returns model for each row
   * @param tableName
   * @returns Array of models
   */
  , all: tableName => {
    const result = []
      , model = models[tableName]

    if (!model) {
      return result
    }

    _.forEach(collections[model.tableName], row => {
      const cloned = model.clone()
      cloned.setData(row)
      result.push(cloned)
    })

    return result
  }

  /**
   * Load data of model into memory
   *
   * @param model
   * @returns {Promise}
   */
  , load: model => new Promise((resolve, reject) => {
    new jts.Resource(model.descriptor, model.resource).then(resource => {
      const values = []
      resource.iter(iterator, true, false).then(() => {
        // Set collection with data. If collection exists, reset it to new
        // data set
        collections[model.tableName] = values
        // add model to the set of known models by storage
        models[model.tableName] = model
        resolve()
      }, errors => {
        reject(errors)
      })

      function iterator(items) {
        values.push(items)
      }
    }, error => {
      reject(error)
    })
  })
}
