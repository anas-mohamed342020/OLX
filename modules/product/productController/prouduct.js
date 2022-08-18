const { productModel } = require("../../../DB/models/product.model");
const { catchError } = require("../../../utils/catchError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const path = require("path");
const fs = require("fs");
const { getIo } = require("../../../services/socket");
const { userModel } = require("../../../DB/models/user.model");
const addProduct = async (req, res) => {
  try {
    if (req.multerError) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "invalid picture type", type: req.type });
    } else {
      const { product_title, Product_desc, Product_price } = req.body;
      const createdBy = req.user._id;
      let addedProduct;
      if (req.files) {
        const imgs = [];
        req.files.forEach((ele) => {
          imgs.push(ele.filename);
        });
        addedProduct = await productModel.insertMany({
          product_title,
          Product_desc,
          Product_price,
          createdBy,
          imgs,
        });
      } else {
        addedProduct = await productModel.insertMany({
          product_title,
          Product_desc,
          Product_price,
          createdBy,
        });
      }
      const user = await userModel.findById(req.user._id).select("socketId");

      getIo().except(user.socketId).emit(addedProduct.addProduct, [saved]);

      res.json({ message: "Done", addedProduct });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const upateProduct = async (req, res) => {
  try {
    const { product_title, Product_desc, Product_price } = req.body;
    const { _id, role } = req.user;
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (product) {
      if (_id.toString() == product.createdBy.toString()) {
        await productModel.updateOne(
          { _id: id },
          { product_title, Product_desc, Product_price }
        );
        res
          .status(StatusCodes.ACCEPTED)
          .json({ message: "Done", status: ReasonPhrases.ACCEPTED });
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "You are UN authorized to do that",
          status: ReasonPhrases.UNAUTHORIZED,
        });
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "product not found",
        status: ReasonPhrases.NOT_FOUND,
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { _id, role, email } = req.user;
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (product) {
      if (_id.toString() == product.createdBy.toString() || role == "admin") {
        await productModel.deleteOne({ _id: id });
        if (product.imgs.length) {
          product.imgs.forEach((ele) => {
            let dest = path.join(
              __dirname,
              `../../../uploads/${email}/product_imgs/${ele}`
            );
            console.log(dest);
            fs.unlinkSync(dest);
          });
        }
        res
          .status(StatusCodes.ACCEPTED)
          .json({ message: "Done", status: ReasonPhrases.ACCEPTED });
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "You are UN authorized to do that",
          status: ReasonPhrases.UNAUTHORIZED,
        });
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "product not found",
        status: ReasonPhrases.NOT_FOUND,
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};
const softDelete = async (req, res) => {
  const { id } = req.params;
  const product = await productModel.findOneIdAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (product) {
    res
      .status(StatusCodes.ACCEPTED)
      .json({ message: "Done", status: ReasonPhrases });
  }
};

const HideProduct = async (req, res) => {
  try {
    const product = await productModel.findOneAndUpdate(
      {
        _id: req.body._id,
      },
      {
        Hidden: true,
      },
      {
        new: true,
      }
    );
    res.status(StatusCodes.OK).json({ message: "Done" });
  } catch (error) {
    catchError(res, error);
  }
};

const likeProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await productModel.findById(_id);

    if (!product || product.IsDeleted || product.Hidden) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found" });
    }
    let user = req.user._id;
    if (product.CreatedBy.toString() == user.toString()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: `You can't like your own product` });
    }

    if (product.Likes.includes(user)) {
      //كده هو عامل هشيله

      let likes = product.Likes.filter((ele) => {
        return ele != user;
      });
      const like = await productModel.updateOne({ _id }, { likes });
      res.status(201).json({ message: "dislike", status: 201, like });
    } else {
      //كده مش عامل هضيفه
      product.Likes.push(user);
      const like = await productModel.updateOne({ _id }, { likes: product.likes });
      res.status(201).json({ message: "liked", status: 201, like });
    }

  } catch (error) {
    catchError(res, error);
  }
};
module.exports = {
  addProduct,
  upateProduct,
  deleteProduct,
  softDelete,
  HideProduct,
  likeProduct,
};

/*
const name = async(req,res)=>{
    try {
        
    } catch (error) {
        catchError(res,error)
    }
}

*/
