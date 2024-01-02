const os = require('os');
const path = require('path');
const startServer = require('./server');
const names = require('./names');
const functions = require('./utils');


functions.sayHi(names.JOHN);
functions.sayHi(names.PETER);
functions.sayHi('Harit');

const absolute = path.isAbsolute('hello', 'node');
// console.log(absolute);
console.log(startServer('hello'));