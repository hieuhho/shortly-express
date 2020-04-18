const parseCookies = (req, res, next) => {

  // function that will access the cookies on an incoming request, parse them into an object, and assign this object to a cookies property on the request.

  // setTimeout( () => {
  //   JSON.parse(req).cookies;
  // }, 2000);

  // check if it even has a cookie
  if (!req.headers.cookie) {

    req.cookies = {};

    // initialize a new session, store cookie with name and HASH from session...

  } else {

    var cookiesArray = req.headers.cookie.split('; ');

    var cookiesObject = {};

    for (var eachCookie of cookiesArray) {
      var cookarr = eachCookie.split('=');
      cookiesObject[cookarr[0]] = cookarr[1];
    }

    req.cookies = cookiesObject;
  }
  next();

};

module.exports = parseCookies;