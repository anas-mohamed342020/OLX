const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    comment_body: {
      type: String,
      required: true,
    },
    comment_By: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Product_id: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    }, 

    Replies: {
      type: [mongoose.Types.ObjectId],
      ref: "Comment",
    },
  },
  {
    timeStamps: true,
  }
);

const commentModel = mongoose.model("Comment", commentSchema);
module.exports = { commentModel };
