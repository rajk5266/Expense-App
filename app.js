require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const app = express()


app.use(cors())
const User = require('./models/user')
const Expense = require('./models/expensetable')
const resetPasswordRequest = require('./models/resetPassword')

const signup = require('./routes/signupRoutes')
const login = require('./routes/loginRoutes')
const expenses = require('./routes/ExpensePageRoute');
const premium = require('./routes/premiumroute')
const leaderboard = require('./routes/leaderboardRoute')
const resetPassword = require('./routes/resetPasswordRoute')
const report = require('./routes/reportRoute')
const dashboard = require('./routes/dashboardRoute')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', signup)
app.use('/', login)
app.use('/', expenses)
app.use('/', premium)
app.use('/', leaderboard)
app.use('/', resetPassword)
app.use('/', report)
app.use('/', dashboard)

app.use(express.static(path.join(__dirname, 'public')));

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(resetPasswordRequest)
resetPasswordRequest.belongsTo(User)

sequelize
 .sync( )
 .then(result => {
    console.log('database connected')
    app.listen(process.env.PORT) 
     })
 .catch(err => console.log(err))