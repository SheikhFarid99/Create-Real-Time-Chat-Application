import { FRIENDS_GET_SUCCESS,MESSAGE_GET_SUCCESS,MESSAGE_SEND_SUCCESS,UPDATE_FRIEND_MESSAGE,MESSAGE_SEND_SUCCESS_CLEAR,SEEN_MESSAGE,DELIVARED_MESSAGE,UPDATE,MESSAGE_GET_SUCCESS_CLEAR} from "../types/messengerType";
const messengerState = {
    friends : [],
    message : [],
    messageSendSuccess : false,
    message_get_success : false,
    themeMood : '',
    new_user_add : ''
}

export const messengerReducer = (state=messengerState , action) =>{
    const {type,payload} = action;
    if(type === 'THEME_GET_SUCCESS' || type === 'THEME_SET_SUCCESS'){
        return {
            ...state,
            themeMood : payload.theme
        }
    }
    if(type === FRIENDS_GET_SUCCESS){
        return {
            ...state,
            friends : payload.friends
        }
    }
    if(type === MESSAGE_GET_SUCCESS){
        return {
            ...state,
            message_get_success : true,
            message : payload.message
        }
    }
    if(type === MESSAGE_SEND_SUCCESS){
        return {
            ...state,
            messageSendSuccess : true,
            message : [...state.message,payload.message]
        }
    }
    if(type === 'SOCKET_MESSAGE'){
        return {
            ...state,
            message : [...state.message,payload.message]
        }
    }
    if(type === UPDATE_FRIEND_MESSAGE){
        const index = state.friends.findIndex(f=>f.fndInfo._id === payload.msgInfo.reseverId || f.fndInfo._id === payload.msgInfo.senderId );
        state.friends[index].msgInfo = payload.msgInfo;
        state.friends[index].msgInfo.status = payload.status;
        return state;

    }
    if(type === MESSAGE_SEND_SUCCESS_CLEAR){
        return {
            ...state,
            messageSendSuccess : false
        }
    }
    if(type === SEEN_MESSAGE){
        const index = state.friends.findIndex(f=>f.fndInfo._id === payload.msgInfo.reseverId || f.fndInfo._id === payload.msgInfo.senderId );
        state.friends[index].msgInfo.status = 'seen';
        return {
            ...state
        };
    }
    if(type === DELIVARED_MESSAGE){
        const index = state.friends.findIndex(f=>f.fndInfo._id === payload.msgInfo.reseverId || f.fndInfo._id === payload.msgInfo.senderId );
        state.friends[index].msgInfo.status = 'delivared';
        return {
            ...state
        };
    }
    if(type === UPDATE){
        const index = state.friends.findIndex(f=>f.fndInfo._id === payload.id);
        if(state.friends[index].msgInfo){
            state.friends[index].msgInfo.status = 'seen';
        }
        return {
            ...state
        }
    }
    if(type === MESSAGE_GET_SUCCESS_CLEAR){
        return {
            ...state,
            message_get_success : false
        }
    }
    if(type === 'SEEN_ALL'){
        const index = state.friends.findIndex(f=>f.fndInfo._id === payload.reseverId);
        state.friends[index].msgInfo.status = 'seen';
        return {
            ...state
        }
    }
    if(type === 'LOGOUT_SUCCESS'){
        return{
            ...state,
            friends : [],
            message : [],
            messageSendSuccess : false,
            message_get_success : false,
        }
    }
    if(type === 'NEW_USER_ADD'){
        return{
            ...state,
            new_user_add : payload.new_user_add
        }
    }
    if(type === 'NEW_USER_ADD_CLEAR'){
        return {
            ...state,
            new_user_add : ''
        }
    }
    return state; 
}