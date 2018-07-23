const {google} = require('googleapis');
var path = require('path')
const fs = require('fs');
var OAuth2 = google.auth.OAuth2


const scopes = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/drive'
];

const ClientId = process.env.CLIENT_ID
const ClientSecret = process.env.CLIENT_SECRET
const RedirectionUrl = process.env.REDIRECT_URL



exports.getOAuthClient = function getOAuthClient () {
    console.log(">>getOAuthClient>>" + ClientId + " *** " +  ClientSecret + " *** " + RedirectionUrl)

    return new OAuth2(ClientId, ClientSecret, RedirectionUrl)
}

exports.getAuthUrl = function getAuthUrl () {
  var oauth2Client = this.getOAuthClient()
  // generate a url that asks permissions for Spreadsheet and drive scopes

  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes // If you only need one scope you can pass it as string
  })

  return url
}
