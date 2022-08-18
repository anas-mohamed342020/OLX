const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto-js");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    profilePic: [String]
    ,
    coverPics: [String],
    role: {
      type: String,
      default: "user",
    },
    Qr_code:{
      type:String
    },
    Blocked:{
      type:Boolean,
      default:false
    },
    wishList:[{type:mongoose.Types.ObjectId,ref:'user'}],
    changePassCode:{
      type:String
    },
    online:{
      type:Boolean,
      default:false
    },
    lastSeen:{
      type:String,
    },
    socketId:{ type: String, default: '' }

  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  console.log(this);
  this.password =await bcrypt.hash(this.password, Number(process.env.SALT));
  if (this.phone) {
    this.phone = crypto.AES.encrypt(this.phone, process.env.encr);
  }
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = { userModel };
