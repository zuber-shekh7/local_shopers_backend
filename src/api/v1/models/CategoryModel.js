import mongoose from "mongoose";

const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      key: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", CategorySchema);
