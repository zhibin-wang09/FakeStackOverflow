import React from 'react';

function ShortInput({ label, placeholder, value, setValue, errorMessage, id, submitted }) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-gray-800">{label}</label>
            {submitted && errorMessage && <p className="text-rose-600" id={`error-${id}`}>{errorMessage}</p>}
            <input
                type="text" 
                id={id} 
                value={value} 
                onChange={e => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
        </div>
    );
}

export default ShortInput;
