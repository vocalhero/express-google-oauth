var express = require('express')
var Session = require('express-session')
var google = require('googleapis')
var plus = google.plus('v1')
var auth = require('./auth.js')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var routes = require('./routes/index')
var users = require('./routes/users')

var app = express()
app.use(Session({
  secret: 'beepsources-secret-201607011711',
  resave: true,
  saveUninitialized: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/auth/google/callback', function (req, res) {
  var oauth2Client = auth.getOAuthClient()
  var session = req.session
  var code = req.query.code
  oauth2Client.getToken(code, function (err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (!err) {
      oauth2Client.setCredentials(tokens)
      session['tokens'] = tokens
      res.send(`
            <h3>Login successful!!</h3>
            <a href="/details">Go to details page</a>
        `)
    }else {
      res.send(`
            <h3>Login failed!!</h3>
        `)
    }
  })
})

app.use('/details', function (req, res) {
  var oauth2Client = auth.getOAuthClient()
  oauth2Client.setCredentials(req.session['tokens'])

  var p = new Promise(function (resolve, reject) {
    plus.people.get({ userId: 'me', auth: oauth2Client }, function (err, response) {
      resolve(response || err)
    })
  }).then(function (data) {
    res.send(`
            <img src=${data.image.url} />
            <h3>Hello ${data.displayName}</h3>
        `)
  })
})

app.use('/', routes)
app.use('/users', users)
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
