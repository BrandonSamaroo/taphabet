import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

function MainMenu() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");

  const handleUserNameChange = (event: any) => {
    setUserName(event.target.value);
  };

  const [roomCode, setRoomCode] = useState("");

  const handleRoomCodeChange = (event: any) => {
    setRoomCode(event.target.value);
  };

  const handleJoinRoomClick = (event: any) => {
    console.log(roomCode);
  };

  const handleCreateRoomClick = (event: any) => {
    navigate("/create-room", { state: { userName: userName } });
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='mx-auto mt-10 mb-10'>
          header image
        </div>
        
        <div className='mx-auto'>
          <div className='flex flex-col w-96 h-96'>
            <input 
              type="text" 
              value={userName} 
              onChange={handleUserNameChange} 
              placeholder="Enter User" 
            />

            <div className='flex'>
              <input 
                type="text" 
                value={roomCode} 
                onChange={handleRoomCodeChange} 
                placeholder="Enter Room Code" 
                className='w-full'
              />
              <button className='w-full' onClick={handleJoinRoomClick}>Join Room</button>
            </div>

            <div className='flex'>
              <button className="cursor-pointer w-full" onClick={handleCreateRoomClick}>Create Room</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainMenu
