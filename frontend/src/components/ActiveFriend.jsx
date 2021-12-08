import React from 'react'

const ActiveFriend = ({user,setCurrentFriend}) => {
    return (
        <div onClick={()=>setCurrentFriend({
            _id : user.userInfo.id,
            email : user.userInfo.email,
            image : user.userInfo.image,
            userName : user.userInfo.userName
        })} className="active-friend">
            <div className="image-active-icon">
                <div className="image">
                    <img src={`./image/${user.userInfo.image}`} alt=""/>
                    <div className="active-icon"></div>
                </div>
            </div>
        </div>
    )
}

export default ActiveFriend
