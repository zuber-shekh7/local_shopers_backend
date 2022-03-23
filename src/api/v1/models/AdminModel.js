import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const AdminSchema = mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    mobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    profile: {
      firstName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      gender: {
        type: String,
        trim: true,
      },
      dob: {
        type: Date,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSuper: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.methods.authenticate = async function (password) {
  return await bcrypt.compareSync(password, this.password);
};

AdminSchema.methods.generateJWTToken = async function () {
  return jwt.sign({ id: this._id }, process.env.SECRET, {
    expiresIn: "30d",
  });
};

AdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashPassword = await bcrypt.hashSync(this.password, 10);
    this.password = hashPassword;
  }
  return next();
});

export default mongoose.model("Admin", AdminSchema);
