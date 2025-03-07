const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    published: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Book', BookSchema);