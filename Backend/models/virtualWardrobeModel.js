const mongoose = require('mongoose');
const template = mongoose.Schema;

const ClothingItemSchema = new template({
    name: { type: String, required: true }, 
    image: { type: String, required: true }, 
    category: { type: String, required: true }, 
    clothType: { type: String, required: true }, 
    color: { type: String, required: true }, 
    material: { type: String, required: true }, 
    brand : {type: String, required : true},
    season: { type: [String], default: [] , required : true}, 
    occasion: { type: [String], default: [] , required: true }, 
    createdAt: { type: Date, default: Date.now },     
})


module.exports = mongoose.model("clothes", ClothingItemSchema);


