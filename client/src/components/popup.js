import axios from 'axios';
import React, { useEffect } from 'react';

const Popup = ({ closePopup,setShowPopup,showPopup }) => {

  useEffect(() => {
    axios.get('http://localhost:8000/isloggedin',{
      withCredentials: true
    }).then(res => {
      setShowPopup(false);
    }).catch(err => {
      setShowPopup(true);
    })
  }, [setShowPopup])

  const handlePopupClose = (action) => {
    setShowPopup(false);
    closePopup(action);
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-200 backdrop-filter backdrop-blur-md backdrop-opacity-50 absolute inset-0"></div>
          <div className="bg-white p-8 rounded-lg z-10 relative">
            <h2 className="text-2xl font-bold mb-4">Welcome to Fake StackOverflow!</h2>
            <p className="text-lg mb-4">Thanks for visiting! You are currently a guest user. You may register or login.</p>
            <div className="flex space-x-6">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={() => handlePopupClose('guest')}>Continue as Guest</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={() => handlePopupClose('signup')}>Register</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={() => handlePopupClose('login')}>Login</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
