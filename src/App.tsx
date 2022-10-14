import React from 'react';
import logo from './logo.svg';
import './App.css';
import { GoBoard, PreviewItemT } from './gui/GoBoard';
import { GoTopComponent } from './gui/GoTopComponent';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <GoTopComponent
        bPlayer='Maxi'
        bLostPoints={2}
        wPlayer='Felix'
        wLostPoints={5}
        turn='w'
      />
      <GoBoard 
        board={{
          pieces: [
            ['b','w',' ', 'b', ' '],
            [' ','w',' ', 'b', ' '],
            [' ',' ','w', 'b', ' '],
            ['w','w','b', 'b', ' '],
            ['b','w',' ', 'b', ' ']
          ]
        }}
        width={400}
        height={400}
        playerColor="w"
      />
    </div>
  );
}

export default App;
