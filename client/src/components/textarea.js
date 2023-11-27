import React from 'react';

function TextArea({ label, placeholder, value, setValue, errorMessage, id, submitted}) {
    return (
        <div className="space-y-2">
        <label htmlFor="question-text" className="text-gray-800">{label}</label>
        {submitted && errorMessage && <p className="text-rose-600" id={`error-${id}`}>{errorMessage}</p>}
        <textarea 
            id={id} 
            rows="4" 
            value={value} 
            onChange={e => setValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
            placeholder={placeholder}
        ></textarea>
    </div>
    );
}

export default TextArea;
