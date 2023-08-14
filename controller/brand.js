const { Brand } = require("../model/Brand");

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({});
    return res.status(200).json(brands);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

exports.addBrand = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const addedBrand = await brand.save();
    return res.status(200).json(addedBrand);
  } catch (error) {
    return res.status(500).json(error);
  }
};