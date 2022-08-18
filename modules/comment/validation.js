const joi = require('joi')


const addCommentValidation = {
    body: joi
      .object()
      .required()
      .keys({
        comment_body: joi.string().required(),
        Product_id: joi
          .string()
          .max(24)
          .min(24)
          .required()
      })
  }
  const addReplyValidation = {
    body: joi
      .object()
      .required()
      .keys({
        comment_body: joi.string().required(),
        Comment_id: joi
          .string()
          .max(24)
          .min(24)
          .required()
      })
  }
  

 const updateCommentValidation = {
    body: joi
      .object()
      .required()
      .keys({
        comment_body:joi.string().required(),
        _id: joi
          .string()
          .max(24)
          .min(24)
          .required()
      })
  }
  
 const deleteCommentValidation = {
    body: joi
      .object()
      .required()
      .keys({
        _id: joi
          .string()
          .max(24)
          .min(24)
          .required()
      })
  }
const  likeCommentValidation = {
    params: joi
      .object()
      .required()
      .keys({
        _id: joi
          .string()
          .max(24)
          .min(24)
          .required()
      })
  }
  
  module.exports = {addCommentValidation,addReplyValidation,updateCommentValidation,deleteCommentValidation,likeCommentValidation}