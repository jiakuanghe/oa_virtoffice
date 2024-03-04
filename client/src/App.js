import React, { useState } from 'react';

import GameLoop from './components/GameLoop';
import Office from './components/Office';

import './App.css';
import { io } from 'socket.io-client';

const WEBRTC_SOCKET = io(process.env.REACT_APP_ENV === 'github' ? "https://potential-waffle-x6xgxpqg7wx3vpxj-8080.app.github.dev" : "http://localhost:8080");

function App() {
  const [socketConnected, setSocketConnected] = useState(false);
  WEBRTC_SOCKET.on('connect', () => {
    setSocketConnected(true);
  });
  return (
    <>
        <header>
        </header>
        {socketConnected &&
          <main className="content">
              <GameLoop>
                <Office webrtcSocket={WEBRTC_SOCKET}/>
              </GameLoop>
          </main>
        }
        <footer>
        </footer>
    </>
  );
}

export default App;
