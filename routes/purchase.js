const express=require('express')

const Authenticate= require('../middleware/auth')
const purchaseController= require('../controller/purchase')

const router= express.Router();

router.get("/purchase/premiummembership",Authenticate,purchaseController.purchasePremium)

module.exports=router;