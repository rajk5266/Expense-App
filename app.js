require('dotenv').config()
const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const app = express()

app.use(cors())
const User = require('./models/user')
const Expense = require('./models/expensetable')
const resetPasswordRequest = require('./models/resetPassword')

const signup = require('./routes/signup')
const login = require('./routes/login')
const expenses = require('./routes/ExpensePage');
const premium = require('./routes/premium')
const leaderboard = require('./routes/leaderboard')
const resetPassword = require('./routes/resetPassword')
const report = require('./routes/report')
const dashboard = require('./routes/dashboard')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', signup)
app.use('/', login)
app.use('/', expenses)
app.use('/', premium)
app.use('/', leaderboard)
app.use('/', resetPassword)
app.use('/', report)
app.use('/', dashboard)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

app.use(express.static(path.join(__dirname, 'public')));

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(resetPasswordRequest)
resetPasswordRequest.belongsTo(User)

sequelize
    .sync()
    .then(result => {
        console.log('database connected')
        app.listen(process.env.PORT || 8000)
    })
    .catch(err => console.log(err))