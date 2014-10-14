var Gmail = require('node-gmail-api')

module.exports = function(opts) {
  var gmail = new Gmail(opts.token)
  return gmail.messages('label:inbox', {max: 10})
}
