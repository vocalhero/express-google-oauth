var express = require('express')
var Session = require('express-session')
var google = require('googleapis')
var auth = require('./auth.js')
var path = require('path')
// var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var routes = require('./routes/index')
var map = require('./routes/map')

var app = express()
app.use(Session({
  secret: 'beepsources-secret-201607011711',
  resave: true,
  saveUninitialized: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
//app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/auth/google/callback', function (req, res) {
    console.log(">>callback>>" + req.url)
  var oauth2Client = auth.getOAuthClient()
  var session = req.session
  var code = req.query.code
  var state = req.query.state
  console.log(">>callback state>>" + state)
  console.log(">>callback code>>" + code)

  oauth2Client.getToken(code, function (err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (!err) {
      oauth2Client.setCredentials(tokens)
      session['tokens'] = tokens
      console.log(">>callback token>>" + tokens)

      if (typeof(state != "undefined")) {
          let buff = new Buffer(state, 'base64');
          let redirectUrl = buff.toString('ascii');
          console.log(">>callback state detected>>" + redirectUrl)
          res.redirect(redirectUrl);
//          res.send(`
//            <h3>Login successful!!</h3>
//            <a href="/map?id=1OrTv4Sd6PI3KEc-qtv81UCUr40P6XWeToxbiVGQCcII&range=List!A1:U379">Go to map page</a>
//        `)
      } else {
          res.send(`
            <h3>Login successful!!</h3>
            <a href="/map?id=1OrTv4Sd6PI3KEc-qtv81UCUr40P6XWeToxbiVGQCcII&range=List!A1:U379">Go to map page</a>
        `)

      }

    } else {
      res.send(`
            <h3>Login failed!!</h3>
        `)
      }
  })
})

app.use('/', routes)
app.use('/map', map)
app.use('/map/:id?', map)
app.use('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
