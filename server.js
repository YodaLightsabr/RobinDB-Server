const express = require('express');
const db = require('robindb');
class Server extends require('events').EventEmitter {
  constructor (PORT, AUTH) {
    super();
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.nestAuth = (method, path) => {
        if (req.headers.username && req.headers.password && AUTH[req.headers.username]) {
          if (AUTH[req.headers.username].password === req.headers.password) {
            if (AUTH[req.headers.username].allowed_methods && AUTH[req.headers.username].allowed_methods.includes(method)) {
              if (AUTH[req.headers.username].allowed_directories && (AUTH[req.headers.username].allowed_directories.includes('*') || AUTH[req.headers.username].allowed_directories.filter(a => path.startsWith(a)).length > 0)) {
                return false;
              }
            } else {
              return true;
            }
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
      res.sendError2 = (input) => {
        res.send(JSON.stringify({error:true,message:input}));
      }
      next();
    });

    app.post('/connect', async (req, res) => {
      if (req.nestAuth()) return res.status(403).sendError2('Unauthorized');
      res.send('OK');
    });

    app.post('/get/:path', async (req, res) => {
      if (req.nestAuth('GET', req.params.path)) return res.status(403).sendError2('Unauthorized');
      var data = await db.get(req.params.path);
      res.send(JSON.stringify(data));
    });

    app.post('/all', async (req, res) => {
      if (req.nestAuth('GET', '*')) return res.status(403).sendError2('Unauthorized');
      var data = await db.all();
      res.send(JSON.stringify(data));
    });

    app.post('/has/:path', async (req, res) => {
      if (req.nestAuth('GET', req.params.path)) return res.status(403).sendError2('Unauthorized');
      var data = await db.has(req.params.path);
      res.send(JSON.stringify(data));
    });

    app.post('/set/:path', async (req, res) => {
      if (req.nestAuth('SET', req.params.path)) return res.status(403).sendError2('Unauthorized');
      if (!req.body.value) return res.sendError2('You must specify a value to set.');
      var data = await db.set(req.params.path, req.body.value);
      res.send(JSON.stringify(data || 'OK'));
    });

    app.post('/push/:path', async (req, res) => {
      if (req.nestAuth('PUSH', req.params.path)) return res.status(403).sendError2('Unauthorized');
      if (!req.body.value) return res.sendError2('You must specify a value to push.');
      var data = await db.push(req.params.path, req.body.value);
      res.send(JSON.stringify(data || 'OK'));
    });

    app.post('/delete/:path', async (req, res) => {
      if (req.nestAuth('DELETE', req.params.path)) return res.status(403).sendError2('Unauthorized');
      var data = await db.delete(req.params.path);
      res.send(JSON.stringify(data || 'OK'));
    });

    app.listen(PORT, () => {
      this.emit('ready', {});
    });
  }
}
module.exports = {
  DBServer: Server
}
