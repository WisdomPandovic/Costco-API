 const express = require('express')
const app = express.Router()

require('./routes/user')(app)
require('./routes/product')(app)
require('./routes/category')(app)
require('./routes/notification')(app)
require('./routes/addcart')(app)

module.exports = app  

