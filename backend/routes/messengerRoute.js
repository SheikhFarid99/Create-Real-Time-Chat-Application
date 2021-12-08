const router = require('express').Router();
const {getFriends,messageUplodaDB,messageGet,ImageMessageSend,messageSeen,delivaredMessage,logout} = require('../controller/messengerController');
const {authMiddleware} = require('../middleware/authMiddleware');

router.get('/get-friends',authMiddleware,getFriends);
router.post('/send-message',authMiddleware,messageUplodaDB);
router.get('/get-message/:id',authMiddleware,messageGet);
router.post('/image-message-send',authMiddleware,ImageMessageSend);
router.post('/seen-message',authMiddleware,messageSeen);
router.post('/delivared-message',authMiddleware,delivaredMessage);
module.exports = router;
