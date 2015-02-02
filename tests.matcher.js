var api = require('./matcher.js')
var assert = require('assert')


console.log('1. Testing routes with many parameters, incuding intern RegExp testing.')
var patt = api.create('/{}|+/stop/{param}|{2}/[\\d+g]|{2}/{}|+/end')
assert.deepEqual(patt.match('/b/stop/c/d/3g/6g/gar/bidge/end'),{
	_: 'b',
	param: [ 'c', 'd' ],
	'@eval': [ '3g', '6g' ],
	__: [ 'gar', 'bidge' ]
})
assert.equal(
	patt.reverse({
		_: 'b',
		param: [ 'c', 'd' ],
		'@eval': [ '3g', '6g' ],
		__: [ 'gar', 'bidge' ]
	}),
	'/b/stop/c/d/3g/6g/gar/bidge/end'
)
console.log('done!')


console.log('2. Testing with custom delimiter.')
var patt2 = api.create('{}|*.google.{}|*', {delimiter : '.'})
assert.deepEqual(patt2.match('mail.google.com'), { _: 'mail', __: 'com' })
assert.equal(patt2.reverse({_: 'mail', __:'com'}), 'mail.google.com')
console.log('done!')

console.log('3. testing empty routes.')
var patt3 = api.create('/')
assert.deepEqual(patt3.match('/'), {})
assert.deepEqual(patt3.match(''), {})
assert.equal(patt3.reverse(), '/')
console.log('done!')

var patt4 = api.create('/s/static|?/{p}|+/stop/[\\d+]|{2}')
console.log(patt4.match('/s/static/param/stop/3/5'))

var patt5 = api.create('/static|?/st|?/{p}|*')
console.log(patt5.match('/'))

var patt6 = api.create('/{p}/{p}/{p}')
console.log(patt6.match('/k/l/o'))
