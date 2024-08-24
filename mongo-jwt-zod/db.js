const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');

mongoose.connect('----------secretlink------/usersdetails');

const userScheme = {
    username :String,
    password:String,
    age:Number
}


module.exports = mongoose.model("users",userScheme);

