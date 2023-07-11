const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const app = express()

app.use(cors())
const User = require('./models/user')
const Expense = require('./models/expensetable')
const ForgotPasswordRequests = require('./models/forgotPassword')

const login = require('./routes/loginRoutes')
const signup = require('./routes/signupRoutes')
const expenses = require('./routes/ExpenseHomePageRoute');
const premium = require('./routes/premiumroute')
const premiumFeatures = require('./routes/premiumFeaturesRoutes')
const resetPassword = require('./routes/resetPasswordRoute')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', signup)
app.use('/', login)
app.use('/', expenses)
app.use('/', premium)
app.use('/', premiumFeatures)
app.use('/', resetPassword)

app.use(express.static(path.join(__dirname, 'views')));

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(ForgotPasswordRequests)
ForgotPasswordRequests.belongsTo(User)


sequelize
 .sync()
 .then(result => {
    console.log('database connected')
    app.listen(8000) 
     })
 .catch(err => console.log(err))