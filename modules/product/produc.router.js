const { auth } = require('../../midlewear/auth')
const { validation } = require('../../midlewear/validation')
const { multerFunction } = require('../../multer/multer')
const { addProduct, upateProduct, deleteProduct, softDelete, HideProduct, likeProduct } = require('./productController/prouduct')
const { addProductValidation, updateProductValidation, deleteProductValidation, HideProductValidator, LikeProductValidator } = require('./validation')

const router = require('express').Router()










router.post('/addproduct',validation(addProductValidation),auth(),multerFunction('product_imgs').array('images',5),validation(addProductValidation),addProduct)
router.patch('/update-product/:id',validation(updateProductValidation),auth(),upateProduct)
router.delete('/delete-product/:id',validation(deleteProductValidation),auth(),deleteProduct)
router.patch('/softdelete-product',softDelete)
router.patch('/hide-product',validation(HideProductValidator),auth(),HideProduct)
router.patch('/like-unlike-product',validation(LikeProductValidator),auth(),likeProduct)





module.exports = router