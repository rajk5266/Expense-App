const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const app = express()

app.use(cors())

const signup = require('./routes/main')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/', signup)

app.use(express.static('views'))

sequelize
 .sync( )
 .then(result => {
    console.log('database connected')
    app.listen(8000) 
     })
 .catch(err => console.log(err))