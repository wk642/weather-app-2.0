import React from 'react';

export default function DisplayUsers({ users }) {
  
  return (
    <div>
      <h4> Click to see other's favorite cities </h4>
      <ul className="user-list">
      {users.map((user) => (
        <li key={user.id} className="user-contact">
          <strong>{user.user_name}</strong>
        </li>
      ))}  
      </ul>
    </div>
  );
}