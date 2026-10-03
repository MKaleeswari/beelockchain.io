'use client';

import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: number;
  title: string;
  timestamp: Date;
}

const Chattest = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (!input.trim() || isGenerating) return;

    const userInput = input;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    // Create new chat if none active
    if (!activeChat) {
      const newChat: Chat = {
        id: Date.now(),
        title: userInput.slice(0, 50) + (userInput.length > 50 ? '...' : ''),
        timestamp: new Date(),
      };
      setChatHistory(prev => [newChat, ...prev]);
      setActiveChat(newChat.id);
    }

    const startTime = Date.now();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();

      // Ensure minimum 2s thinking time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));

      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.reply ?? 'No response from AI',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          content: 'Something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const loadChat = (chatId: number): void => {
    setActiveChat(chatId);
    setMessages([]);
  };

  return (
    <div className="xl:px-30 lg:px-30 md:px-30 px-2 py-10">
      {/* HERO */}
      <div className="text-center pt-16 sm:pt-24 pb-10 sm:pb-16 px-6">
        <h1 className="md:text-3xl sm:text-xl text-[10px] text-white font-bold mb-2">
          AI PROJECT FINDER
        </h1>
        <p className="md:text-3xl sm:text-xl text-2xl sm:text-4xl md:text-5xl text-[#82888d] font-bold mb-3">
          Powered by EVO AI
        </p>
        <p className="text-white font-bold text-[10px] sm:text-base">
          Have only a one-line idea? Start here
        </p>
      </div>

      <div className="flex h-screen bg-gradient-to-br from-[#0f1419] via-[#0a0e14] to-[#0d1b1e] shadow-[0_0_0px_-10px_rgba(58,220,255,0.6),0_0_100px_-30px_rgba(58,220,255,0.4)]">

        {/* Sidebar */}
        <div className="w-72 bg-black/30 backdrop-blur-md border-r border-white/5 lg:flex hidden flex-col">
          <div className="p-5">
            <h2 className="text-white/90 text-base font-semibold">
              AI Project Finder
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chatHistory.map(chat => (
              <button
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeChat === chat.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'
                }`}
              >
                <div className="flex gap-3">
                  <MessageSquare size={18} className="opacity-70" />
                  <span className="text-sm line-clamp-2">{chat.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col bg-black/30">
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-white text-xl font-semibold mb-2">
                  Discover the Magic AI
                </h2>
                <p className="text-gray-400 text-[10px] max-w-md">
                  Exclusively for designers, developers, product teams & magicians!
                </p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex gap-5 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg">
                        ⭐
                      </div>
                    )}

                    <div
                      className={`max-w-3xl px-7 py-5 rounded-3xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
                          : 'bg-black/90 text-gray-100 border border-white/5'
                      }`}
                    >
                      {message.content}
                    </div>

                    {message.type === 'user' && (
                      <div className="w-11 h-11 rounded-xl bg-gray-800 flex items-center justify-center text-white">
                        U
                      </div>
                    )}
                  </div>
                ))}

                {isGenerating && (
                  <div className="flex gap-5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
                      ⭐
                    </div>
                    <div className="bg-black/90 px-7 py-5 rounded-3xl flex gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-150" />
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="max-w-3xl mx-auto flex items-center gap-4 bg-[#2c2c2c] rounded-full px-6 py-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Select what you want to create..."
                className="flex-1 bg-transparent text-white outline-none text-center"
              />
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-2 rounded-full text-white flex gap-2"
              >
                <Send size={16} />
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chattest;
