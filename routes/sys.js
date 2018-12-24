'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/sys/git',
    config: {
      auth: false
    },
    handler: function () {
      var Boom = require('boom');
      var exec = require('child_process').exec;

      return exec("cd /home/bitnami/htdocs/api", function (error, stdout, stderr) {

        if (error) {
          console.log(error);
          return Boom.boomify(error, { statusCode: 422 });
        }
        console.log(stdout);
        return exec("sudo git pull", function (error, stdout, stderr) {
          if (error) {
            console.log(error);
            return Boom.boomify(error, { statusCode: 422 });
          }
          return exec("sudo pm2 restart app.js", function (error, stdout, stderr) {
            if (error) {
              console.log(error);
              return Boom.boomify(error, { statusCode: 422 });
            }
            return { message: 'success' }
          });
        });
      });
    }
  },
  {
    method: 'GET',
    path: '/sys/test',
    config: {
      auth: false
    },
    handler: function () {
      return 'test';
    }
  },
  {
    method: 'GET',
    path: '/sys/seeder',
    config: {
      auth: {
        scope: ['admin']
      },
    },
    handler: (req, h) => {
      var Boom = require('boom');
      var exec = require('child_process').exec;

      var model = req.query['model'];

      return exec(`cd /home/bitnami/htdocs/api/seeder`, function (error, stdout, stderr) {
        if (error) {
          console.log(error);
          return Boom.boomify(error, { statusCode: 422 });
        }
        return (stdout);
        return exec(`sudo node ${model}`, function (error, stdout, stderr) {
          if (error) {
            console.log(error);
            return Boom.boomify(error, { statusCode: 422 });
          }
          return { message: 'success' }
        });
      })
    }
  }
]

