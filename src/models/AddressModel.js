import mongoose from "mongoose";

const AddressSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    flatNo: {
      type: String,
      required: true,
      trim: true,
    },
    street: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },

    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Address", AddressSchema);
