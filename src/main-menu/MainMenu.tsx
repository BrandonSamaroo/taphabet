import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import TaphabetLogo from '../assets/taphabet_logo.png';

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
    navigate(`/play/${roomCode}`, { state: { userName: userName, role: "user" } });
  };

  const handleCreateRoomClick = (event: any) => {
    navigate("/create-room", { state: { userName: userName } });
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='w-full flex justify-center mt-2'>
          <img src={TaphabetLogo} alt="Taphabet Logo" className='h-36' />
        </div>
        
        <div className='mx-auto mt-10'>
          <div className='flex flex-col w-96 h-96'>
            <input 
              type="text" 
              value={userName} 
              onChange={handleUserNameChange} 
              placeholder="Enter User" 
              className='mb-4 p-2 border border-gray-300 rounded'
            />

            <div className='flex mb-4'>
              <input 
                type="text" 
                value={roomCode} 
                onChange={handleRoomCodeChange} 
                placeholder="Enter Room Code" 
                className='w-full p-2 border border-gray-300 rounded-l'
              />
              <button 
                className='w-full p-2 bg-blue-500 text-white rounded-r hover:bg-blue-700' 
                onClick={handleJoinRoomClick}
                disabled={roomCode === ""}
              >
                Join Room
              </button>
            </div>

            <div className='flex'>
              <button 
                className="cursor-pointer w-full p-2 bg-green-500 text-white rounded hover:bg-green-700" 
                onClick={handleCreateRoomClick}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainMenu
