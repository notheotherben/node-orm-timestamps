function Plugin(db, opts) {
	var options = {
		createdProperty: 'created_at',
		modifiedProperty: 'modified_at',
		dbtype: { type: 'date', time: true },
		now: function() { return new Date(); }
	};


	function extend(original, update) {
		if(typeof update == 'undefined') return original;

		var union = {};
		for(var k in original) {
			union[k] = update[k]  || original[k];
		}

		return union;
	}

	function wrapHook(hooks, hookName, postLogic) {
		if(typeof hooks[hookName] == 'function') {
			var oldHook = hooks[hookName];
			hooks[hookName] = function(next) {
				var waiting = true;

				var cont = function() {
					postLogic.call(this);
					next();
				}

				oldHook.call(this, function() {
					waiting = false;
					cont.call(this);
				});

				if(waiting) cont.call(this);
			};
		} else {
			hooks[hookName] = postLogic;
		}
	}

	function monitor(name, properties, opts) {

		if(opts.timestamp !== true) return;

		properties[options.createdProperty] = options.dbtype;
		properties[options.modifiedProperty] = options.dbtype;

		opts.hooks = opts.hooks || {};

		wrapHook(opts.hooks, 'beforeCreate', function() {
			this[options.createdProperty] = options.now();
		});

		wrapHook(opts.hooks, 'beforeSave', function() {
			this[options.modifiedProperty] = options.now();
		});
	};


	options = extend(options, opts);

	return {
		beforeDefine: monitor
	}
};

module.exports = Plugin;