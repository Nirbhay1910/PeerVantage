import React, { useEffect, useRef, useState } from 'react';
import './Hero.css';
import GLOBE from 'vanta/dist/vanta.globe.min';

function Hero() {
  const [vantaEffect, setVantaEffect] = useState(0);
  const myRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        GLOBE({
          el: myRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: true,
          minHeight: window.innerHeight,
          minWidth: window.innerWidth,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 'hsl(303, 90%, 50%)',
          backgroundColor: 'hsl(240, 42%, 20%)',
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);
  return (
    <div>
      <div ref={myRef}></div>
      <div className='tagline'>
        <h1>
          <span>Learn</span> and <span>Grow</span> Together
        </h1>
        <h3> having fun and getting things done on time</h3>
      </div>
    </div>
  );
}

export default Hero;
