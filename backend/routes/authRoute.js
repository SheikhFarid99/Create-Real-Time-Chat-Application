const router = require('express').Router();
const {userRegister} = require('../controller/authController')

router.post('/user-register',userRegister);


module.exports = router;
