const router = require("express").Router();
let Products = require("../models/products.model");

router.route("/products").get((req, res) => {
  Products.find()
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
