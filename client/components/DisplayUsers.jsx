import React, { useState } from 'react';
import { InfoCircledIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

function DisplayUsers({ users, onDeleteUser, onEditUser, onUserInfo }) {
  const [hoveredUserId, setHoveredUserId] = useState(null);

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
                  <TrashIcon onClick={() => onDeleteUser(user.id)} />
                  <Pencil1Icon onClick={() => onEditUser(user)} />
                  <InfoCircledIcon onClick={() => onUserInfo(user)} />
                </div>
              ) : (
                // Displaying only the first letter of the name
                user.user_name.charAt(0).toUpperCase()
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayUsers;