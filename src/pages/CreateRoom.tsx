import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { SessionUserContext } from '../context/SessionUserContext';

function CreateRoom() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [timePerAnswer, setTimePerAnswer] = useState(60);
  const [lobbyType, setLobbyType] = useState("voice");
  const [accessibility, setAccessibility] = useState("private");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const { setSessionUser }  = useContext(SessionUserContext);

  const handleCreateClick = async (event: any) => {
    if (topic == "") {
      toast.error("Please enter a Topic");
      return
    }

    const gameRoom = await createGameRoom();
    if (gameRoom) {
      const user = await createSessionUser(gameRoom);
      if (user) {
        setSessionUser(user);
        navigate(`/play/${gameRoom.room_id}`);
      }
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
          topic: topic,
          time_per_answer: timePerAnswer,
          lobby_type: lobbyType,
          accessibility: accessibility,
          max_players: maxPlayers

        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create game room");
      }
      return await response.json();
    } catch (error) {
      toast.error("Failed to create game room");
      navigate(`/`);
    }
  };

  const createSessionUser = async (gameRoom: any) => {
    try {
      const response = await fetch("http://localhost:3000/session_users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_room_id: gameRoom.id
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
          <input 
            type="text" 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            placeholder="Enter Topic" 
            className='w-full p-2 border border-gray-300 rounded'
          />

          <div className='mt-4'>
            <label htmlFor="timeSlider">Time Per Answer: {timePerAnswer} seconds</label>
            <input
              id="timeSlider"
              type="range"
              min="5"
              max="60"
              value={timePerAnswer}
              onChange={(e) => setTimePerAnswer(Number(e.target.value))}
              className="w-96"
            />
          </div>

          <div className='flex mt-4'>
            <button
              className={`cursor-pointer w-full p-2 ${lobbyType === 'voice' ? 'bg-green-500' : 'bg-gray-500'} text-white rounded-l border-r hover:bg-green-500`}
              onClick={() => setLobbyType("voice")}
            >
              Voice Chat Room
            </button>
            <button
              className={`cursor-pointer w-full p-2 ${lobbyType === 'typing' ? 'bg-green-500' : 'bg-gray-500'} text-white rounded-r border-l hover:bg-green-500`}
              onClick={() => setLobbyType("typing")}
            >
              Typing Room
            </button>
          </div>

          <div className='flex mt-4'>
            <button
              className={`cursor-pointer w-full p-2 ${accessibility === 'public' ? 'bg-green-500' : 'bg-gray-500'} text-white rounded-l border-r hover:bg-green-500`}
              onClick={() => setAccessibility("public")}
            >
              Public
            </button>

            <button
              className={`cursor-pointer w-full p-2 ${accessibility === 'private' ? 'bg-green-500' : 'bg-gray-500'} text-white rounded-r border-l hover:bg-green-500`}
              onClick={() => setAccessibility("private")}
            >
              Private
            </button>
          </div>

          <div className='mt-4'>
            <label htmlFor="maxPlayers">Max Players</label>
            <select
              id="maxPlayers"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className='w-full p-2 border border-gray-300 rounded'
            >
              {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div></div>
            <button className='w-full cursor-pointer p-2 bg-blue-500 text-white rounded hover:bg-blue-700 mt-4' onClick={handleCreateClick}>Create Room</button>
          </div>
        </div>
    </>
  );
}

export default CreateRoom;
