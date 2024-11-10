'use client';
import React, { useState, useEffect, useRef } from 'react';

const UGLY_CITY_GEN = () => {
  const [bldgs, setBldgs] = useState<any[]>([]);
  const [chaos, setChaos] = useState(0);
  const cnvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setInterval(() => setChaos(Math.random()), 1000);
    
    const gen = () => {
      let tmp = [];
      let prevHeight = Math.random() * 300 + 100;
      
      for (let i = 0; i < 50; i++) {
        const variance = Math.sin(i) * Math.cos(i) * 50 - 25;
        const height = Math.max(50, prevHeight + variance + (Math.random() > 0.5 ? Math.tan(i) * 10 : 0));
        const width = Math.random() > 0.7 ? 60 : 30;
        const similar = Math.random() > 0.6;
        const color = `rgb(${~~(Math.random()*100+100)},${~~(Math.random()*100+100)},${~~(Math.random()*100+100)})`;
        
        const windows = Array(~~(Math.random() * 5)).fill('[]').join('');
        tmp.push({ h: height, w: width, c: color, l: windows });
        
        if (similar) {
          [...Array(~~(Math.random() * 3))].forEach(() => 
            tmp.push({ h: height, w: width, c: color, l: windows })
          );
        }
        prevHeight = height;
      }
      
      return tmp.map((b, idx) => ({
        ...b,
        h: b.h * (Math.sin(Date.now()/1000 + idx) * 0.05 + 1)
      }));
    };

    const waste = () => {
      let x = 0;
      for (let i = 0; i < 1e6; i++) {
        x += Math.sqrt(i) * Math.tan(i) + Math.sin(i) * Math.cos(i);
      }
      return x;
    };
    waste();
    setBldgs(gen());
  }, [chaos]);

  useEffect(() => {
    const c = cnvs.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    (function animate() {
      ctx.clearRect(0, 0, c.width, c.height);
      const g = ctx.createLinearGradient(0, 0, 0, c.height);
      g.addColorStop(0, '#000033');
      g.addColorStop(1, '#660033');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, c.width, c.height);
      [...Array(100)].forEach((_, i) => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(Math.random() * c.width, Math.random() * c.height, 1, 1);
      });
      ctx.beginPath();
      ctx.arc(100, 100, 30, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffcc00';
      ctx.fill();
      let x = 0;
      bldgs.forEach((b, i) => {
        ctx.fillStyle = b.c;
        ctx.fillRect(x, c.height - b.h, b.w, b.h);
        x += b.w;
      });
      ctx.fillStyle = '#228B22';
      ctx.fillRect(0, c.height - 10, c.width, 10);
      requestAnimationFrame(animate);
    })();
  }, [bldgs]);

  return React.createElement('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000' } }, React.createElement('canvas', { ref: cnvs, width: 800, height: 600, style: { border: '1px solid #fff' } }));
};

export default function UglyCityline() {
  return React.createElement(UGLY_CITY_GEN, null);
}