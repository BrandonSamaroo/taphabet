import { useEffect, useContext, useState } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom"
import useWebSocket from '../hooks/useWebSocket';
import { SessionUserContext } from '../context/SessionUserContext';
import { toast } from 'react-toastify';

function Game() {
  const navigate = useNavigate();
  const { roomId } = useParams<string>();
  const { sessionUser }  = useContext(SessionUserContext);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [message, setMessage] = useState("")

  const { 
    failedToConnect, isConnecting,
    lettersPressed, sendLetter, setLettersPressed,
    sessionUsers,
    timeLeft, setTimeLeft, timePerAnswer,
    isActive,
    lobbyType,
    topic,
    accessibility,
    maxPlayers,
    sendGameStart, sendGameEnd,
    roundsPlayed,
    playerTurn,
    messages, sendMessage,
    error,
    gameRoomId
   } = useWebSocket(roomId, sessionUser);

  useEffect(() => {
    if (failedToConnect) {
      if (!sessionUser) {
        toast.error("User not found");
      } else if (error !== "") {
        toast.error(error);
      } else if (!gameRoomId) {
        toast.error("Game room not found");
      }
      navigate("/");
    }
  }, [failedToConnect, sessionUser, error, navigate, gameRoomId]);

  useEffect(() => {
    if (timeLeft === 0) {
      sendGameEnd();
    }
  }, [timeLeft]);

  const handleUpdateSettings = () => {
    // setTimeLeft(timerPerAnswer);
    // setLettersPressed([]);
    // navigate("/create-room", { state: { userName: userName, timerPerAnswer: timerPerAnswer, oldLobbyType: lobbyType, oldCategory: category, oldRoomCode: roomId } });
  };

  const handlePlayAgain = () => {
    sendGameStart()
    setTimeLeft(timePerAnswer);
    setLettersPressed([]);
  };

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
    }
  };

  if (failedToConnect) {
    return <></>;
  }

  return (
    <>
      <div className='flex flex-col items-center'>
        <div className='flex justify-between w-full px-10 mt-10'>
          <div className='w-1/4'>
            <div className='text-center mb-4'>User List</div>
            <div className='border p-2 rounded'>
              {sessionUsers.map((sessionUser) => (
                <div key={sessionUser.id} className='border p-2 mb-2 rounded'>{sessionUser.name}</div>
              ))}
            </div>
          </div>
          <div className='w-1/2 text-center'>
            <div className='mb-4'>
              <div>Topic: {topic}</div>
              <div>Time Left: {timeLeft} seconds</div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => {
                    sendLetter(letter)
                  }}
                  className={`border p-2 rounded ${lettersPressed.includes(letter) ? 'bg-gray-400' : 'hover:bg-gray-200'}`}
                  disabled={lettersPressed.includes(letter) || !isActive || playerTurn !== sessionUsers.map(sessionUser=>sessionUser.id).indexOf(sessionUser.id)}
                >
                  {letter}
                </button>
              ))}
            </div>
            {(!isActive) && (
              <div className='flex mt-2'>
                <button onClick={handlePlayAgain} className="border p-2 bg-green-500 text-white rounded hover:bg-green-700">
                  {roundsPlayed == 0 ? "Play" : "Play Again"}
                </button>
                <button onClick={handleUpdateSettings} className="border p-2 bg-red-500 text-white rounded hover:bg-red-700">
                  Update Rules
                </button>
                <div className='flex items-center ml-2'>
                  <input
                    type="text"
                    value={roomId}
                    disabled
                    className="border p-2 rounded mr-2"
                  />
                  <button onClick={handleCopyRoomId} className="border p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                    📋
                  </button>
                </div>
              </div>
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
              placeholder='Enter Message'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage(message);
                  setMessage('');
                }
              }}
              className="border p-2 w-full mt-2 rounded"
            />
            <button
              onClick={() => {
                sendMessage(message);
                setMessage('');
              }}
              className="border p-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Game;
