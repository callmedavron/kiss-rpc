# KISS RPC

Simple JSON-RPC framework written in Typescript.
Main feature you can register methods by using Decorators

# Install
```
  - git clone https://github.com/callmedavron/kiss-rpc.git
  - npm install && npm start
  - Send post request to localhost:9090
```

# Documentation :)
```js
    @setKissMethod('test-api-method') // you can pass name of method
    testMethod(params) {
        return params + params;
    }
```

```js
    @setKissMethod(true) // You can set true, method will be register with self name -> e.g testMethod
    testMethod(params) {
        return params + params;
    }
```

# Status codes
```
  - {"result": ... , "success":true} // success response
  - {"result":"__method_not_exist__", "success":false} // method not exist
  - {"result":"__invalid_payload__","success":false} // invalid payload, bad json
  - {"result":"__post_method_required__","success":false} // allow only POST request type
```
