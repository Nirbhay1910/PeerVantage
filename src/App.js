import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import Proto from './Proto';
import { v4 as uuidv4 } from 'uuid';
function App() {
  const [roomId, setRoomId] = useState();
  useEffect(() => {
    setRoomId(uuidv4());
  }, []);

  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route path='/:roomId'>
            <Proto />
          </Route>
          <Route path='/'>
            <Link to={`/${roomId}`}>CREATE ROOM</Link>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
