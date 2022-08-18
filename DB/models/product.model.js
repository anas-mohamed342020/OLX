const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    product_title: {
      type: String,
      required: true,
    },
    Product_desc: {
      type: String,
      required: true,
    },
    Product_price: {
      type: Number,
      required: true,
    },
    Likes: [{
      type: mongoose.Types.ObjectId,
      ref: "User",
    }],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    Hidden: {
      type: Boolean,
      default: false,
    },
    Comments: [{
      type:mongoose.Types.ObjectId,
      ref:"Comment"
    }],
    imgs:[{
      type:String
    }]
  },
  {
    timeStamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema);
module.exports = { productModel };
