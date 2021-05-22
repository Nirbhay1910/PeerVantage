import React, { useEffect, useRef, useState } from 'react';
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
  return <div ref={myRef}></div>;
}

export default Hero;
