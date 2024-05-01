const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    timeCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
