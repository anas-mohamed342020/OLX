const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { userModel } = require("../../../DB/models/user.model");
const { sendEmail } = require("../../../services/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto-js");

const { nanoid } = require("nanoid");
const { catchError } = require("../../../utils/catchError");

const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "email already exist" });
    } else {
      let addUser = new userModel({
        firstName,
        lastName,
        email,
        password,
        phone,
      });
      addUser = await addUser.save();
      const subject = "E-mail confirmation";
      const text = "click to confirm";
      const to = addUser.email;
      const token = jwt.sign(
        {
          _id: addUser._id,
        },
        process.env.tokenKey
      );
      const html = `<p>click <a style="color: white;
      background-color: blue;
      padding: 6px;
      text-decoration: none;
      border-radius: 9px;" href="${req.protocol}://${req.headers.host}/confirm-email/${token}">here</a> to confirm your email</p>`;
      sendEmail(subject, text, to, html);
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Done", status: ReasonPhrases.CREATED });
    }
  } catch (ERROR) {
    catchError(res, ERROR);
  }
};

const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const userData = jwt.verify(token, process.env.tokenKey);
    const user = await userModel.findById(userData._id);
    if (user) {
      if (user.confirmed) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "this user already verified",
          status: ReasonPhrases.BAD_REQUEST,
        });
      } else {
        const verify = await userModel.updateOne(
          { _id: user._id },
          { confirmed: true }
        );
        res
          .status(StatusCodes.ACCEPTED)
          .json({ message: "Done", status: ReasonPhrases.CONTINUE });
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "user not found",
        status: ReasonPhrases.NOT_FOUND,
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      if (user.online) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            message: "Sorry this email is online now",
            status: ReasonPhrases.BAD_REQUEST,
          });
      } else {
        if (user.confirmed) {
          const isTruePass = await bcrypt.compare(password, user.password);
          if (isTruePass) {
            const userData = { _id: user._id };
            const token = jwt.sign(userData, process.env.tokenKey);
            await userModel.updateOne({ email }, { online: true });
            res.status(StatusCodes.ACCEPTED).json({
              message: "Welcome",
              token,
              status: ReasonPhrases.ACCEPTED,
            });
          } else {
            res.status(StatusCodes.FORBIDDEN).json({
              message: "in-valid email or password",
              status: ReasonPhrases.FORBIDDEN,
            });
          }
        } else {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "in-valid email or password",
            status: ReasonPhrases.FORBIDDEN,
          });
        }
      }
    } else {
      res.status(StatusCodes.FORBIDDEN).json({
        message: "please confirm your email",
        status: ReasonPhrases.FORBIDDEN,
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const update = async (req, res) => {
  try {
    const id = req.user._id;
    let { firstName, lastName, phone, email } = req.body;
    if (phone) {
      phone = crypto.AES.encrypt(phone, process.env.encr).toString();
    }
    if (email) {
      const subject = "confirm new email";
      const text = "click to confirm";
      const to = req.user.email;
      const token = jwt.sign(
        {
          _id: id,
        },
        process.env.tokenKey
      );
      const html = `<p>click <a style="color: white;
      background-color: blue;
      padding: 6px;
      text-decoration: none;
      border-radius: 9px;" href="${req.protocol}://${req.headers.host}/confirm-email/${token}">here</a> to confirm your email</p>`;
      sendEmail(subject, text, to, html);

      await userModel.findByIdAndUpdate(
        id,
        { firstName, lastName, phone, email, confirmed: false },
        { new: true }
      );
      res.status(StatusCodes.ACCEPTED).json({
        message: "Done... Please confirm your email",
        status: ReasonPhrases.ACCEPTED,
      });
    } else {
      await userModel.findByIdAndUpdate(
        id,
        { firstName, lastName, phone, email },
        { new: true }
      );
      res.status(StatusCodes.ACCEPTED).json({
        message: "Done",
        status: ReasonPhrases.ACCEPTED,
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);
    if (user) {
      res
        .status(StatusCodes.ACCEPTED)
        .json({ message: "Done", status: ReasonPhrases.ACCEPTED });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "user not found", status: ReasonPhrases.NOT_FOUND });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const softDelete = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await userModel.findByIdAndUpdate(id, { isDeleted: true });

    if (user) {
      res
        .status(StatusCodes.ACCEPTED)
        .json({ message: "Done", status: ReasonPhrases.ACCEPTED });
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "user not found", status: ReasonPhrases.NOT_FOUND });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const profilePic = async (req, res) => {
  try {
    if (req.multerError) {
      res.json({ message: "invalid picture type" });
    } else {
      const images = [];
      req.files.forEach((ele) => {
        images.push(ele.filename);
      });
      const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $push: { profilePic: [...images] } },
        { new: true }
      );
      res.json({ message: "Done", user });
    }
  } catch (error) {
    catchError(res, error);
  }
};
const coverPic = async (req, res) => {
  try {
    if (req.multerError) {
      res.json({ message: "invalid picture type" });
    } else {
      const images = [];
      req.files.forEach((ele) => {
        images.push(ele.filename);
      });

      const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $push: { coverPics: [...images] } },
        { new: true }
      );
      res.json({ message: "Done", user });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const showProfilePic = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await userModel.findById(id).select("profilePic -_id");

    user.profilePic = user.profilePic.map((ele) => {
      return `${req.protocol}://${req.headers.host}/uploads/${req.user.email}/profile/${ele}`;
    });
    res.json({ Pictures: user.profilePic });
  } catch (error) {
    catchError(res, error);
  }
};

const showCoverPic = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await userModel.findById(id).select("coverPics -_id");

    user.coverPics = user.coverPics.map((ele) => {
      return `${req.protocol}://${req.headers.host}/uploads/${req.user.email}/cover/${ele}`;
    });
    res.json({ Pictures: user.coverPics });
  } catch (error) {
    catchError(res, error);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const id = nanoid(6);
  const user = await userModel.findOneAndUpdate(
    { email },
    { changePassCode: id }
  );
  if (user) {
    const subject = "password reset";
    const text = "reset code";
    const to = user.email;
    const html = `<p>use this code  <p style="color: white;
      background-color: blue;
      padding: 6px;
      text-decoration: none;
      border-radius: 9px;">${id}</p> to to reset password </p>
      <h3>This code is only used once</h3>
      `;
    sendEmail(subject, text, to, html);
    res.status(StatusCodes.ACCEPTED).json({
      message: "Done... check your mail",
      status: ReasonPhrases.ACCEPTED,
    });
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ message: "user not found" });
  }
};

