#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var ansi = require('ansi-styles')
var size = require('window-size')
var ogmail = require('./')

var configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'googleauth.json')
var token = JSON.parse(fs.readFileSync(configPath)).access_token

ogmail({token: token})
  .on('data', function(obj) {
    var unread = obj.labelIds.indexOf('UNREAD') > -1
    var openColor = '', closeColor = ''
    if (unread) {
      openColor = ansi.bold.open
      closeColor = ansi.bold.close
    } else {
      openColor = ansi.gray.open
      closeColor = ansi.gray.close
    }
    var out = ['•' + openColor, getHeader(obj, 'Subject').trim(), closeColor + '-', obj.snippet.trim()].join(' ')
    if (out.length > size.width) out = out.substr(0, size.width)
    console.log(out)
  })
  .on('error', function(e) {
    console.error('Error!', e)
  })

function getHeader(email, header) {
  var headers = email.payload.headers
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].name === header) return headers[i].value
  }
}