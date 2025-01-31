import { sortingOptions } from "../utils/utils.js";

export async function getSortingOptions(req, res) {
  try {
    const sortingOptionsArray = Object.entries(sortingOptions).map(([key, value]) => ({ key, value }));

    return res.status(200).json(sortingOptionsArray);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error while fetching sorting options!")
  }
}