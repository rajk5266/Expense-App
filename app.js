const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const app = express()

app.use(cors())

const login = require('./routes/loginRoutes')
const signup = require('./routes/signupRoutes')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', login)

app.use('/', signup)
// app.use(express.static('views'))
app.use(express.static(path.join(__dirname, 'views')));


sequelize
 .sync( )
 .then(result => {
    console.log('database connected')
    app.listen(8000) 
     })
 .catch(err => console.log(err))