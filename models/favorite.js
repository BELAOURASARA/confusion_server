const mongoose =require('mongoose');
const Schema =mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

/*
var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});
*
var dishSchema = new Schema({
    
    author: {
        type: mongoose.Schema.Types.ObjectId,
       // ref: 'User'
    }
}, {
    timestamps: true
});
*/

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    dishes:[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dish'
    }]

}, {
    timestamps: true
});

var favorites = mongoose.model('favorite',favoriteSchema);
module.exports= favorites;