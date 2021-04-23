# Robin-Server
Host a RobinDB server
-----------------------------------------
With RobinDB in the cloud, the sky is the limit. RobinDB features an advanced user permissions system, super fast queries, and is easier to set up than almost any other cloud database. This package is the RobinDB server. You can find the client [here](npmjs.com/package/robindb-client) and the local version [here](https://npmjs.com/package/robindb).

## How to set up
To set up RobinDB Server, install it with `npm i robindb-server`, and then include the code below:
```js
const { DBServer } = require('./server.js');
const db = new DBServer(8080, {
  'demo': {
    password: 'demo',
    allowed_directories: [
      '*'
    ],
    allowed_methods: [
      'GET',
      'SET',
      'PUSH',
      'DELETE'
    ]
  }
});
db.on('ready', () => console.log('Ready'));
```
### Here's a rundown of what this does:
 * Line 1: Require the server
 * Line 2: Start the server on port 8080
 * Line 3: Create a user with name 'demo'
 * Line 4: Set the password to 'demo'
 * Lines 5-7: Allow all directories with the wildcard (*) option
 * Lines 8-13: Allow all methods of querying the database

## Important information
The `ready` event will fire when the server has started. This database server was built with [Replit](https://replit.com) in mind, so that's where it's meant to be used. If you're making a larger project, a database such as MongoDB or a SQL database would probably be a better fit.
 

That's it! If you have any questions I'm [YodaLightsabr#6565 on Discord](https://discord.gg/M8YY32acjm).
