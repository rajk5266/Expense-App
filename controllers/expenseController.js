const path = require('path');
const Expense = require('../models/expensetable');


exports.showMainPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'expenses.html'))
}


exports.getExpensesList = async (req, res) =>{
    console.log(req.body)
    try{
        const userId = req.user;
        console.log("--",  userId)
    const response = await Expense.findAll({
        where: {
            userId: userId
        }
    })
    res.send(response)
    
    }catch(err){
       
    }
}
exports.addExpense = async (req, res) =>{
    // console.log(req.body)
    const{date, description , category , amount} = req.body;
    // console.log(description, category, amount)
   await Expense.create({
        date: date,
        description: description,
        category: category,
        amount: amount,
        userId: req.user
    })
    .then(response =>{
        const { id,date, description, category, amount } = response.dataValues;
         res.send({
            id,
            date,
            description,
            category,
            amount
         })
        
    })
    .catch(err => console.log(err))
}

exports.deleteExpense = async(req, res) =>{
    const ID = req.params.deleteId;
    const userId = req.user
    // console.log(req.body)
    console.log(ID)
    try{
        const deletedexpense = await Expense.destroy({
            where: {
                id:ID,
                userId: userId
            }
        });
        if(deletedexpense){
            res.send('expense deleted')
        }else{
            res.send('error while deleting')
        }
    }catch(err){
        res.status(500).json({message: 'internal server error'})
    }
};

exports.updateExpense = async (req, res) =>{
    // console.log(req.body)
    const userId = req.user
    const ID = req.params.updateId;
    
    const {date,  description, category, amount } = req.body;
    try{
        const updatedexpense = await Expense.findOne({
            where:{
                id: ID,
                userId: userId
            }
        });
        if(!updatedexpense){
            return res.status(404).json({message: 'expense not found'})
        }
        await updatedexpense.update({
            date, 
            description,
            category,
            amount
        });
        res.json({date, description, category, amount});
    }catch(err){
        res.status(500).json({message: 'internal srver error'})
    }
}