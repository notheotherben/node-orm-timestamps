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

	function wrapHook(model, hookName, postLogic) {
		if(typeof model.hooks[hookName] == 'function') {
			var oldHook = model.hooks[hookName];
			model.hooks[hookName] = function(next) {
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
			model.hooks[hookName] = postLogic;
		}
	}

	function monitor(model, opts) {
		var opts = extend(options, opts);

		model.properties[opts.createdProperty] = opts.dbtype;
		model.properties[opts.modifiedProperty] = opts.dbtype;

		wrapHook(model, 'beforeCreate', function() {
			this[opts.createdProperty] = opts.now();
		});

		wrapHook(model, 'beforeSave', function() {
			this[opts.modifiedProperty] = opts.now();
		});
	};


	options = extend(options, opts);
	
	return {
		define: function(model) {
			model.timestamp = function(opts) {
				monitor(model, opts || {});
			}
		}
	}
};

module.exports = Plugin;