import { useEffect, useState } from "react";
import { createConsumer } from "@rails/actioncable";

const useWebSocket = (roomCode: undefined | string, timerPerAnswer: number) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [lettersPressed, setLettersPressed] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerPerAnswer);

  const [cable, setCable] = useState<ReturnType<typeof createConsumer>["subscriptions"]["subscriptions"][0] | null>(null);

  useEffect(() => {
    const cableConnection = createConsumer("ws://localhost:3000/cable");

    const subscription = cableConnection.subscriptions.create(
      { channel: "GameRoomChannel", room_code: roomCode },
      {
        connected: () => {
          setIsConnected(true);
        },
        disconnected: () => {
          setIsConnected(false);
        },
        received: (data) => {
          if (data.message) {
            setMessages((prev) => [...prev, data.message]);
          }
          if (data.letter) {
            setLettersPressed((prev) => [...prev, data.letter]);
          }
          if (timerPerAnswer) {
            setTimeLeft(timerPerAnswer);
          }
          if (data.userName) {
            setUsers((prev) => [...prev, data.userName]);
          }
        },
      }
    );

    setCable(subscription);

    return () => {
      subscription.unsubscribe();
    };
  }, [roomCode]);

  useEffect(() => {
    setTimeLeft(timerPerAnswer);
  }, [timerPerAnswer]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const sendMessage = (message: string) => {
    cable?.perform("receive", { message: message });
  };

  const sendLetter = (letter: string) => {
    cable?.perform("receive", { letter: letter });
  };

  const addUser = (name: string) => {
    cable?.perform("receive", { userName: name });
  };

  return { messages, lettersPressed, sendMessage, sendLetter, setLettersPressed, users, addUser, isConnected, timeLeft, setTimeLeft };
};

export default useWebSocket;
