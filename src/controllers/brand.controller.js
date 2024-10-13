import { Brand } from "../model/Brand.model.js";

export async function getBrands(req, res) {
  try {
    const brands = await Brand.find({});
    return res.status(200).json(brands);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
}

export async function addBrand(req, res) {
  const brand = new Brand(req.body);
  try {
    const addedBrand = await brand.save();
    return res.status(200).json(addedBrand);
  } catch (error) {
    return res.status(500).json(error);
  }
}