var ansi = require('ansi-styles')
var size = require('window-size')
var through = require('through2')
var vw = require('visualwidth')
var unescape = require('unescape')

module.exports = function() {
  return through.obj(function(obj, enc, next) {
    this.push(renderRow(obj))
    next()
  })
}

function renderRow(obj) {
  var unread = obj.labelIds.indexOf('UNREAD') > -1
  var openColor = '', closeColor = ''
  if (unread) {
    openColor = ansi.bold.open
    closeColor = ansi.bold.close
  } else {
    openColor = ansi.gray.open
    closeColor = ansi.gray.close
  }
  
  // before adding ansi chars that throw off our length calculation we must construct the plaintext line
  var snippet = unescape(obj.snippet.trim())
  var subject = getHeader(obj, 'Subject').trim()
  subject = vw.truncate(subject, 60, '...')
  var line = [subject, '-', snippet]
    .join(' ')
    .replace(/—/ig, '-') // visualwidth module things these dashes are 2 wide when they are really 1, so i replace them here with -
  var hyphenIndex = subject.length + 2
  
  // truncate line to screen width
  var width = vw.width(line)
  line = vw.truncate(line, size.width - 2, '...') // the 2 is for the bullet and space that gets added to the beginning below

  // split plaintext line so we can insert colors
  if (line.length >= hyphenIndex) line = [line.substr(0, hyphenIndex), line.substr(hyphenIndex, line.length)]
  else line = [line, '']
  var colorized = ['• ', openColor, line[0], closeColor, line[1]].join('')
  
  return colorized + '\n'

  function getHeader(email, header) {
    var headers = email.payload.headers
    for (var i = 0; i < headers.length; i++) {
      if (headers[i].name === header) return headers[i].value
    }
    return ''
  }
}
