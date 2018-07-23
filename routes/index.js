var express = require('express')
var router = express.Router()
var auth = require('../auth.js')

router.get('/', function (req, res, next) {
  var url = auth.getAuthUrl();
  let buff = new Buffer(req.url);
  let encodedString = buff.toString('base64');
  /*
  res.send(`
        <h1>Site review map</h1>
        <p><a href="/map?id=1OrTv4Sd6PI3KEc-qtv81UCUr40P6XWeToxbiVGQCcII&range=List!A1:U379">Example map</a></p>
        <a href=${url}&state="+${encodedString}>User login</a>
    `)
  */
  res.render('index', { title: 'Site Review Mapper', spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/19i-_Pa060eG33j1_ph1DN44ryPczXyDAWmJv4Vtx8r4/edit#gid=758265720', range: 'Map!A1:U379', url: '/map?id=19i-_Pa060eG33j1_ph1DN44ryPczXyDAWmJv4Vtx8r4&range=Map!A1:U379' })
})

module.exports = router
