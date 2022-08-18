const joi = require("joi");

const addProductValidation = {
  // body: joi
  //   .object()
  //   .required()
  //   .keys({
  //     product_title: joi
  //       .string()
  //       .required()
  //       .pattern(RegExp("^[a-zA-Z0-9_.]*$")),
  //     Product_desc: joi.string().required(),
  //     Product_price: joi.string().required(),
  //   }),
  // params: joi.object().required().keys({}),
  // query: joi.object().required().keys({}),
  // headers: joi
  //   .object()
  //   .required()
  //   .keys({
  //     authorization: joi.string().required(),
  //   })
  //   .options({ allowUnknown: true }),
};





const updateProductValidation = {
  body: joi
    .object()
    .required()
    .keys({
      product_title: joi
        .string()
        .required()
        .pattern(RegExp("^[a-zA-Z0-9_.]*$")),
      Product_desc: joi.string().required(),
      Product_price: joi.string().required(),
    }),
  params: joi.object().required().keys({
    id:joi.string().length(24).required()
  }),
  query: joi.object().required().keys({}),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};




const deleteProductValidation = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({
    id:joi.string().length(24).required()
  }),
  query: joi.object().required().keys({}),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};





const HideProductValidator = {
  body: joi
    .object()
    .required()
    .keys({
      _id:joi.string().max(24).min(24).required()
    })
}




const LikeProductValidator = {
  params: joi
    .object()
    .required()
    .keys({
      _id:joi.string().max(24).min(24).required()
    })
}




module.exports = {addProductValidation,updateProductValidation,deleteProductValidation,HideProductValidator,LikeProductValidator}
/*


const softDeleteSchema = {
  body:joi.object().required().keys({}),
  params:joi.object().required().keys({}),
  query:joi.object().required().keys({}),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
}


*/
