const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()


app.use(cors())

const signup = require('./routes/main')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/', signup)


app.use(express.static('views'))


app.listen(8000, (req, res) =>{
    console.log("server is running")
})