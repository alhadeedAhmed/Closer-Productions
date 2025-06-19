import React, { useEffect, useRef, useState } from 'react';

const getCounter = () => {
  let tmp = 0;
  return () => tmp++;
};
const counter = getCounter();

export default function ProfitablerateAdLeft() {
  const [toShow, setToShow] = useState(false);
  const [hasError, setHasError] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = counter();
    const timeout = index * 5500;
    const timer = setTimeout(() => {
      setToShow(true);
      clearTimeout(timer);
    }, timeout);
  }, []);

  return (
    <div
     className="mx-2 my-5 border border-gray-200 justify-center items-center text-white text-center"
      style={{ width: 160, height: 300, background: '#f5f5f5', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      ref={bannerRef}
    >
       {toShow ? (
        hasError ? (
          <span style={{ color: '#aaa', fontWeight: 600, fontSize: 14 }}>
            Advertisement
          </span>
        ) : (
          <a
            href="https://www.dpbolvw.net/click-101465718-15520679"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', width: '100%', height: '100%' }}
          >
            <img
              src="https://www.lduhtrp.net/image-101465718-15520679"
              alt="Advertisement"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setHasError(true)}
            />
          </a>
        )
      ) : (
        <span style={{ color: '#aaa', fontWeight: 600, fontSize: 14 }}>
          Advertisement
        </span>
      )}
    </div>
  );
}
