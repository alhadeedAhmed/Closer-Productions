import React, { useEffect, useRef, useState } from 'react';

const getCounter = () => {
  let tmp = 0;
  return () => tmp++;
};
const counter = getCounter();

export default function ProfitablerateAdRight() {
  const [toShow, setToShow] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = counter();
    const timeout = index * 3500;
    const timer = setTimeout(() => {
      setToShow(true);
      clearTimeout(timer);
    }, timeout);
  }, []);

  useEffect(() => {
    if (!toShow) {
      return;
    }
    const atOptions = {
      key: '25d3b6d537ecd47b0fa627c33c634444',
      format: 'iframe',
      height: 300,
      width: 160,
      params: {},
    };
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const confScript = document.createElement('script');
      const adScript = document.createElement('script');
      adScript.type = 'text/javascript';
      adScript.src = `//www.highperformanceformat.com/${atOptions.key}/invoke.js`;
      confScript.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;
      bannerRef.current.appendChild(confScript);
      bannerRef.current.appendChild(adScript);
      // Fallback: show placeholder if ad doesn't load in 8s
      setTimeout(() => {
        if (bannerRef.current && bannerRef.current.childElementCount === 2) {
          bannerRef.current.innerHTML = '<span style="color: #aaa; font-weight: 600; font-size: 16px; z-index: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">Advertisement</span>';
        }
      }, 8000);
    }
  }, [toShow]);

  return (
    <div
      className="mx-2 my-5 border border-gray-200 justify-center items-center text-white text-center"
      style={{ width: 160, height: 300, background: '#f5f5f5', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      ref={bannerRef}
    />
  );
}
