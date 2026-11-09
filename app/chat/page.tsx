"use client";
import { useEffect, useState } from "react";
import type { MessageType } from "../api/message/route";

export default function Home() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState<MessageType[]>([]);
  const [darftName, setDarftName] = useState("");
  const [darftMessage, setDarftMessage] = useState("");

  const handleSubmitName = () => {
    setName(darftName);
    setDarftName("");
  };
  const handleSubmitMessage = () => {
    setDarftMessage("");
    if (!darftMessage) return alert("Please enter a message");
    fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, message: darftMessage }),
    });
  };

  useEffect(() => {
    if (!name) return;

    const fetchData = async () => {
      const response = await fetch(`/api/message`);
      const data = await response.json();
      setMessage(data.message);
    };
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [name]);

  if (!name) {
    return (
      <div className="flex max-w-md mx-auto justify-center">
        <form className="flex flex-col gap-2" action={handleSubmitName}>
          <input
            type="text"
            className="border border-gray-300 rounded px-2 py-1"
            onChange={(e) => setDarftName(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 mt-4">
      - {name} -
      <div>
        {message.length === 0
          ? "No messages"
          : message.map((m) => (
              <div key={m.id}>
                {m.name}: {m.message}
              </div>
            ))}
      </div>
      <form className="flex flex-col gap-2" action={handleSubmitMessage}>
        <input
          type="text"
          className="border border-gray-300 rounded px-2 py-1"
          onChange={(e) => setDarftMessage(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
