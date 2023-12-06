import React, { useState, useEffect } from "react";
import axios from 'axios';
import formatTimeSince from "../formattime";
import extractLinks from "../processInput.js";

export default function QuestionPage({ handlePageChange, currQuestionId }) {
  const [answers, setAnswers] = useState([]);
  const [askedBy, setAskedBy] = useState("");
  const [question, setQuestion] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/get/questions/${currQuestionId}`);
        setQuestion(res.data);
        setAnswers(res.data.answers);
        setAskedBy(res.data.asked_by.username);
      } catch (error) {
        console.error('Error fetching question details:', error);
      }
    };
    fetchData();
  }, [currQuestionId]);

  const handleNext = () => {
    setStartIndex(startIndex + 5);
  };

  const handlePrev = () => {
    setStartIndex(startIndex - 5);
  };

  const displayAnswers = answers.slice(startIndex, startIndex + 5);

  const renderComments = (comments) => {
    if (!comments || comments.length === 0) {
      return <div>No comments available</div>; // Placeholder for no comments
    }
    
    return comments.map((comment) => (
      <div key={comment._id} className="ml-8 mt-2 text-gray-600">
        {comment.text}
        <div className="text-gray-500 mt-1">Votes: {comment.votes}</div>
      </div>
    ));
  };

  const renderCommentButton = () => {
    return (
      <button className="text-gray-500 mt-2 underline ml-8" onClick={() => console.log("Add a comment clicked")}>
        Add a comment
      </button>
    );
  };

  const handleQuestionUpvote = (e) => {
    axios.post(`http://localhost:8000/post/increaseQuestionVote/${currQuestionId}`,{},{
      withCredentials: true
    }).then(response => {
      setQuestion(response.data); // update question to render new upvote amount
    }).catch(err => {
      console.log(err.response.data)
    })
  }

  const handleQuestionDownvote = (e) => {
    axios.post(`http://localhost:8000/post/decreaseQuestionVote/${currQuestionId}`,{},{
      withCredentials: true
    }).then(response => {
      setQuestion(response.data); // update question to render new upvote amount
    }).catch(err => {
      console.log(err.response.data)
    })
  }

  const handleAnswerUpvote = (e) => {
    axios.post(`http://localhost:8000/post/increaseAnswerVote/${e.target.id}`,{},{
      withCredentials: true
    }).then(response => {

      setAnswers(answers.map(a => a._id === e.target.answerId ? response.data : a)); // replace the old answer to render new vote amonut
    }).catch(err => {
      console.log(err.response.data)
    })
  }

  const handleAnswerDownvote = (e) => {
    axios.post(`http://localhost:8000/post/decreaseAnswerVote/${e.target.id}`,{},{
      withCredentials: true
    }).then(response => {

      setAnswers(answers.map(a => a._id === e.target.answerId ? response.data : a)); // replace the old answer to render new vote amonut
    }).catch(err => {
      console.log(err.response.data)
    })
  }

  return (
    <div>
      <div className="bg-gray-100 rounded-lg p-4 shadow-md mb-4 mx-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-gray-600">Views: {question.views}</div>
            <div className="text-gray-600">Posted by: {askedBy}</div>
          </div>
        </div>
        <div className="mt-2">{question.text === undefined ? '' : extractLinks(question.text)}</div>
          <div className="mt-4">
            <button className="text-blue-500 mr-4" onClick={handleQuestionUpvote}>
              Upvote
            </button>
            <button className="text-red-500" onClick={handleQuestionDownvote}>
              Downvote
            </button>
            <div className="text-gray-500 mt-1">Votes: {question.votes}</div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Comments:</h3>
            {renderComments(question.comments)}
            {renderCommentButton()}
          </div>
      </div>

      {displayAnswers.map((answer) => (
        <div key={answer._id} className="bg-gray-100 rounded-lg p-4 shadow-md mb-4 mx-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="text-gray-600">Posted by: {answer.ans_by.username}</div>
              <div className="text-gray-600">Answered on: {formatTimeSince(answer.ans_date_time)}</div>
            </div>
          </div>
          <div className="mt-2">{extractLinks(answer.text)}</div>
          <div className="mt-4">
            <button className="text-blue-500 mr-4" onClick={handleAnswerUpvote} id = {answer._id}> 
              Upvote
            </button>
            <button className="text-red-500" onClick={handleAnswerDownvote} id = {answer._id}>
              Downvote
            </button>
            <div className="text-gray-500 mt-1">Votes: {answer.votes}</div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Comments:</h3>
            {renderComments(answer.comments)}
            {renderCommentButton()}
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <button
          id='prev-button'
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-1 border-blue-700 hover:border-blue-500 rounded mx-9"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          Prev
        </button>
        <button
          id='next-button'
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-1 border-blue-700 hover:border-blue-500 rounded mx-9"
          onClick={handleNext}
          disabled={startIndex + 5 >= answers.length}
        >
          Next
        </button>
      </div>

      <div className="flex justify-between mx-14">
        <button
          id='post-answer'
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-1 border-blue-700 hover:border-blue-500 rounded mx-2"
          onClick={handlePageChange}
        >
          Answer questions
        </button>
      </div>
    </div>
  );
}
