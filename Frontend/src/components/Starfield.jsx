import React, { useMemo } from 'react';

const generateStars = (count) => {
  let stars = '';
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    const opacity = Math.random();
    stars += `${x}px ${y}px rgba(255, 255, 255, ${opacity})${i === count - 1 ? '' : ', '}`;
  }
  return stars;
};

const Starfield = () => {
  const shadowsSmall = useMemo(() => generateStars(700), []);
  const shadowsMedium = useMemo(() => generateStars(200), []);
  const shadowsLarge = useMemo(() => generateStars(100), []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]">
      {/* Radial blur glow spots */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]"></div>
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-pink-600/10 blur-[100px]"></div>

      {/* CSS Starfield */}
      <style>{`
        #stars { width: 1px; height: 1px; background: transparent; box-shadow: ${shadowsSmall}; animation: animStar 50s linear infinite; }
        #stars:after { content: " "; position: absolute; top: 2000px; width: 1px; height: 1px; background: transparent; box-shadow: ${shadowsSmall}; }
        
        #stars2 { width: 2px; height: 2px; background: transparent; box-shadow: ${shadowsMedium}; animation: animStar 100s linear infinite; }
        #stars2:after { content: " "; position: absolute; top: 2000px; width: 2px; height: 2px; background: transparent; box-shadow: ${shadowsMedium}; }
        
        #stars3 { width: 3px; height: 3px; background: transparent; box-shadow: ${shadowsLarge}; animation: animStar 150s linear infinite; }
        #stars3:after { content: " "; position: absolute; top: 2000px; width: 3px; height: 3px; background: transparent; box-shadow: ${shadowsLarge}; }
        
        @keyframes animStar {
          from { transform: translateY(0px); }
          to { transform: translateY(-2000px); }
        }
      `}</style>
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
    </div>
  );
};

export default Starfield;
