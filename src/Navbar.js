import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function Navbar() {
  const [roomId, setRoomId] = useState();
  const [joinRoomId, setJoinRoomId] = useState();
  useEffect(() => {
    setRoomId(uuidv4());
  }, []);
  return (
    <div className='Navbar'>
      <input onChange={(e) => setJoinRoomId(e.target.value)} />
      <Link to={`/:${joinRoomId}`}>Join Room </Link>
      <Link to={`/:${roomId}`}>Create Room</Link>
    </div>
  );
}

export default Navbar;
