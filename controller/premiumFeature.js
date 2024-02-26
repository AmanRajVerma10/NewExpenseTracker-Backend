
const User= require('../model/user')
const Expense= require('../model/expense')

exports.getUserLeaderboard=async(req,res,next)=>{
    try {
        const users= await User.findAll();
        const expenses= await Expense.findAll();
        const aggregatedExpense={};
        expenses.forEach(exp=>{
            if(aggregatedExpense[exp.userId]){
                aggregatedExpense[exp.userId]+=exp.amount;
            }
            aggregatedExpense[exp.userId]=exp.amount;
        })
        const retArray=[];
        users.map(user=>{
            retArray.push({name:user.name,totalAmount:aggregatedExpense[user.id] || 0})
        })
        retArray.sort((a,b)=>b.totalAmount-a.totalAmount)
        res.status(200).json({arr:retArray})
        
    } catch (error) {
        console.log(error);
        res.status(400).json({err:error})
        
    }


}