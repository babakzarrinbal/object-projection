# Object-projection

object-projection is a simple validation function to validate objects base on allowed ignore rule

## Installation

```bash
npm install object-projection
```

## Usage

### validation

validating objects

```javaScript
    var {objectProj} = require('object-projection');

    var input ={
        key1: 'string',
        key2: 'any',
        key3:{
            key4:'any',
            "key5.key6":{
                key7:'any'
            }
        }
    }

    var validation = {
        key2:1,
        "key3.key5.key6.key7": true,
        //or
        "key3.key5":{
            "key6.key7":1
        }
    }
    var result = objectProj(input, validation2);
    /**
        result = {
            key2: 'any',
            key3:{
                key5:{
                    key6":{
                        key7:'any'
                    }
                }
            }
        }
     * */

    //or
    var validation2 = {
        key2:0,
        "key3.key5":0
    }

    var result = objectProj(input, validation2);
    /**
        result = {
            key1: 'string',
            key3:{
                key4:'any',
            }
        }
     * */

```

keep in mind that only allowing or only ignoring keys at one validation is possible

### sorting nested objects

sorting nested object(by keys) or arrays

```javaScript
    var {objectSort} = require('object-projection');
    var input = {
      d: 1,
      c: { b: [1, "a", "b"], a: 1 },
      b: "sss",
      a: [{ b: [1, "g", "i"], a: 3 }, { b: [1, "g", "i"], a: 2 }]
    }
    var result = objectSort(input)
    // {
    // "a":[{"a":2,"b":["g","i",1]},{"a":3,"b":["g","i",1]}],
    // "b":"sss",
    // "c":{"a":1,"b":["a","b",1]},
    // "d":1
    // }
```

### comparing nested arrays or objects

compaire nested array and object

```javaScript
    var {objectCompare} = require('object-projection');
    var input1 = {
      d: 1,
      c: { b: [1, "a", "b"], a: 1 },
    }
    var input2 = {
        c: { a: 1 ,b: [1, "a", "b"]},
        d: 1,
    }
    var result = objectCompare(input1,input2)
    //if true returns input1 else returns null
    // {
    //   d: 1,
    //   c: { b: [1, "a", "b"], a: 1 },
    // }
```

### flattening objects

make nested objects to single layer object or vice versa

```javascript
var { objToFlat, flatToObj } = require("object-projection");

var input = {
  key1: "any",
  key2: {
    "key3.key4": {
      key5: {
        key6: "any"
      }
    },
    key7: "any"
  }
};

var result = objToFlat(input);
/*
        result = {
            key1:'any',
            "key2.key3.key4.key5.key6":'any',
            "key2.key7":'any'
        }
    }
    */

var result2 = flatToObj(result);
/*
        result = {
            key1:'any',
            key2:{
                key3:{
                    key4:{
                        key5:{
                            key6:'any'
                        }
                    }
                },
                key7:'any'
        }
    }
    */
```
