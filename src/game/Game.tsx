import { useState, useEffect } from 'react'
import { useParams, useLocation } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import TaphabetLogo from '../assets/taphabet_logo.png';

function Game() {
  const navigate = useNavigate();

  const location = useLocation();
  const userName = location.state?.userName || "User";
  const timerPerAnswer = location.state?.timerPerAnswer || 15;
  const category = location.state?.category || "General";

  const { roomId } = useParams(); 
  const [currentUser, setCurrentUser] = useState(userName);
  
  const lobbyType = location.state?.lobbyType || "Voice"
  const role = location.state?.role || "user";
  const roomCode = location.state?.roomCode || null;

  const [gameState, setGameState] = useState("");
  const [users, setUsers] = useState(["brandon", "drishti"]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const [isGameOver, setIsGameOver] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, `${currentUser}: ${message}`]);
      setMessage("");
    }
  };

  const [timeLeft, setTimeLeft] = useState(60);
  const [clickedLetters, setClickedLetters] = useState<string[]>([]);

  useEffect(() => {
    setTimeLeft(timerPerAnswer);
  }, [timerPerAnswer]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsGameOver(true);
    }
  }, [timeLeft]);

  const handleLetterClick = (letter: string) => {
    console.log(`Clicked letter: ${letter}`);
    setTimeLeft(timerPerAnswer);
    setClickedLetters([...clickedLetters, letter]);
  };

  const handleResetGame = () => {
    setIsGameOver(false);
    setTimeLeft(timerPerAnswer);
    setClickedLetters([]);
    navigate("/create-room", { state: { userName: userName, timerPerAnswer: timerPerAnswer, oldLobbyType: lobbyType, oldCategory: category } });
  };

  return (
    <>
      <div className='flex flex-col items-center'>
        <div className='w-full flex justify-center mt-2'>
          <img src={TaphabetLogo} alt="Taphabet Logo" className='h-36' />
        </div>
        <div className='flex justify-between w-full px-10 mt-10'>
          <div className='w-1/4'>
            <div className='text-center mb-4'>User List</div>
            <div className='border p-2 rounded'>
              {users.map((user) => (
                <div key={user} className='border p-2 mb-2 rounded'>{user}</div>
              ))}
            </div>
          </div>
          <div className='w-1/2 text-center'>
            <div className='mb-4'>
              <div>Category: {category}</div>
              <div>Time Left: {timeLeft} seconds</div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className={`border p-2 rounded ${clickedLetters.includes(letter) ? 'bg-gray-400' : 'hover:bg-gray-200'}`}
                  disabled={clickedLetters.includes(letter) || isGameOver}
                >
                  {letter}
                </button>
              ))}
            </div>
            {isGameOver && (
              <button onClick={handleResetGame} className="border p-2 mt-2 bg-red-500 text-white rounded hover:bg-red-700">
                Game Over - Return to Main Menu
              </button>
            )}
          </div>
          <div className='w-1/4'>
            <div className='text-center mb-4'>Chat</div>
            <div className="border p-2 h-64 overflow-y-scroll rounded">
              {messages.map((msg, index) => (
                <div key={index} className='mb-2'>{msg}</div>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border p-2 w-full mt-2 rounded"
              disabled={isGameOver}
            />
            <button onClick={handleSendMessage} disabled={isGameOver} className="border p-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Game
