const { tap } = require('ramda')
module.exports = message => tap(data => console.log(message, data))