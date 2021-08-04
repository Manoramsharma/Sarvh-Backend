const express = require('express')

const router = express.Router()

const { addCategory, getCategories } = require('../controllers/category')
// const {  adminMiddleware } = require('../middlewares/isAuthenticated')


router.post('/category/create' /*, isUserAuthenticated, adminMiddleware */,addCategory)
router.get('/category/getcategory', getCategories)


module.exports = router;