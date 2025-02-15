import { useState } from 'react'
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import TaphabetLogo from '../assets/taphabet_logo.png';

function CreateRoom() {
  const navigate = useNavigate();

  const location = useLocation();
  const generateRandomName = () => `User${Math.floor(Math.random() * 10000)}`;
  const userName = location.state?.userName || generateRandomName();
  const timerPerAnswer = location.state?.timerPerAnswer || 9000;
  const oldCategory = location.state?.oldCategory || "";
  const oldLobbyType = location.state?.oldLobbyType || "";

  const [lobbyType, setLobbyType] = useState(oldLobbyType);
  const [category, setCategory] = useState(oldCategory);
  const [sliderValue, setSliderValue] = useState(timerPerAnswer);

  const handleCreateClick = async (event: any) => {
    const gameRoom = await createGameRoom();
    if (gameRoom) {
      navigate(`/play/${gameRoom.room_code}`, { state: { userName: userName, lobbyType: lobbyType, timerPerAnswer: sliderValue, category: category } });
    }
  };

  const createGameRoom = async () => {
    try {
      const response = await fetch("http://localhost:3000/game_rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host_name: userName,
          category: category,
          users: [userName],
          time_left: sliderValue,
          room_type: "Manual"
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create game room");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleTypingRoomClick = (event: any) => {
    setLobbyType("Typing")
  };

  const handleVoiceChatRoomClick = (event: any) => {
    setLobbyType("Voice")
  };

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value);
  };

  return (
    <>
      <div className='flex flex-col'>
        <div className='w-full flex justify-center mt-2'>
          <img src={TaphabetLogo} alt="Taphabet Logo" className='h-36' />
        </div>
        
        <div className='mx-auto mt-10'>
          <div className='flex flex-col w-96 h-96'>
            <div className='my-4'>
              <label htmlFor="timeSlider">Time Per Answer: {sliderValue} seconds</label>
              <input
                id="timeSlider"
                type="range"
                min="5"
                max="60"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-96"
              />
            </div>

            <input 
              type="text" 
              value={category} 
              onChange={handleCategoryChange} 
              placeholder="Enter Category" 
              className='w-full my-10 p-2 border border-gray-300 rounded'
            />

            <div className='flex mb-4'>
              <button className="cursor-pointer w-full p-2 bg-blue-500 text-white rounded-l hover:bg-blue-700" onClick={handleVoiceChatRoomClick}>Voice Chat Room</button>
              <button className="cursor-pointer w-full p-2 bg-green-500 text-white rounded-r hover:bg-green-700" onClick={handleTypingRoomClick}>Typing Room</button>
            </div>

            <div className='flex'>
              <button className='w-full p-2 bg-red-500 text-white rounded hover:bg-red-700' onClick={handleCreateClick}>Create Room</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateRoom
