
import React from 'react';
import { useState } from 'react';
import axios from 'axios';

export default function Login(props){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e){
    e.preventDefault();
    setErrorMsg("");
    axios.post('http://localhost:8000/login',{
      email: email,
      password: password
    },{
      withCredentials: true
    }).then((res) => {
      console.log(res);
      props.backToQuestions();
    }).catch((err) => {
      setErrorMsg();
    })
  }

  function handleInputChange(e){
    if(e.target.id === 'email'){
      setEmail(e.target.value);
    }else if(e.target.id === 'password'){
      setPassword(e.target.value);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <strong className='text-rose-600'>{errorMsg}</strong>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              onChange={handleInputChange}
              pattern='[^@\s]+@[^@\s]+\.[^@\s]+'
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};