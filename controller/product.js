const { Product } = require("../model/Product");

exports.addProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const addedProduct = await product.save();
    return res.status(200).json(addedProduct);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { _sort, category, brand, _page, _limit, _order } = req.query;
    const queryParams = {};
    if (category) {
      queryParams.category = category;
    }
    if (brand) {
      queryParams.brand = brand;
    }

    // sort options
    const sortOptions = {};
    if (_sort === "price") {
      sortOptions.price = _order === "asc" ? 1 : -1;
    }

    // pagination
    const skip = (parseInt(_page) - 1) * parseInt(_limit);
    const limit = parseInt(_limit);
    const products = await Product.find(queryParams)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    const totalCount = await Product.countDocuments(queryParams);
    return res.status(200).json({ totalCount, products });
  } catch (error) {
    return res.status(500).json("Internal server error!");
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params.id;
    const product = await Product.findById(id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.updateProductById = async (req, res) => {
  try {
    const { id } = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
};
