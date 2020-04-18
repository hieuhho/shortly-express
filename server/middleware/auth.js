const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // .resolve(req.cookies)

  // cookie exists here

  // if session does not exist
  //   do something else

  if (req.cookies.shortlyid) {
    let hash = req.cookies.shortlyid;
    return models.Sessions.get({ hash: req.cookies.shortlyid})
      .then((session) => {
        console.log('session: ', session);
        req.session = session;
        next();
      })
      .catch ((err) => {
        return models.Sessions.create()
          .then((newSession) => {

            return models.Sessions.get({id: newSession.insertId})
              .then ((session) => {
                res.cookie('shortlyid', session.hash);
                // req.cookies('shortlyid', session.hash);
                req.session = session;
                next();
              });
          });

      });
  }


  return models.Sessions.get({ hash: req.cookies.shortlyid})
    .then((err, result) => {
      // return res.cookie(req.body.username, result.hash);
      // console.log('result: ', result);
      res.cookie('shortlyid', result.hash);
      return result;
    })
    .then((session) => {
      req.session = session;
      next();
    })

    .catch((err)=> {

      // what if the body has no username or password

      return models.Users.get({username: req.body.username})
        .then ((user) => {

          var options = {user: {username: req.body.username}, userId: user.id};

          return models.Sessions.create(options);
        })
        .catch ( (err) => {
          return models.Sessions.create();
        });

    })
    .then((result) => {
      return models.Sessions.get( { id: result.insertId} )
        .then((session) => {
          res.cookie('shortlyid', session.hash);
          return session;
        });
    })
    .then((session) => {
      req.session = session;
      next();
    });



};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

