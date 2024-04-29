const mongoose = require('mongoose');

try {
    mongoose.connect("mongodb+srv://nishchalb21:NB5TbGJNdghPRr5E@cluster0.0oavpu3.mongodb.net/authenticationAndAuthorization");
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