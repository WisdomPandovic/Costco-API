const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express()

const bodyParser = require('body-parser');

const PORT  =process.env.PORT || 3008;
const DB_URL = "mongodb://127.0.0.1:27017/costco-api"
const routes = require('./routes/app')
const path = require('path')


mongoose.connect(DB_URL,{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connection.on('open',()=>console.log("Server connected"))
mongoose.connection.on('err',(err)=>console.log(err))

app.use(cors());
app.use('/productimage', express.static(path.join(__dirname,'public',"productimage")))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(routes)

app.listen(PORT)
console.log("App is running on http://localhost:"+PORT)