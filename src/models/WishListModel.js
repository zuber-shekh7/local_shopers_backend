import mongoose from "mongoose";

const WistListSchema = mongoose.Schema(
  {
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("WishList", WistListSchema);
