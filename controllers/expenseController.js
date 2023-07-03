const path = require('path');
const Expense = require('../models/expensetable');

exports.showMainPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'expenses.html'))
}


exports.getExpensesList = async (req, res) =>{
    try{
    const response = await Expense.findAll()
    res.send(response)
    // console.log(response)
    }catch(err){
        // console.log(err)
    }
}
exports.addExpense = async (req, res) =>{
    // console.log(req.body)
    const{description , category , amount} = req.body;
    // console.log(description, category, amount)
   await Expense.create({
        description: description,
        category: category,
        amount: amount
    })
    .then(response =>{
        const { id, description, category, amount } = response.dataValues;
         res.send({
            id,
            description,
            category,
            amount
         })
        
    })
    .catch(err => console.log(err))
}

exports.deleteExpense = async(req, res) =>{
    const ID = req.params.deleteId;
    // console.log(req.body)
    console.log(ID)
    try{
        const deletedexpense = await Expense.destroy({
            where: {
                id:ID
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
    console.log(req.body)
    const ID = req.params.updateId;
    console.log(ID)
    const { description, category, amount } = req.body;
    try{
        const updatedexpense = await Expense.findOne({
            where:{
                id: ID
            }
        });
        if(!updatedexpense){
            return res.status(404).json({message: 'expense not found'})
        }
        await updatedexpense.update({
            description,
            category,
            amount
        });
        res.json({description, category, amount});
    }catch(err){
        res.status(500).json({message: 'internal srver error'})
    }
}