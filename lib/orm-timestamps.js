function Plugin(db, opts) {
	var options = {
		createdProperty: 'created_at',
		modifiedProperty: 'modified_at',
		dbtype: { type: 'date', time: true },
		now: function() { return new Date(); },
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
				var cont = function() {
					postLogic.call(this);
					next();
				}

				var that = this;
				oldHook.call(this, function() {
					cont.call(that);
				});

				if(oldHook.length == 0) cont.call(this);
			};
		} else {
			hooks[hookName] = postLogic;
		}
	}

	function monitor(name, properties, opts) {

		if(opts.timestamp !== true) return;

		if(options.persist && options.createdProperty !== false)
			properties[options.createdProperty] = options.dbtype;
		if(options.persist && options.modifiedProperty !== false)
			properties[options.modifiedProperty] = options.dbtype;

		opts.hooks = opts.hooks || {};

		if(options.createdProperty !== false)
			wrapHook(opts.hooks, 'beforeCreate', function() {
				if(options.persist)
					this[options.createdProperty] = options.now();
				else if(this[options.createdProperty] === undefined)
					Object.defineProperty(this, options.createdProperty, {
						value: options.now()
					});
			});

		if(options.modifiedProperty !== false)
			wrapHook(opts.hooks, 'beforeSave', function() {
				this[options.modifiedProperty] = options.now();
			});
	}


	options = extend(options, opts);

	return {
		beforeDefine: monitor
	}
};

module.exports = Plugin;
