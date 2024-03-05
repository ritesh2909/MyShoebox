const algoliasearch = require('algoliasearch')
const { Product, ProductGenderEnum } = require("../model/Product");
const { ProductInfo } = require("../model/ProductInfo");
const {Brand} = require("../model/Brand")
const { Category } = require("../model/Category");

const searchResponse = async (searchToken) => {
  const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY)
  const index = client.initIndex(process.env.ALGOLIA_INDEX);

  try {
    const products = await ProductInfo.find({isDefault: true});
    const brands = await Brand.find({});
    const categories = await Category.find({});
    let finalData = [];

    for(let i of products ){
      finalData.push({
        image: i.thumbnail,
        searchName: i.title,
        category: "Products"
      })
    }

    for(let i of brands) {
      finalData.push({
        image: i.logo,
        searchName: i.name,
        category: "Brands"
      })
    }

    for(let i of categories) {
      finalData.push({
        image: i.image,
        searchName: i.name,
        category: "Categories"

      })
    }

    // try {
    //   const res = await index.saveObjects(finalData,{ autoGenerateObjectIDIfNotExist: true });
    //   console.log(res)
    // } catch (error) {
    //   console.log(error)
    //   return error
    // }
    console.log("called")
    const searchRes = await index.search(searchToken);
    return searchRes;
  } catch (error) {
    return error
  }
}

module.exports = {searchResponse}