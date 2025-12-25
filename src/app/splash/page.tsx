'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SplashPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth');
    }, 3000); // 3-second delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#0A0A0A' // Matching the app's background
    }}>
      <style>
        {`
          .loader {
            border: 8px solid #f3f3f320; /* Light grey */
            border-top: 8px solid #8B5CF6; /* Purple */
            border-radius: 50%;
            width: 80px;
            height: 80px;
            animation: spin 1.5s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div className="loader"></div>
    </div>
  );
};

export default SplashPage;
