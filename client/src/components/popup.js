import React, { useState, useEffect } from 'react';

const Popup = ({ closePopup }) => {
    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        const isPopupClosed = localStorage.getItem('isPopupClosed');
        if (isPopupClosed) {
            setShowPopup(false);
        }
    }, []);

    const handlePopupClose = () => {
        setShowPopup(false);
        localStorage.setItem('isPopupClosed', true);
        closePopup();
    };

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Welcome to Fake StackOverflow!</h2>
                        <p className="text-lg mb-4">Thanks for visiting! You are currently a guest user. You may register or login in the top right. </p>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={handlePopupClose}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Popup;
