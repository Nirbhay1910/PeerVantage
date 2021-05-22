import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import Proto from './Proto';
import Hero from './Hero';
import Navbar from './Navbar';
function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route path='/:roomId'>
            <Proto />
          </Route>
          <Route path='/'>
            <Navbar />
            <Hero />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
