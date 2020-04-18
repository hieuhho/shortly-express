const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  if (req.cookies !== undefined) {

    next();

  } else {

    // if no cookies present. create a session...

    return models.Sessions.create()
      .then((result) => {

        return models.Sessions.get({ id: result.insertId})
          .then((result) => {
            req.cookie = req.body.username + '=' + result.hash;
            return res.cookie(req.body.username, result.hash);
          })
          .then((whatisthis) => {
            // console.log(res === whatisthis );
            next();
          });
      });

  }


  // console.log('res: ', req);


  // var key = req.body.username;

  // req.cookies[key] = hash;

  // req.cookie = 'hey im a cookie';
  // console.log('hey from create session');


};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

