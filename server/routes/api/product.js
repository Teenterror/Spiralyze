const Product = require("../../models/Product");

module.exports = (app) => {
  app.get("/api/products", (req, res, next) => {
    Product.find()
      .exec()
      .then((productList) => res.json(productList))
      .catch((err) => next(err));
  });

  app.post("/api/product", function (req, res, next) {
    const {name,price} = req.body;
    const product = new Product({name,price});
    product
      .save()
      .then(() => res.json(product))
      .catch((err) => next(err));
  });

  app.delete("/api/product/:id", function (req, res, next) {
    Product.findOneAndDelete({ _id: req.params.id })
      .exec()
      .then(() => res.json())
      .catch((err) => next(err));
  });

  app.put("/api/product/:id", (req, res, next) => {
    Product.findByIdAndUpdate(req.params.id,{name:req.body.name,price:req.body.price})
      .exec()
      .then((product) => {
        res.json(product)
      })
      .catch((err) => next(err));
  });
};
