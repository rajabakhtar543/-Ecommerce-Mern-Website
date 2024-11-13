const mongoose = require('mongoose')
const Schema = mongoose.Schema;



const UserSchema = mongoose.model('users', new Schema({

    'name': { type: String, required: true },
    'email': { type: String, required: true,  index: true, unique:true},
    'phone': { type: Number, required: true, },
    'password' :{type: String, required:true},
    'address': {type: {}, required:true},
    'role':  {type: Number, default:0}

},{timestamps : true}));

module.exports = {UserSchema}