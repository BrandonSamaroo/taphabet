import { useState, useContext } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { SessionUserContext } from '../context/SessionUserContext';

function MainMenu() {
  const navigate = useNavigate();
  const { setSessionUser }  = useContext(SessionUserContext);

  const [roomCode, setRoomCode] = useState("");

  const handleJoinRoomClick = async () => {
    const gameRoom = await findGameRoomID();
    if (gameRoom) {
      const user = await createSessionUser(gameRoom.id);
      if (user) {
        setSessionUser(user);
        navigate(`/play/${roomCode}`);
      }
    }
  };

  const handleCreateRoomClick = () => {
    navigate("/create-room");
  }

  const findGameRoomID = async () => {
    try {
      const response = await fetch(`http://localhost:3000/game_rooms/${roomCode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to find game room");
      }
      return await response.json();
    } catch (error) {
      toast.error("Failed to find game room");
      navigate(`/`);
    }
  };

  const createSessionUser = async (gameRoomId: number) => {
    try {
      const response = await fetch("http://localhost:3000/session_users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_room_id: gameRoomId
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create session user");
      }
      return await response.json();
    } catch (error) {
      toast.error("Failed to create a user");
      navigate(`/`);
    }
  };

  return (
    <>
      <div className='flex justify-center items-center'>
        <div className='w-96'>
          <div className='flex mt-2'>
            <input 
              type="text" 
              value={roomCode} 
              onChange={(e) => setRoomCode(e.target.value)} 
              placeholder="Enter Room Code" 
              className='w-full p-2 border border-gray-400 bg-white rounded-l'
            />
            <button 
              className={`w-full p-2 ${roomCode === "" ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-blue-500 text-white cursor-pointer hover:bg-blue-700'} rounded-r`} 
              onClick={handleJoinRoomClick}
              disabled={roomCode === ""}
            >
              Join Room
            </button>
          </div>

          <div className='flex mt-6'>
            <button 
              className="cursor-pointer w-full p-2 bg-green-500 text-white rounded hover:bg-green-700" 
              onClick={handleCreateRoomClick}
            >
              Create Room
            </button>
          </div>
        </div>       
      </div>
    </>
  )
}

export default MainMenu
