function Plugin(db, opts) {
	var options = {
		createdProperty: 'created_at',
		modifiedProperty: 'modified_at',
		expiresProperty: false,
		dbtype: { type: 'date', time: true },
		now: function() { return new Date(); },
		expires: function() { var d = new Date(); d.setMinutes(d.getMinutes() + 60); return d; },
		persist: true
	};


	function extend(original, update) {
		if(typeof update == 'undefined') return original;

		var union = {};
		for(var k in original) {
			union[k] = typeof(update[k]) != 'undefined' ? update[k]  : original[k];
		}

		return union;
	}

	function wrapHook(hooks, hookName, postLogic) {
		if(typeof hooks[hookName] == 'function') {
			var oldHook = hooks[hookName];
			hooks[hookName] = function(next) {
				var cont = function(err) {
					if(err) return next(err);
					try {
						postLogic.call(this);
						return next();
					} catch(err) {
						next(err);
					}
				}

				try {
					oldHook.call(this, (function(err) {
						cont.call(this, err);
					}).bind(this));

					if(oldHook.length == 0) cont.call(this);
				} catch(err) {
					return next(err);
				}
			};
		} else {
			hooks[hookName] = postLogic;
		}
	}

	function monitor(name, properties, opts) {

		if(opts.timestamp !== true) return;

		if(options.persist && opts.createdTimestamp !== false && options.createdProperty !== false)
			properties[options.createdProperty] = options.dbtype;
		if(options.persist && opts.modifiedTimestamp !== false && options.modifiedProperty !== false)
			properties[options.modifiedProperty] = options.dbtype;
		if(options.persist && opts.expiresTimestamp !== false && options.expiresProperty !== false)
			properties[options.expiresProperty] = options.dbtype;

		opts.hooks = opts.hooks || {};

		if(opts.createdTimestamp !== false && options.createdProperty !== false)
			wrapHook(opts.hooks, 'beforeCreate', function() {
				if(options.persist)
					this[options.createdProperty] = options.now();
				else if(this[options.createdProperty] === undefined)
					Object.defineProperty(this, options.createdProperty, {
						value: options.now()
					});
			});

		if(opts.modifiedTimestamp !== false && options.modifiedProperty !== false)
			wrapHook(opts.hooks, 'beforeSave', function() {
				this[options.modifiedProperty] = options.now();
			});

		if(opts.expiresTimestamp !== false && options.expiresProperty !== false) {
			wrapHook(opts.hooks, 'beforeSave', function() {
				var expires = typeof(opts.expires) !== 'undefined' ? opts.expires : options.expires ;
				this[options.expiresProperty] = expires();
			});
		}
	}


	options = extend(options, opts);

	return {
		beforeDefine: monitor
	}
};

module.exports = Plugin;