const changeForgetPass = async (req, res) => {
  try {
    let { email, key, password } = req.body;
    password = await bcrypt.hash(password, Number(process.env.SALT));
    const user = await userModel.findOneAndUpdate(
      { email, changePassCode: key },
      { password, changePassCode: nanoid(6) }
    );
    if (user) {
      res.status(StatusCodes.ACCEPTED).json({
        message: "Done",
        status: ReasonPhrases.ACCEPTED,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "in-valid email OR key",
        status: ReasonPhrases.BAD_REQUEST,
      });
    }
  } catch (error) {
    catchError(res, error);
  }
};

const signOut = async(req,res)=>{
  try {
    const id = req.user._id;
    await userModel.findByIdAndUpdate(id,{online:false,lastSeen:Date.now()})
    res.status(StatusCodes.ACCEPTED).json({message:"Done",status:ReasonPhrases.ACCEPTED})
  } catch (error) {
    catchError(res,error)
  }
}
const Update_password = async (req, res) => {
  try {
    const { old_password, new_password } = req.body
    const user = await userModel.findOne({ email: req.user.email })
    const match = bcrypt.compare(old_password, user.password)
    if (match) {
      const hashed = await bcrypt.hash(
        new_password,
        parseInt(process.env.SALT)
      )
      const user = await userModel.findOneAndUpdate(
        { email: req.user.email },
        { password: hashed },
        { new: true }
      )
      res.status(StatusCodes.OK).json({ message: 'Done' })
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'invalid email or password' })
    }
  } catch (error) {
    catchError(res, error)
  }
}

module.exports = {
  signUp,
  confirmEmail,
  signIn,
  update,
  deleteUser,
  softDelete,
  profilePic,
  coverPic,
  showProfilePic,
  showCoverPic,
  forgetPassword,
  changeForgetPass,
  Update_password,
  signOut
};
