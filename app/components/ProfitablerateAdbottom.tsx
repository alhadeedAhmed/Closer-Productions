import React, { useEffect, useRef, useState } from 'react';

const getCounter = () => {
  let tmp = 0;
  return () => tmp++;
};
const counter = getCounter();

export default function ProfitablerateAdBottom() {
  const [toShow, setToShow] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = counter();
    const timeout = index * 1500;
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
      key: 'c32513b829048d2ec68cd53816ae53ef',
      format: 'iframe',
      height: 90,
      width: 728,
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
          bannerRef.current.innerHTML = '<span style="color: #aaa; font-weight: 600; font-size: 16px; z-index: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%">Advertisement</span>';
        }
      }, 8000);
    }
  }, [toShow]);

  return (
    <div
      className="mx-2 my-5 border border-gray-200 justify-center items-center text-white text-center"
      style={{ width: 728, height: 90, background: '#f5f5f5', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      ref={bannerRef}
    />
  );
}
