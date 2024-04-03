import React, { useState } from 'react';

import GameLoop from './components/ui/game/GameLoop';
import Office from './components/ui/map/Office';
import VideoManager from "./components/ui/video/VideoManager";
import ChatRoom from "./components/ui/chat/ChatRoom";

import './App.css';
import { io } from 'socket.io-client';
import { ChakraProvider } from '@chakra-ui/react'

const WEBRTC_SOCKET = io(process.env.REACT_APP_ENV === 'github' ? "https://potential-waffle-x6xgxpqg7wx3vpxj-8080.app.github.dev" : "http://localhost:8080");

function App() {
  const [socketConnected, setSocketConnected] = useState(false);
  WEBRTC_SOCKET.on('connect', () => {
    setSocketConnected(true);
  });
  return (
    <ChakraProvider>
        <header>
        </header>
        {socketConnected &&
          <main className="content">
              <GameLoop>
                <Office webrtcSocket={WEBRTC_SOCKET}/>
              </GameLoop>
              <ChatRoom webrtcSocket={WEBRTC_SOCKET} />
              <VideoManager webrtcSocket={WEBRTC_SOCKET} />
          </main>
        }
        <footer>
        </footer>
    </ChakraProvider>
  );
}

export default App;
