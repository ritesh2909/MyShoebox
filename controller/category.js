const { Category } = require("../model/Category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

exports.addCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const addedCategory = await category.save();
    return res.status(200).json(addedCategory);
  } catch (error) {
    return res.status(500).json(error);
  }
};