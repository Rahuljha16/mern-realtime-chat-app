import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import { ChatContext } from '../../context/ChatContext';

const Homepage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="flex h-screen bg-[#1E1E2F]">
      
      {/* Left Sidebar: User list */}
      <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
        <Sidebar />
      </div>

      {/* Right Chat Area */}
      <div className="w-2/3 flex flex-col overflow-hidden">
        <ChatContainer selectedUser={selectedUser} />
      </div>

    </div>
  );
};

export default Homepage;
