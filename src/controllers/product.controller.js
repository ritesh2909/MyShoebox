import { Product, ProductGenderEnum, ProductGenderEnumMatch } from "../model/Product.model.js";
import {ProductInfo} from "../model/ProductInfo.model.js";
import slugify from "slugify";
import {validateMongoDbId} from "../utils/validateMongoId.js";
import { Category } from "../model/Category.model.js";
import { Brand } from "../model/Brand.model.js";
import { ObjectId } from "mongodb";
import {sortingOptions} from "../utils/utils.js";
// import { searchResponse } from "./search.js";

// api to add new products
export const addProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const addedProduct = await product.save();
    return res.status(200).json(addedProduct);
  } catch (error) {
    return res.status(500).json(error);
  }
}

// api to get all products
export const getProducts = async (req, res) => {
  try {
    const { _sort, category, brand, _page, _limit, _order } = req.query;
    const queryParams = {};
    if (category) {
      queryParams.category = category;
    }
    if (brand) {
      queryParams.brand = brand;
    }

    // todo sort for prices

    // pagination
    const skip = (parseInt(_page) - 1) * parseInt(_limit);
    const limit = parseInt(_limit);
    // const products = await Product.find(queryParams)
    //   .sort(sortOptions)
    //   .skip(skip)
    //   .limit(limit);
    const totalCount = await Product.countDocuments(queryParams);
    return res
      .status(200)
      .json({ totalCount, products: await Product.find({}).exec() });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error!");
  }
}

// api to get homepage products
export const getHomePageProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json(error);
  }
}

// get product by objectId
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params.id;
    const product = await Product.findById(id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
}

// upate using objectid
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params.id;
    validateMongoDbId;
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
}

