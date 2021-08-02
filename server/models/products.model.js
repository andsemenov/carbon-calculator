const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productsSchema = new Schema({
  id: { type: Number, required: true },
  productName: { type: String, required: true },
});

const Products = mongoose.model("Products", productsSchema);

module.exports = Products;
