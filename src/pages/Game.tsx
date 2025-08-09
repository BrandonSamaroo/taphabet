import { useEffect, useContext, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom"
import useWebSocket from '../hooks/useWebSocket';
import { SessionUserContext } from '../context/SessionUserContext';
import { toast } from 'react-toastify';
import { FaCopy } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoPerson } from "react-icons/io5";

function Game() {
  const navigate = useNavigate();
  const { roomId } = useParams<string>();
  const { sessionUser }  = useContext(SessionUserContext);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const textColorClasses = [
    'text-amber-500', 'text-red-500', 'text-green-500', 
    'text-blue-500', 'text-purple-500', 'text-pink-500', 
    'text-yellow-500', 'text-indigo-500', 'text-teal-500'
  ];

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  if (false) {
    return <>
      <div className='flex'>
        <div className='font-semibold'>Copy Room Code</div>
        <button onClick={handleCopyRoomId} className='cursor-pointer font-black text-gray-800 px-2'><FaCopy/></button>
      </div>
    </>
  }

  return (
    <>
      <div className='w-4/5 flex flex-col items-center mx-auto'>
        <div className='w-full h-14 bg-gray-200 flex justify-between items-center rounded-lg px-5'>
          <div className='flex'>
            <div className='font-semibold'>{isActive ? "Game In Progress" : `${sessionUsers.length} of ${maxPlayers} Players Joined`}</div>
          </div>
          <div>
            <div className='text-center'>Topic</div>
            <div className='text-center text-lg font-semibold'>{topic}</div>
          </div>
          {isActive && (
            <div>
              <div>Player Turn: <span className='font-semibold'>{sessionUsers[playerTurn].name}</span></div>
              <div>Time Left: <span className='font-semibold'>{timeLeft}</span></div>
            </div>
          )}
          <div className='cursor-pointer text-xl font-black text-gray-800'>
            <IoMdSettings />
          </div>
        </div>

        <div className='w-full flex justify-between'>
          <div className=''>
            {sessionUsers.map((user, index) => (
              <div key={index} className='flex bg-gray-200 h-14 w-56 rounded-lg px-2 my-2'>
                <div className='pt-1 pl-1'>#{index + 1}</div>
                <div className='flex flex-col m-auto'>
                  <div className='font-semibold'>{user.name}</div>
                  <div className='text-xs mx-auto'>0 Wins</div>
                </div>
                <div className={`my-auto pr-1 text-2xl ${textColorClasses[index % textColorClasses.length]}`}>
                  <IoPerson/>
                </div>
              </div>
            ))}
          </div>

          <div className='w-full px-6 my-2'>
            <div className="grid grid-cols-4 gap-2">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => {
                    sendLetter(letter)
                  }}
                  className={`border cursor-pointer py-2 rounded ${lettersPressed.includes(letter) ? 'bg-gray-400' : 'hover:bg-gray-200'}`}
                  disabled={lettersPressed.includes(letter) || !isActive || playerTurn !== sessionUsers.map(sessionUser=>sessionUser.id).indexOf(sessionUser.id)}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          <div className='w-lg rounded-lg my-2'>
            <div className="border-t border-x p-2 h-96 rounded-t overflow-hidden">
              {messages.map((msg, index) => (
                <div key={index} className='flex'>
                  <div><span className='font-semibold'>{msg.sender}:</span> {msg.body}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Send a message...'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage(message);
                  setMessage('');
                }
              }}
              className="border p-2 w-full rounded-b"
            />
          </div>
        </div>

        {!isActive && (
          <div className='h-14 flex justify-evenly items-center rounded-lg mt-6'>
            <button
              onClick={handlePlayAgain}
              className='bg-green-500 text-white font-semibold py-2 px-10 mr-4 rounded-lg cursor-pointer hover:bg-green-600'
              disabled={isActive}
            >
              Play
            </button>
            <button
              onClick={handleCopyRoomId}
              className='bg-blue-500 text-white font-semibold py-2 px-10 rounded-lg cursor-pointer hover:bg-blue-600'
              disabled={isActive}
            >
              Invite
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Game;
