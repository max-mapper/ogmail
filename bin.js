#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var ogmail = require('./')
var inbox = require('./inbox')

var configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'googleauth.json')
var token = JSON.parse(fs.readFileSync(configPath)).access_token

ogmail({token: token}).pipe(inbox())
