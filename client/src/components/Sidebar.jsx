import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = search
    ? users.filter(user => user.fullName.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <div className="bg-[#8185B2]/10 h-full p-5 overflow-y-auto text-white">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <img src={assets.logo} alt="Logo" className="max-w-40" />
        <div className="relative group">
          <img src={assets.menu_icon} alt="Menu" className="max-h-5 cursor-pointer" />
          <div className="absolute top-full right-0 hidden group-hover:block z-20 w-32 p-3 rounded-md bg-[#282142] border border-gray-600 text-gray-100">
            <p onClick={() => navigate('/profile')} className="cursor-pointer text-sm">Edit Profile</p>
            <hr className="my-2 border-t border-gray-500" />
            <p onClick={() => logout()} className="cursor-pointer text-sm">Logout</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mb-5">
        <img src={assets.search_icon} alt="Search" className="w-3" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search User..."
          className="flex-1 bg-transparent border-none outline-none text-white text-xs placeholder-gray-400"
        />
      </div>

      {/* User List */}
      <div className="flex flex-col gap-2">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }));
            }}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer ${
              selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''
            }`}
          >
            <img src={user.profilePic || assets.avatar_icon} alt="" className="w-[35px] aspect-[1/1] rounded-full" />
            <div className="flex flex-col leading-5">
              <p className="text-sm">{user.fullName}</p>
              <span className={`text-xs ${onlineUsers.includes(user._id) ? 'text-green-400' : 'text-gray-400'}`}>
                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </span>
            </div>
            {unseenMessages?.[user._id] > 0 && (
              <p className="absolute top-2 right-2 h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 text-xs">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
