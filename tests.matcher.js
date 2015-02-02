var api = require('./matcher.js')

var patt = api.create('/{}|+/stop/{param}|{2}/[\\d+g]|{2}/{}|+/end')
console.log(patt.match('/b/stop/c/d/3g/6g/gar/bidge/end'))
console.log(
	patt.reverse({
		_: 'b',
		param: [ 'c', 'd' ],
		'@eval': [ '3g', '6g' ],
		__: [ 'gar', 'bidge' ]
	})
)

var patt2 = api.create('{}|*.google.{}|*', {delimiter : '.'})
console.log(patt2.match('mail.google.com'))
console.log(patt2.reverse({_: 'mail', __:'com'}))
