const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {



  return Promise.resolve(req.cookies.shortlyid)
    .then(hash => {
      if (!hash) {
        throw hash;
      }
      return models.Sessions.get({ hash });
    })
    .tap(session => {
      if (!session) {
        throw session;
      }
    })
    // initializes a new session
    .catch(() => {
      return models.Sessions.create()
        .then(results => {
          return models.Sessions.get({ id: results.insertId });
        })
        .tap(session => {
          res.cookie('shortlyid', session.hash);
        });
    })
    .then(session => {
      req.session = session;
      next();
    });








  // .resolve(req.cookies)

  // cookie exists here

  // if session does not exist
  //   do something else

  // //   //if cookie exists, assigns cookie to session
  // Promise.resolve(req.cookies.shortlyid)
  //   .then ( hash => {
  //     if (!hash) {
  //       return models.Sessions.create()
  //         .then((newSession) => {

  //           return models.Sessions.get({id: newSession.insertId})
  //             .then ((session) => {
  //               res.cookie('shortlyid', session.hash);
  //             });
  //         });
  //     } else {
  //       return models.Sessions.get({ hash: req.cookies.shortlyid});
  //     }
  //   })
  //   .catch(() => {
  //     return models.Sessions.create()
  //       .then((result) => {
  //         return models.Sessions.get( { id: result.insertId} )
  //           .tap((session) => {
  //             res.cookie('shortlyid', session.hash);
  //           });
  //       })
  //       .catch((err)=> {
  //         // what if the body has no username or password
  //         return models.Users.get({username: req.body.username})
  //           .then ((user) => {
  //             var options = {user: {username: req.body.username}, userId: user.id};
  //             return models.Sessions.create(options);
  //           });
  //       });
  //   })
  //   .then((session) => {
  //     req.session = session;
  //     next();
  //   });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  if (!models.Sessions.isLoggedIn(req.session)) {
    res.redirect('/login');
  } else {
    next();
  }
};
