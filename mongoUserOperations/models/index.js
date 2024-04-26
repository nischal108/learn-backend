const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://nishchalb21:NB5TbGJNdghPRr5E@cluster0.0oavpu3.mongodb.net/userscreation")
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
    });

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    image: String
});

module.exports = mongoose.model('User', userSchema);
