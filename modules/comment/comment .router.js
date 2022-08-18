const { auth } = require("../../midlewear/auth");
const { validation } = require("../../midlewear/validation");
const { add_Comment, Update_Comment, deleteComent, likeCommment } = require("./commentController/comment");
const {
  addCommentValidation,
  addReplyValidation,
  updateCommentValidation,
  deleteCommentValidation,
  likeCommentValidation,
} = require("./validation");

const router = require("express").Router();

router.post("/add-comment",auth(),validation(addCommentValidation),add_Comment);

router.post("/add-Reply", auth(), validation(addReplyValidation), add_Comment);

router.patch("/update-comment",validation(updateCommentValidation),auth(),Update_Comment);

router.delete('/delete-comment',validation(deleteCommentValidation),auth(),deleteComent)

router.patch('/like-unlike-comment',validation(likeCommentValidation),auth(),likeCommment)




module.exports = router;
