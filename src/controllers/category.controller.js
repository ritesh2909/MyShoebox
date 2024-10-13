import { Category } from "../model/Category.model.js";

export async function getCategories(req, res) {
  try {
    const categories = await Category.find({});
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
}

export async function addCategory(req, res) {
  const category = new Category(req.body);
  try {
    const addedCategory = await category.save();
    return res.status(200).json(addedCategory);
  } catch (error) {
    return res.status(500).json(error);
  }
}