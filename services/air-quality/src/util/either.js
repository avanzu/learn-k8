const { curry }  =require('ramda')
module.exports = curry((predicate, onFalse, onTrue, value) => 
  predicate(value) ? onTrue(value) : onFalse(value))