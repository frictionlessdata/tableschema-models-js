# jsontableschema-orm-js
An (object relational) mapper based on JSON Table Schema descriptors.  
This library created to be used together with the [jsontableschema-js](https://github.com/frictionlessdata/jsontableschema-js) to simplify working with data.

## Installation
`npm install jsontableschema-models`

### Model
Represents the row of the data in the given table. It instantiated via define method, and returns `Promise` and inside resolved Promise model object is available,
but this object should be loaded by the `Storage` (see below) to be able to work with it.

##### Config object:
* `tableName` - name of the collection
* `resource` - URL or path to the resource with data
* `descriptor` - JSON table schema descriptor
* `instanceMethods` - custom methods to work with data will be available on every instance of the model (see example below) 

##### Methods:
There is only 1 method possible to use on model and inside instance methods:
* `keyed` - map of values to headers of the data row

### Storage
Component which take care of loading data of the model into memory and keep it under the collection, which has same name as `model table name`.
Available methods:
* `add(tableName: string, items: any[])` - Add to collection. If collection does not exists, creates new.
* `all(tableName: string)` - Get all data from table. Returns model for each row
* `load(model)` - Load data of model into memory

## Usage
1. First need to create model definition:
```javascript
import jtsModels from 'path/to/lib'

const model = jtsModels.define({
  tableName: 'cases',
  resource: 'http://url/to/csv/file/with/data',
  descriptor: {
              "fields": [
                {
                  "name": "id",
                  "title": "",
                  "description": "",
                  "type": "integer",
                  "format": "default"
                },
                {
                  "name": "name",
                  "title": "",
                  "description": "",
                  "type": "string",
                  "format": "default"
                }
              ]
            },
  instanceMethods: {
    proceed: function() {
      const data = this.keyed()
      let type = 'odd'
      if(data.id % 2 === 0) {
        type = 'even'
      }
      return {
        type: type,
        name: data.name
      }
    }
  }
})
```

2. Load model by the storage:
```javascript
model().then(model => {
  // load data of the model to memory
  jtsModels.Storage.load(model).then(() => {
    // get all data from table. Returns model for each row
    const models = jtm.Storage.all(model.tableName)
    const result = []
    // ... iterate through all the models in collection and do something with data
    models.forEach(model => {
      // call instance method from config of the model
      result.push(model.proceed());
    })
  }, error => {
    // error in case if storage can't load model
  });
}, error => {
  // do something in case error if model definition is broke
});
```
