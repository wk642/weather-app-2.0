import React, { useState } from 'react';
import { InfoCircledIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

function DisplayUsers({ users, handleDeleteUser, handleEditUser }) {
  // states
  const [hoveredUserId, setHoveredUserId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [userInfo, setUserInfo] = useState(null);


  // needed a reminder how this work
  // For enter
  // https://www.w3schools.com/jsref/event_onmouseenter.asp
  const handleMouseEnter = (userId) => {
    setHoveredUserId(userId);
  };

  // For Leave
  // https://www.w3schools.com/jsref/event_onmouseleave.asp
  const handleMouseLeave = () => {
    setHoveredUserId(null);
  };

  // edit 
  const handleEditClick = (user) => {
    setEditUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSaveClick = () => {
    handleEditUser(editedUser); 
    setEditUserId(null); 
  };

  // info
  const handleInfoClick = (user) => {
    setUserInfo(user);
  };

  const handleCloseInfo = () => {
    setUserInfo(null);
  };



  return (
    <div className="users-container">
      <h2>What other users like</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li
            key={user.id}
            className="user-item"
            onMouseEnter={() => handleMouseEnter(user.id)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="user-circle">
              {hoveredUserId === user.id ? (
                <div className="user-icons">
                  <TrashIcon onClick={() => handleDeleteUser(user.id)} />
                  <Pencil1Icon onClick={() => handleEditClick(user)} />
                  <InfoCircledIcon onClick={() => handleInfoClick(user)} />
                </div>
              ) : (
                user.user_name.charAt(0).toUpperCase()
              )}
            </div>
            {editUserId === user.id && (
              <div className="edit-form">
                <input type="text" name="user_name" value={editedUser.user_name} onChange={handleInputChange} placeholder="Name" />
                <input type="text" name="email" value={editedUser.email} onChange={handleInputChange} placeholder="Email" />
                <input type="text" name="favorite_city" value={editedUser.favorite_city} onChange={handleInputChange} placeholder="Favorite City" />
                <button onClick={handleSaveClick}>Save</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {userInfo && (
        <div className="user-info-modal">
          <div className="user-info-content">
            <h3>{userInfo.user_name}</h3>
            <p>Favorite Location: {userInfo.favorite_city}</p>
            <button onClick={handleCloseInfo}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayUsers;