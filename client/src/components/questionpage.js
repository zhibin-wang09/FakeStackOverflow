import React, { useState, useEffect } from "react";
import axios from 'axios';
import formatTimeSince from "../formattime";
import extractLinks from "../processInput.js";


export default function QuestionPage({ handlePageChange, currQuestionId }) {
  const [answers, setAnswers] = useState([]);
  const [askedBy, setAskedBy] = useState("");
  const [question, setQuestion] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showQuestionPopup, setShowQuestionPopup] = useState(false);
  const [showAnswerPopup, setShowAnswerPopup] = useState(false);

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


  const renderCommentButton = (answerId) => { // type represent if we pressing the button we should post to question(!) or answer(2)
    const handleAddComment = () => {
      // if comment more than 140 characters, show error
      if (comment.length > 140) {
        setErrorMsg("Comment should be 50 characters or less.");
        return;
      }
      /**
       * add comment can't distinguish between question and answer
       */
      if(!answerId){
        console.log("question");
        axios.post(`http://localhost:8000/post/commentToQuestion/${currQuestionId}`,{
          text: comment
        },{
          withCredentials: true
        }).then(res => {
          setShowPopup(false);
          setComment("");
          setErrorMsg("");
        }).catch(err => {
          console.log(err.response.data);
        })
      }else if(answerId){
        console.log("answer");
        axios.post(`http://localhost:8000/post/commentToAnswer/${answerId}`,{
          text:comment
        },{
          withCredentials: true
        }).then(res => {

          setShowPopup(false);
          setComment("");
          setErrorMsg("");
        }).catch(err => {
          console.log(err.response.data);
        })
      }
      // if rep less than 50, show error -> backend turd get on this
      
      // voting w/ no rep is allowed
      // console.log("Add comment:", comment);
    };

        // Separate handling for question and answer comment popups
        const showPopup = answerId ? showAnswerPopup : showQuestionPopup;
        const setShowPopup = answerId ? setShowAnswerPopup : setShowQuestionPopup;
  
    return (
      <div className="relative">
        <button className="text-gray-500 mt-2 underline ml-8" onClick={() => setShowPopup(true)}>
          Add a comment
        </button>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <textarea
                  className="w-full h-24 p-2 mb-2 border border-gray-300 rounded"
                  placeholder="Enter your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                {errorMsg && <div className="text-red-500">{errorMsg}</div>}
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                    onClick={handleAddComment}
                  >
                    Add Comment
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded ml-2"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleQuestionUpvote = (e) => {
    axios.put(`http://localhost:8000/put/increaseQuestionVote/${currQuestionId}`,{},{
      withCredentials: true
    }).then(response => {
      setQuestion(response.data); // update question to render new upvote amount
    }).catch(err => {
      console.log(err.response.data)
    })
  }

  const handleQuestionDownvote = (e) => {
    axios.put(`http://localhost:8000/put/decreaseQuestionVote/${currQuestionId}`,{},{
      withCredentials: true
    }).then(response => {
      setQuestion(response.data); // update question to render new upvote amount
    }).catch(err => {
      console.log(err.response.data)
    })
  }

  const handleAnswerUpvote = (e) => {
    axios.put(`http://localhost:8000/put/increaseAnswerVote/${e.target.id}`,{},{
      withCredentials: true
    }).then(response => {
      setAnswers(answers.map(a => a._id === e.target.id ? response.data : a)); // replace the old answer to render new vote amonut
    }).catch(err => {
      console.log(err.response.data)
    })
  }

  const handleAnswerDownvote = (e) => {
    axios.put(`http://localhost:8000/put/decreaseAnswerVote/${e.target.id}`,{},{
      withCredentials: true
    }).then(response => {
      setAnswers(answers.map(a => a._id === e.target.id ? response.data : a)); // replace the old answer to render new vote amonut
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
            <div className="text-gray-600">posted by: {askedBy}</div>
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
            {renderComments(question.comment)}
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
            {renderComments(answer.comment)}
            {renderCommentButton(answer._id)}
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
