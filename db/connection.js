const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/technunctus').then(() => {
  console.log('connected to mongodb')
})

let Transactions = new mongoose.Schema({
  transactionid: {
    type: String
  },
  transactionamount: {
    type: Number
  },
  name: String,
  email: String,
  contact: String,
  referral: String,
});

let TranscationModel = mongoose.model('Transaction', Transactions)

module.exports = {
  TranscationModel
}
