# regexp-url-matcher
Node.js utility to match and reverse routes.

## Features
* static fields  
* Parameter fields
  * named / unnamed
* custom evaluated through `RegExp`s
* `RegExp` modifiers

## Install
Official npm support is comming!
```
npm install git+https://github.com/yangodev/regexp-url-matcher
```

## How To Use
### Require
```javascript
var matcher = require('regexp-url-matcher')
var pattern = matcher.create(url, [config])
```

### Field Types
#### Static fields:
```javascript
var pattern = matcher.create('/static|modifier')
pattern.match('/static') >> {}
pattern.match('/notStatic') >> null
```

#### Parameter Fields:
Define Parameters by set a name inside `{}` brackets.
The result is stored behind the name you set. If no name is given `_` is used as wildcard key.
```javascript
var pattern = matcher.create('/{param}|modifier')
pattern.match('/jo') >> {param : 'jo'}
```

#### Custom evaluated
Define custom `RegExp`s inside square brackets (`[]`).
The result is stored behind the `@eval` key.
```javascript
var pattern = matcher.create('/[\\d+a]|modifier')
pattern.match('/12345a') >> {@eval : 1234a}
```

#### Special Behavior
When having multiple parameters with the same name (also wildcards) will result in `_`s added behind every key with the same name.
```javascript
matcher.create('/{}/{}/{}/{p}/{p}').match('/foo/bar/baz/barum/birum')
>> {
  _: 'foo', __: 'bar', ___: 'baz',
  p: 'barum', p_: 'birum'
}

```

### Modifier
After each field definition you can pass `RegExp`ish modifier (*, + ,? {n}), delimited by a full dash (`|`)
``` javascript
matcher.create('/{p}|?').match('/') >> {p : ''}
matcher.create('/{p}|?').match('/asd') >> {p : 'asd'}

matcher.create('/{p}|+').match('/') >> null
matcher.create('/{p}|+').match('/foo/bar') >> {p : ['foo', 'bar']}

matcher.create('/{p}|*').match('/') >> {p : ''}
matcher.create('/{p}|*').match('/foo/bar') >> {p : ['foo', 'bar']}
```

### Configuration
As second parameter to the create method you can parse an Object with customizations.
Currently only custom delimiters are supported.
```javascript
matcher.create('{}.google.{}', {delimiter : '.'}).match('mail.google.com') >> { _: 'mail', __: 'com' }
```

-----
# License
MIT
