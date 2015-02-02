var pattern = {
	RE_EXTRACT : /\/?((\{(\w*)\})|\/?(\[(.*)\])|(\w+))(\s*\|\s*(\S*))?/,
	init : function(str, config){
		this.delimiter = config.delimiter || '/'
		this.analyzed = this.analyze(str)

		var delimiter = this.escape(this.delimiter)
		var analyzed = this.analyzed

		var anchors = []
		var regex_str = analyzed.map(function(part){
			if (!part) return null
			return part.regex
		})

		if (regex_str.indexOf(null) > -1) return null

		this.definition = str
		this.regex = new RegExp(regex_str.join(''))

		console.log(this)
		return this
	},

	analyze : function(str){
		var self = this
		var parts = str.match(new RegExp('[^' + this.delimiter + ']+', 'g'))
		var idents = []

		return parts.map(function(part){
			var extracted = self.RE_EXTRACT.exec(part)

			var param = extracted[3]
			var sub_regex = extracted[5]
			var name = extracted[6]
			var modifier = extracted[8]

			var info = {
				regex : null,
				anchor : null
			}

			var begin = ['((?:', self.delimiter, '?(?:'].join('')
			var end = ['))', modifier, ')'].join('')

			if (name && !name.length) return null
			else if (param !== undefined){
				info.anchor = (param.length) ? param : '_'
				// ((?:{{delimiter}}(?:\w+)){{modifier}})
				info.regex = [begin, '\\w+', end].join('')
			}

			else if (sub_regex !== undefined){
				// ((?:{{delimiter}}(?:{{custom RegExp}})){{modifier}})
				info.anchor = '@eval'
				info.regex = [begin, sub_regex, end].join('')
			}
			else {
				info.name = name
				info.regex = [self.delimiter, '?', name].join('')
			}
			if (info.anchor){
				while (idents.indexOf(info.anchor) > -1) { info.anchor = info.anchor + '_' }
				idents.push(info.anchor)
			}

			return info
		})
	},
	match : function(str){
		var result = this.regex.exec(str)

		if (!result) return null
		else result = result.slice(1)

		var index  = 0
		var params = {}

		for (var i in this.analyzed){
			var ident = this.analyzed[i]
			if (!ident.anchor) continue;

			var content = result[index].match(/[^\/]+/g)
			if (content.length === 1) content = content[0]

			params[ident.anchor] = content
			index++
		}

		return params
	},
	reverse : function(params){
		params = params || {}
		var analyzed  = this.analyzed
		var string = []
		var added = []

		var missing = []
		var unsufficient = []


		while (analyzed.length){
			var part = analyzed.shift()
			var anchor = part.anchor
			if (!anchor){ string.push(part.name); continue; }
			else if (!params[anchor]){ missing.push(anchor); continue; }

			var joined = [].concat(params[anchor]).join(this.delimiter)

			if (new RegExp(part.regex).test(joined)) {
				string.push(joined)
			}
			else {
				unsufficient.push(part.anchor)
			}
		}
		if (missing.length || unsufficient.length) return {
			missing : missing,
			unsufficient : unsufficient
		}

		return (new RegExp('^' + this.escape(this.delimiter)).test(this.definition)
		? this.delimiter : '') + string.join(this.delimiter)

	},
	escape : function(str){
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

}

var  api = module.exports = exports = {
	create : function(str, config){
		return Object.create(pattern).init(str,config || {})
	}
}
