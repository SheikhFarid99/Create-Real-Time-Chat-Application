const {model,Schema} = require('mongoose');

const messageSchema = new Schema ({
    senderId : {
        type : String,
        required : true
    },
    senderName : {
        type : String,
        required : true
    },
    reseverId : {
        type : String,
        required : true
    },
    message : {
        text : {
            type : String,
            default : ''
        },
        image : {
            type : String,
            default : ''
        }
    },
    status : {
        type : String,
        default : 'unseen'
    }
},{timestamps : true})

module.exports = model('message',messageSchema);