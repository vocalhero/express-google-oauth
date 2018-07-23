const {google} = require('googleapis');
var express = require('express')
var router = express.Router()
var auth = require('../auth.js')
var url = require('url');

/* GET users listing. */
router.get('/:id?', function (req, res, next) {
    var oauth2Client = auth.getOAuthClient()
    console.log(">>>>" + req.params.id)

    if ((typeof(req.session['tokens']) != "undefined")) {
        oauth2Client.setCredentials(req.session['tokens'])
        getData(req, res, oauth2Client);

    } else {
        console.log(">>maps.js get token>>")
        var url = auth.getAuthUrl();
        let buff = new Buffer('/map'+req.url);
        let encodedString = buff.toString('base64');
        res.redirect(url+"&state="+encodedString)
    }
})

function getData (req, res, auth) {
    const sheets = google.sheets('v4');
    var q = url.parse(req.url, true);
    var qdata = q.query;

    sheets.spreadsheets.values.get({
        auth: auth,
        spreadsheetId: qdata.id,
        //range: 'Data!A1:G379'
        range: qdata.range
    }, (err, result) => {
        if (err) {
            console.error('The API returned an error.');
            res.send('The API returned an error.' + err);
            throw err;
        }
        else {
            for (const row of result.data.values) {
                 // Print columns A and E, which correspond to indices 0 and 4.
                console.log(`${row}`);
            }
            res.render('map', { title: 'Map', google_maps_key: process.env.GOOGLE_MAPS_KEY, rows: result.data})
            //res.send('respond with a resource which can be set as needed...' + JSON.stringify(req.session['tokens']))

        }
   });
}


module.exports = router
