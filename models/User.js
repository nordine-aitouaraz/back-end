import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    id_user: { type: String, unique: true },
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    // DON'T return password by default
    password: { type: String, required: true, select: false, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    telephone: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

// set id_user from _id and hash password
UserSchema.pre("save", async function (next) {
  if (!this.id_user) this.id_user = this._id.toString();
  if (!this.isModified("password")) return next();
  const rounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
  const salt = await bcrypt.genSalt(rounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// instance method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // when password is selected=false, ensure password is loaded before calling
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;