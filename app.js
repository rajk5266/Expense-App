require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

app.use(cors())

const User = require('./models/user')
const Expense = require('./models/expensetable')
const ForgotPasswordRequests = require('./models/forgotPassword')
const signup = require('./routes/signupRoutes')
const login = require('./routes/loginRoutes')
const expenses = require('./routes/ExpenseHomePageRoute');
const premium = require('./routes/premiumroute')
const leaderboard = require('./routes/leaderboardRoute')
const report = require('./routes/reportRoute')
const resetPassword = require('./routes/resetPasswordRoute')
const homePage = require('./routes/homePageRoute')


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use('/', signup)
app.use('/', login)
app.use('/', expenses)
// app.use('/', auth)
app.use('/', premium)
app.use('/', leaderboard)
app.use('/', report)
app.use('/', resetPassword)
app.use('/', homePage)

app.use(express.static(path.join(__dirname, 'views')));

// User.hasMany(Expense);
// Expense.belongsTo(User);
// User.hasMany(ForgotPasswordRequests)
// ForgotPasswordRequests.belongsTo(User)

mongoose.connect(
    process.env.MONGODB
)
.then(res => {
    // console.log(res)
    console.log('connected')
    app.listen(5000)
})
.catch(err => {
    console.log(err)
})