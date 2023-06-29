const express = require('express');
const router = express.Router();
const purchasecontroller = require('../controller/purchasepremiumship');
const authenticatemiddleware = require('../middleware/auth');
router.get('/purchasepremiumship', authenticatemiddleware.authorisation, purchasecontroller.purchasepremiumship );
router.post('/updatetransactionstatus',authenticatemiddleware.authorisation,purchasecontroller.updateTransaction );
router.post('/updatefailedtransaction',authenticatemiddleware.authorisation,purchasecontroller.updateTransactionstatus );

module.exports= router;
