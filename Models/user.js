const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto"); // Removed 'node:'
const { createTokenForUser ,validateToken} = require('../services/authentication')

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/public/images/103160_man_512x512.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString(); // Added parentheses
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
  // Changed 'static' to 'statics'
  const user = await this.findOne({ email }); // Added 'await'
  if (!user) throw new Error("User not found!");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password) // Changed 'user.password' to 'password'
    .digest("hex");
  if (hashedPassword !== userProvidedHash)
    throw new Error("Incorrect Password");
//   return { ...user.toObject(), password: undefined, salt: undefined }; // Changed '...user' to '...user.toObject()'

  const token = createTokenForUser(user)
  return token;
};

const User = model("User", userSchema); // Changed 'user' to 'User'
module.exports = User;
