const Router = require('express')
const userController = require('../controller/userController')
const { requireUser } = require('../middleware/userMiddleware')
const router = Router()


router.get('/register', userController.register_get)
router.post('/register', userController.register_post)
router.get('/login', userController.login_get)
router.post('/login', userController.login_post)
router.get('/users', requireUser, userController.users_get)
router.get('/logout', userController.logout_get)

module.exports = router