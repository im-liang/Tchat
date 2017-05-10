// Settings for our app. The 'require' call in server.js returns
// whatever we assign to 'module.exports' in this file

module.exports = {
  // MongoDB database settings
  db: {
    host: '127.0.0.1',
    port: 27017,
    name: 'Robingoods',
    url: 'mongodb://localhost/Robingoods'
    // url: 'mongodb://192.168.1.24/Robingoods'
  },
  // Port for the webserver to listen on
  http: {
    port: 3000
  },
};
