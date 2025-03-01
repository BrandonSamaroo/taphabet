import { useEffect, useState } from "react";
import { createConsumer } from "@rails/actioncable";

const useWebSocket = (roomId: undefined | string, sessionUser: any) => {
  const [topic, setTopic] = useState("");
  const [timePerAnswer, setTimePerAnswer] = useState(60);
  const [lobbyType, setLobbyType] = useState("voice");
  const [accessibility, setAccessibility] = useState("public")
  const [lettersPressed, setLettersPressed] = useState<string[]>([]);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [isConnecting, setIsConnecting] = useState(true);
  const [failedToConnect, setFailedToConnect] = useState(false);
  const [sessionUsers, setSessionUsers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState("")
  const [messages, setMessages] = useState<string[]>([]);
  const [gameRoomId, setGameRoomId] = useState(0)

  const [cable, setCable] = useState<ReturnType<typeof createConsumer>["subscriptions"]["subscriptions"][0] | null>(null);

  useEffect(() => {
    if (!roomId || !sessionUser) {
      setError('Invalid Request');
      setFailedToConnect(true);
      setIsConnecting(false);
      return;
    }

    const cableConnection = createConsumer("ws://localhost:3000/cable");

    const subscription = cableConnection.subscriptions.create(
      { channel: "GameRoomChannel", room_id: roomId, session_user_id: sessionUser.id },
      {
        connected: () => {
          setIsConnecting(false);
        },
        disconnected: () => {
          setFailedToConnect(true);
        },
        received: (data) => {
          console.log(roomId, data)
          if (data.error) {
            setFailedToConnect(true);
            setError(data.error);
          }
          if (data.letters_pressed) {
            setLettersPressed(data.letters_pressed);
          }
          if (data.is_active != null) {
            setIsActive(data.is_active);
          }
          if (data.session_users) {
            setSessionUsers(data.session_users);
          }
          if (data.player_turn != null) {
            setPlayerTurn(data.player_turn);
            setTimeLeft(timePerAnswer);
          }
          if (data.rounds_played) {
            setRoundsPlayed(data.rounds_played);
          }
          if (data.topic) {
            setTopic(data.topic);
          }
          if (data.lobby_type) {
            setLobbyType(data.lobby_type);
          }
          if (data.time_per_answer) {
            setTimePerAnswer(data.time_per_answer);
          }
          if (data.max_players) {
            setMaxPlayers(data.max_players)
          }
          if (data.accessibility) {
            setAccessibility(data.accessibility)
          }
          if (data.message) {
            setMessages((prevMessages) => [...prevMessages, data.message]);
          }
          if (data.letter_pressed) {
            setLettersPressed((prevLetters) => [...prevLetters, data.letter_pressed]);
          }
          if (data.game_room_id) {
            setGameRoomId(data.game_room_id)
          }
        },
      }
    );

    setCable(subscription);

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    setTimeLeft(timePerAnswer);
  }, [timePerAnswer]);

  useEffect(() => {
    if (timeLeft > 0 && isActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isActive]);

  const sendMessage = (message: string) => {
    cable?.perform("receive", { game_room_id: gameRoomId, session_user_id: sessionUser.id, message_body: message });
  };

  const sendLetter = (letter: string) => {
    cable?.perform("receive", { game_room_id: gameRoomId, session_user_id: sessionUser.id, letter_pressed: letter });
  };

  const sendGameStart = () => {
    cable?.perform("receive", { game_room_id: gameRoomId, session_user_id: sessionUser.id, is_active: true });
  }

  const sendGameEnd = () => {
    cable?.perform("receive", { game_room_id: gameRoomId, session_user_id: sessionUser.id, is_active: false });
  }

  return {
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
  }
};

export default useWebSocket;
