## NodeJS ORM Modification Timestamps
This plugin adds the ability to keep track of `created_at` and `modified_at` properties on models defined using the [node-orm2][node-orm2] module.

<a href="https://npmjs.org/package/orm"><img src="https://badge.fury.io/js/orm-timestamps.png" alt="" style="max-width:100%;"></a>

## Install
```
npm install orm-timestamps
```

## Dependencies
You'll need [orm][node-orm2] to use this plugin, but other than that there are no external dependencies.

## DBMS Support
Any driver supported by ORM is supported by this plugin.

## Usage
```javascript
model.timestamp();
model.timestamp({ option: value });
```

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
		now: function() { return new Date(); }
	});

	var user = db.define('user', {
		username: String,
		email: String,
		password: String
	});

	//Add timestamping logic to the model
	user.timestamp();
});


```

## Options
- `createdProperty` **string** Determines the name of the property use to store the created timestamp (default `"created_at"`)
- `modifiedProperty` **string** Determines the name of the property used to store the modified timestamp (default `"modified_at"`)
- `dbtype` **object** Allows you to set the type of column used by the DB to allow for custom data types (default `{ type: 'date', time: true }`)
- `now` **function** Allows you to specify a custom function used to set the current time data for the database (default `function() { return new Date(); }`)

## Features
- Easy to add created and modified date/time information to your models
- Highly customizable
- Supports existing beforeCreate/beforeSave hooks through the use of a robust wrapper function

[node-orm2]: https://github.com/dresende/node-orm2