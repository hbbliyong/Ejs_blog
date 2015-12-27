var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'ejs-blog'
    },
    port: 3000,
    db: 'mongodb://localhost/ejs-blog-db'
  },

  test: {
    root: rootPath,
    app: {
      name: 'ejs-blog'
    },
    port: 3000,
    db: 'mongodb://localhost/ejs-blog-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'ejs-blog'
    },
    port: 3000,
    db: 'mongodb://localhost/ejs-blog-production'
  },
};

module.exports = config[env];
