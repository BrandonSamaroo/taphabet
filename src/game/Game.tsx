import { useState, useEffect } from 'react'
import { useParams, useLocation } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

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
      <div className='flex flex-col'>
        <div className='mx-auto mt-10 mb-10'>
          header image
        </div>
        <div className='flex justify-center gap-72'>
          <div>
            User List
            <div>
              {users.map((user) => (
                <div key={user}>{user}</div>
              ))}
            </div>
          </div>
          <div>
            <div>
              Category: {category}
            </div>
            <div>
              <div>
                Time Left: {timeLeft} seconds
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className={`border p-2 ${clickedLetters.includes(letter) ? 'bg-gray-400' : ''}`}
                  disabled={clickedLetters.includes(letter) || isGameOver}
                >
                  {letter}
                </button>
              ))}
            </div>
            {isGameOver && (
              <button onClick={handleResetGame} className="border p-2 mt-2">
                Game Over - Return to Main Menu
              </button>
            )}
          </div>
          <div>
            Chat
            <div className="border p-2 h-64 overflow-y-scroll">
              {messages.map((msg, index) => (
                <div key={index}>{msg}</div>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border p-2 w-full mt-2"
              disabled={isGameOver}
            />
            <button onClick={handleSendMessage} disabled={isGameOver} className="border p-2 mt-2">
              Send
            </button>
          </div>
        </div>

      </div>
    </>
  )
}

export default Game
