var express = require('express')
var router = express.Router()
var auth = require('../auth.js')

router.get('/', function (req, res, next) {
  var url = auth.getAuthUrl()
  res.send(`
        <h1>Authentication using google oAuth</h1>
        <a href=${url}>Login</a>
    `)
// res.render('index', { title: 'Express' })
})

module.exports = router
