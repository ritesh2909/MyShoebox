import mongoose from "mongoose";

const validateMongoDbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error("Invalid Request!");
  }
};

export { validateMongoDbId }