// delete product
export const deleteProductById = async (req, res) => {
  const id = req.params;
  validateMongoDbId(id);
  try {
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
}

// get product by productid
export const getProductByProductId = async (req, res) => {
  try {
    const color = req.query.color;
    const size = req.query.size;
    const id = req.params.productId;
    let product = await Product.findOne({ productId: id }).populate("brand");
    if (!product) {
      return res.status(404).json("Product not found!");
    }
    const defaultVarient = await ProductInfo.findOne({
      productId: id,
      color: color,
      isDefault: true,
    });
    let productVarients;
    if (color && size) {
      productVarients = await ProductInfo.find({
        productId: id,
        size: size,
        color: color,
      });
    } else if (color) {
      productVarients = await ProductInfo.find({
        productId: id,
        color: color,
      });
    } else if (size) {
      productVarients = await ProductInfo.find({
        productId: id,
        size: size,
      });
    } else {
      productVarients = await ProductInfo.find({
        productId: id,
      });
    }

    return res.status(200).json({
      product,
      defaultVarient: defaultVarient,
      productVarients: productVarients,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

// adding varient of products
export const addProductInfo = async (req, res) => {
  const productId = req.body.productId;
  const product = await Product.findOne({ productId: productId });
  if (!product) {
    return res.status(404).json("product not found!");
  }
  let slug = "";
  if (req.body.title) {
    slug = slugify(req.body.title);
  }

  const newProductInfo = new ProductInfo(req.body);
  try {
    newProductInfo.slug = slug;
    const savedProductInfo = await newProductInfo.save();
    return res.status(200).json(savedProductInfo);
  } catch (error) {
    return res.status(500).json(error);
  }
}

// getting product varients using productId
export const getProductVarients = async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findOne({ productId: productId });
  if (!product) {
    return res.status(404).json("Product not found!");
  }

  try {
    const varients = await ProductInfo.find({ productId: productId });
    return res.status(200).json(varients);
  } catch (error) {
    return res.status(500).json(error);
  }
}

// getting other varients of sameproduct but with other color
export const getOtherVarients = async (req, res) => {
  const productId = req.params.id;
  const color = req.body.color;
  const product = await Product.findOne({ productId: productId });
  if (!product) {
    return res.status(404).json("Porduct not found!");
  }

  try {
    const otherVarients = await ProductInfo.find({
      productId: productId,
      color: { $ne: color },
    });

    return res.status(200).json(otherVarients);
  } catch (error) {
    return res.status(500).json(error);
  }
}

// gettign sizes of product with same color and product id
export const getProductSizes = async (req, res) => {
  const productId = req.params.productId;
  const color = req.body.color;

  const product = await Product.findOne({ productId: productId });
  if (!product) {
    return res.status(404).json("Product not found!");
  }

  try {
    const sizes = await ProductInfo.find({
      productId: productId,
      color: color,
    });
    return res.status(200).json(sizes);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const getOtherColors = async (req, res) => {
  const productId = req.params.id;
  const color = req.body.color;
  const product = await Product.findOne({ productId: productId });
  if (!product) {
    return res.status(404).json("Product not found!");
  }
  try {
    const otherVairents = await ProductInfo.find({
      productId: productId,
      color: { $ne: color },
    });
    return res.status(200).json(otherVairents);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    for (let product of products) {
      const productInfo = await ProductInfo.findOne({
        productId: product.productId,
        isDefault: true,
      });
      Object.assign(product, { varient: productInfo });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const getSimilarProducts = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json(error);
  }
}

// v2 new get products
export const V2getProductsList = async (req, res) => {
  try {
    let products = await Product.find({});
    let productsList = [];
    for (const product of products) {
      const defaultVarient = await ProductInfo.findOne({
        productId: product.productId,
        isDefault: true,
      });
      const brandInfo = await Brand.findById(product.brand);
      const productWithVariant = {
        ...product.toObject(),
        defaultVarient,
        brandInfo,
      };
      productsList.push(productWithVariant);
    }
    return res.status(200).json(productsList);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const V2SimilarProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.find({ productId: productId });
    if (!product) {
      return res.status(404).json("Product not found!");
    }

    const productVarients = await ProductInfo.find({ productId: productId });
    return res.status(200).json(productVarients);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const V2YouMayAlsoLike = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({ productId: productId });
    if (!product) {
      return res.status(404).json("Product not found!");
    }

    const color = req.query.color;
    const varients = await ProductInfo.find({
      productId: productId,
      color: { $ne: color },
      isDefault: true,
    });

    return res.status(200).json({ product: product, varients: varients });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const getProductInfo = async (req, res) => {
  const productId = req.body.productId;
  const color = req.body.color;
  const size = req.body.size;

  try {
    const productInfo = await ProductInfo.findOne({
      productId: productId,
      color: color,
      size: size,
    });

    if (!productInfo) {
      return res.status(404).json("Product not available!");
    }

    return res.status(200).json(productInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const categoryPipeline = [
  {
    $unwind: "$category",
  },
  {
    $group: {
      _id: "$category",
      count: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      category: "$_id",
      count: 1,
    },
  },
];

const brandPipeline = [
  {
    $group: {
      _id: "$brand",
      count: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      brand: "$_id",
      count: 1,
    },
  },
];

const colorPipeline = [
  {
    $group: {
      _id: { color: "$color", productId: "$productId" },
    },
  },
  {
    $group: {
      _id: "$_id.color",
      count: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      color: "$_id",
      count: 1,
    },
  },
];


// products filters api
export const getProductFilters = async (req, res) => {
  try {
    // gender TODO for category and brand
    let genders = [];
    for (let key in ProductGenderEnum) {
      genders.push(key)
    }

    const categories = await Product.aggregate(categoryPipeline);
    const brands = await Product.aggregate(brandPipeline);
    const colors = await ProductInfo.aggregate(colorPipeline);

    for (let category of categories) {
      const categoryInfo = await Category.findById(category.category).select(
        "name"
      );
      Object.assign(category, { category: categoryInfo });
    }

    for (let brand of brands) {
      const brandInfo = await Brand.findById(brand.brand).select("name");
      Object.assign(brand, { brand: brandInfo });
    }

    const result = {
      genders: genders,
      categories: categories,
      brands: brands,
      colors: colors,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const sortBasedOnSortingOption = (products, sortingOption) => {
  if (!sortingOption) return products;
  console.log(sortingOption)
  switch (sortingOption) {
    case Object.keys(sortingOptions).find(key => sortingOptions[key] === sortingOptions.PriceHighToLow):
      products.sort((a, b) => b.discountPrice - a.discountPrice);
      break;
    case Object.keys(sortingOptions).find(key => sortingOptions[key] === sortingOptions.PriceLowToHigh):
      products.sort((a, b) => a.discountPrice - b.discountPrice)
    default:
      console.log("default case")
  }

  return products;
}

// main products list api
export const getProductsUsingFilters = async (req, res) => {
  // supposing gender will always be single 
  let { categories, brands, colors, gender, sortingOption } = req.body;
  if (!sortingOption) {
    sortingOption = sortingOptions.Recommended;
  }


  let pipeline = [];

  if (brands && brands.length > 0) {
    const brandIds = brands.map((id) => {
      return new ObjectId(id);
    });

    pipeline.push({
      $match: {
        brand: { $in: brandIds },
      },
    });
  }

  if (gender) {
    gender = ProductGenderEnum[gender.toUpperCase()];
    pipeline.push({
      $match: {
        gender: gender,
      },
    });
  }

  if (categories && categories.length > 0) {
    pipeline.push({
      $match: {
        category: { $in: categories },
      },
    });
  }

  console.log(pipeline[0])

  try {
    let result = [];
    let response = [];
    if (pipeline.length > 0) {
      result = await Product.aggregate(pipeline);
    } else {
      result = await Product.find({});
    }

    if (colors && colors.length > 0) {
      // if colors then finding varients satisfy colors field
      for (let product of result) {
        const productVarient = await ProductInfo.find({
          color: { $in: colors },
          isDefault: true,
          productId: product.productId,
        });

        for (let varient of productVarient) {
          response.push(varient);
        }
      }
      if (response.length > 0) {
        result = response;
      } else {
        result = [];
      }
    } else {
      // finding the top varients -> currently 0 index
      for (let product of result) {
        const productVarient = await ProductInfo.find({
          productId: product.productId,
          isDefault: true,
        });
        for (let varient of productVarient) {
          response.push(varient);
        }
      }
      result = response;
    }

    if (sortingOption) {
      result = sortBasedOnSortingOption(result, sortingOption);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const homeSearch = async (req, res) => {
  try {
    const searchToken = req.query.query;
    const searchRes = await searchResponse(searchToken);
    return res.status(200).json(searchRes)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
