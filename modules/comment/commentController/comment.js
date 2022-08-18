const { commentModel } = require("../../../DB/models/comment,model");
const { productModel } = require("../../../DB/models/product.model");
const { userModel } = require("../../../DB/models/user.model");
const { getIo } = require("../../../services/socket");
const { catchError } = require("../../../utils/catchError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const add_Comment = async (req, res) => {
  try {
    const { comment_body, Product_id } = req.body;
    const product = await productModel.findOne({
      _id: Product_id,
      IsDeleted: false,
      Hidden: false,
    });
    if (product) {
      const comment = new commentModel({
        comment_body,
        Product_id,
        comment_By: req.user._id,
      });
      const saved = await comment.save();
      await productModel.findOneAndUpdate(
        { _id: product._id },
        {
          $push: {
            Comments: saved._id,
          },
        },
        { new: true }
      );
      const user = await userModel.findById(req.user._id).select("socketId");
      getIo().except(user.socketId).emit(socketEvents.addComment, [saved]);
      res.status(StatusCodes.CREATED).json({ message: "Done" });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ message: "product not found" });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const add_Reply = async (req, res) => {
  try {
    const { comment_body, Comment_id } = req.body;
    const newcomment = new commentModel({
      comment_body,
      Comment_id,
      comment_By: req.user._id,
    });
    const saved = await newcomment.save();
    await commentModel.findOneAndUpdate(
      { _id: Comment_id },
      {
        $push: {
          Replies: saved._id,
        },
      },
      { new: true }
    );
    const user = await userModel.findById(req.user._id).select("socketId");
    console.log(socketUser);
    getIo().except(user.socketId).emit(socketEvents.addReply, [saved]);
    res.status(StatusCodes.CREATED).json({ message: "Done" });
  } catch (error) {
    catchError(res, error);
  }
};

const Update_Comment = async (req, res) => {
  try {
    const { comment_body, _id } = req.body;
    const comment = await commentModel.findOneAndUpdate(
      { _id, comment_By: req.user._id },
      {
        comment_body,
      },
      { new: true }
    );
    if (comment) {
      getIo().emit(socketEvents.updateComment, [comment]);
      res.status(StatusCodes.CREATED).json({ message: "Done" });
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Comment not found" });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const deleteComent = async (req, res) => {
  try {
    if (req.user.role == "admin") {
      await productModel.findOneAndUpdate(
        { _id: comment.Product_id },
        {
          $pull: {
            Comments: comment._id,
          },
        },
        { new: true }
      );
      await commentModel.deleteOne({ _id: req.body._id });
      res.status(StatusCodes.OK).json({ message: "Done" });
    } else if (req.user.role == "User") {
      const comment = await CommModel.findOne({
        _id: req.body._id,
        comment_By: req.user._id,
      });
      if (comment) {
        await productModel.findOneAndUpdate(
          { _id: comment.Product_id },
          {
            $pull: {
              Comments: comment._id,
            },
          },
          { new: true }
        );
        await commentModel.deleteOne({ _id: req.body._id });
        res.status(StatusCodes.OK).json({ message: "Done" });
      } else {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized user" });
      }
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You are not authorized to do that" });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const likeCommment = async (req, res) => {
    try {
      const { _id } = req.params
      const Comment = await CommModel.findById(_id)
  
      if (!Comment) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Comment not found' }) 
      }
      let user = req.user._id
      if (Comment.comment_By.toString() === user.toString()) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'You cannot like your own comment' })
      }
  
      if (product.Likes.includes(user)) {
        //كده هو عامل هشيله
  
        let likes = Comment.Likes.filter((ele) => {
          return ele != user;
        });
        const like = await commentModel.updateOne({ _id }, { likes });
        res.status(201).json({ message: "dislike", status: 201, like });
      } else {
        Comment.Likes.push(user);
        const like = await commentModel.updateOne({ _id }, { likes: Comment.likes });
        res.status(201).json({ message: "liked", status: 201, like });
      }
  
    } catch (error) {
      catchError(res, error)
    }
  }
module.exports = { add_Comment, add_Reply, Update_Comment,deleteComent,likeCommment };
