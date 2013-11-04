## NodeJS ORM Modification Timestamps
This plugin adds the ability to keep track of `created_at` and `modified_at` properties on models defined using the [node-orm2][node-orm2] module.

<a href="https://npmjs.org/package/orm-timestamps"><img src="https://badge.fury.io/js/orm-timestamps.png" alt="" style="max-width:100%;"></a>

## Install
```
npm install orm-timestamps
```

## Dependencies
You'll need [orm][node-orm2] to use this plugin, but other than that there are no external dependencies.

## DBMS Support
Any driver supported by ORM is supported by this plugin.

## Example
```javascript
var orm = require('orm'),
    modts = require('orm-timestamps');

orm.connect("mysql://username:password@host/database", function(err, db) {
	if(err) throw err;

	db.use(modts, {
		createdProperty: 'created_at',
		modifiedProperty: 'modified_at',
		dbtype: { type: 'date', time: true },
		now: function() { return new Date(); },
		persist: true
	});

	var user = db.define('user', {
		username: String,
		email: String,
		password: String
	}, {
		timestamp: true
	});
});


```

## Options
- `createdProperty` **string|false** 
  Determines the name of the property use to store the created timestamp (default `"created_at"`). If set to `false`, disables this property.
- `modifiedProperty` **string|false** 
  Determines the name of the property used to store the modified timestamp (default `"modified_at"`). If set to `false`, disables this property.
- `dbtype` **object** 
  Allows you to set the type of column used by the DB to allow for custom data types (default `{ type: 'date', time: true }`).
- `now` **function**
  Allows you to specify a custom function used to set the current time data for the database (default `function() { return new Date(); }`).
- `persist` **boolean**
  Used to prevent creation and modification timestamps from being stored in the database (default `true`).

## Features
- Easy to add created and modified date/time information to your models
- Highly customizable
- Supports existing beforeCreate/beforeSave hooks through the use of a robust wrapper function
- Allows values to be stored "in-memory" if usage scenarios don't require them to be stored in the database.

[node-orm2]: https://github.com/dresende/node-orm2