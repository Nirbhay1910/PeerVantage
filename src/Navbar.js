import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './Navbar.css';

function Navbar() {
  const [roomId, setRoomId] = useState();
  const [joinRoomId, setJoinRoomId] = useState();
  useEffect(() => {
    setRoomId(uuidv4());
  }, []);
  return (
    <div className='Navbar'>
      <div className='main__title'>PeerVantage</div>
      <div className='navbar__options'>
        <input
          placeholder='Enter the room code'
          className='navbar__option'
          onChange={(e) => setJoinRoomId(e.target.value)}
        />
        <Link className='navbar__option' to={`/:${joinRoomId}`}>
          Join Room{' '}
        </Link>
        <Link className='navbar__option' to={`/:${roomId}`}>
          Create Room
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
