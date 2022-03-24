import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = mongoose.Schema(
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
    wishList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WishList",
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

UserSchema.methods.authenticate = async function (password) {
  return await bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWTToken = async function () {
  return jwt.sign({ id: this._id }, process.env.SECRET, {
    expiresIn: "30d",
  });
};

UserSchema.methods.generateForgotPasswordToken = function () {
  const token = crypto.randomBytes(30).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  this.forgotPasswordToken = hashedToken;
  this.forgotPasswordTokenExpiry = new Date(
    Date.now() + 1 * 24 * 60 * 60 * 1000
  );
  return token;
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashPassword = await bcrypt.hashSync(this.password, 10);
    this.password = hashPassword;
  }
  return next();
});

export default mongoose.model("User", UserSchema);
