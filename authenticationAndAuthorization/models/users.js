const mongoose = require('mongoose');

try {
    mongoose.connect("dblink.com/authenticationAndAuthorization");
} catch (error) {
    console.log("couldn't connect to the database");
}

const userSchema = mongoose.Schema({
     username : String,
     email:String,
     password:String,
     age:Number
})

module.exports = mongoose.model("users",userSchema);