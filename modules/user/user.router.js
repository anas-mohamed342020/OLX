const { auth } = require('../../midlewear/auth')
const { validation } = require('../../midlewear/validation')
const { multerFunction } = require('../../multer/multer')
const { signUp, confirmEmail, signIn, update, deleteUser, softDelete ,profilePic, coverPic, showProfilePic, changeForgetPass, forgetPassword, showCoverPic, signOut, Update_password } = require('./controller/user')
const { endPoints } = require('./endPoints')
const { userSchema, confirmSchema, signInScema, updateSchema, deleteSchema, softDeleteSchema, changePassSend, changePass } = require('./user.validation')

const router = require('express').Router()




router.post('/signup',validation(userSchema),signUp)
router.get('/confirm-email/:token',validation(confirmSchema),confirmEmail)
router.post('/signin',validation(signInScema),signIn)
router.patch('/signout',validation(softDeleteSchema),auth(),signOut)

router.patch('/update',validation(updateSchema),auth(),update)
router.delete('/delete/:id',validation(deleteSchema),auth(endPoints.delete),deleteUser)
router.patch('/soft-delete',validation(softDeleteSchema),auth(),softDelete)
router.patch('/change-pass-send',validation(changePassSend),forgetPassword)
router.patch('/change-pass',validation(changePass),changeForgetPass)
router.patch('/update-password',validation(),auth(),Update_password)

router.patch('/profile-pic',auth(),multerFunction('profile').array('images',5),profilePic)
router.patch('/cover-pic',auth(),multerFunction('cover').array('images',5),coverPic)
router.get('/profile-pic-disp',auth(),showProfilePic)
router.get('/cover-pic-disp',auth(),showCoverPic)


module.exports = router 