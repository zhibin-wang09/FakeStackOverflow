import React, { useState, useEffect } from "react";
import axios from 'axios';
import formatTimeSince from "../formattime";
import extractLinks from "../processInput.js";

function sortByTimeAnswer(){
  let sorttime = (a, b) => {
      let currentTime = new Date();
      let aDif = currentTime - new Date(a.ans_date_time);
      let bDif = currentTime - new Date(b.ans_date_time);
      return aDif - bDif;
  }
  return sorttime
}

function sortByTimeComment(){
  let sorttime = (a, b) => {
    let currentTime = new Date();
    let aDif = currentTime - new Date(a.date);
    let bDif = currentTime - new Date(b.date);
    return aDif - bDif;
}
return sorttime
}


export default function QuestionPage({ handlePageChange, currQuestionId, userId}) {
  const [answers, setAnswers] = useState([]);
  const [askedBy, setAskedBy] = useState("");
  const [question, setQuestion] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [comment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errMsg, setErrMsg] = useState('');
  const [questionComment, setQuestionComment] = useState("");
  const [page, setPage] = useState(0);
  const [answerComments, setAnswerComments] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/get/questions/${currQuestionId}`);
        setQuestion(res.data);
        if(userId !== ""){
          let answers = [];
          res.data.answers.forEach(u => {
            if(u.ans_by._id.toString() === userId){
              answers.push(u);
            }
          })
          answers.sort(sortByTimeAnswer());
          res.data.answers.forEach(u => {
            if(u.ans_by._id.toString() !== userId){
              answers.push(u);
            }
          })
          setAnswers(answers);
        }else{
          setAnswers(res.data.answers)
        }
        setAskedBy(res.data.asked_by.username);
      } catch (error) {
        console.error('Error fetching question details:', error);
      }
    };
    fetchData();
  }, [currQuestionId,userId]);

  const handleNext = () => {
    setStartIndex(startIndex + 5);
  };

  const handlePrev = () => {
    setStartIndex(startIndex - 5);
  };

  const displayAnswers = answers.slice(startIndex, startIndex + 5);

  const renderComments = (comments, targetId, isQuestion) => {
    const commentsPerPage = 3;  
    if (!comments || comments.length === 0) {
      return <div>No comments available</div>; // Placeholder for no comments
    }
    comments = comments.sort(sortByTimeComment());
    const totalPages = Math.ceil(comments.length / commentsPerPage);
    const start = page * commentsPerPage;
    const end = start + commentsPerPage;
  
    const paginatedComments = comments.slice(start, end);
  
    const handleNextPage = () => {
      setPage(page + 1);
    };
  
    const handlePrevPage = () => {
      setPage(page - 1);
    };
  
    return (
      <div>
        {paginatedComments.map((comment) => (
          <div key={comment._id} className="ml-8 mt-2 text-gray-600">
            <div className="flex items-center space-x-2">
              <button className="text-blue-500 hover:text-blue-400" onClick={() => handleCommentUpvote(comment._id, targetId, isQuestion)}>
                Upvote
              </button>
              <strong className="text-gray-500">Votes: {comment.votes} -</strong>  
              <div> {comment.text} </div>
            </div>
          </div>
        ))}
    
        {/* Pagination buttons */}
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-1 border-blue-700 hover:border-blue-500 rounded mx-2"
            onClick={handlePrevPage}
            disabled={page === 0}
          >
            Prev
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-1 border-blue-700 hover:border-blue-500 rounded mx-2"
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
    );    
  };
  
  

  const handleCommentUpvote = (commentId,targetId,isQuestion) => {
    axios.post(`http://localhost:8000/post/increaseCommentVote/${commentId}`,{
      id: targetId,
      isQuestion: isQuestion
    },{
      withCredentials: true
    }).then(res => {
      if(isQuestion){
        setQuestion(res.data);
      }else{
        setAnswers(answers.map(a => {
          if(a._id === res.data._id){
            return res.data;
          }else{
            return a;
          }
        }))
      }
    }).catch(err => {
      setErrMsg(err.response.data);
    })
  };
  
  
  const renderCommentForm = (targetId, isQuestion) => {
    // Function to handle adding comment based on targetId
    const handleAddComment = () => {
      // Check comment length
      if (comment.length > 140) {
        setErrorMsg("Comment should be 140 characters or less.");
        return;
      }
  
      // Determine the API endpoint based on whether it's the main question or an answer
      const endpoint = isQuestion
        ? `http://localhost:8000/post/commentToQuestion/${targetId}`
        : `http://localhost:8000/post/commentToAnswer/${targetId}`;
  
      // Make API call to post comment to the specific target
      axios
        .post(
          endpoint,
          { text: isQuestion ? questionComment : answerComments[targetId] },
          { withCredentials: true }
        )
        .then((res) => {
          // Update state or perform necessary actions upon successful comment addition
          if (isQuestion) {
            setQuestion(res.data);
            setQuestionComment("");
          } else {
            setAnswerComments({ ...answerComments, [targetId]: "" });
            setAnswers(answers.map(a => {
            if(a._id === res.data._id){
              return res.data;
            }else{
              return a;
            }
          }))
          }
          setErrorMsg("");
        })
        .catch((err) => {
          alert(err.response.data);
        });
    };
  
    // Determine the value and change handler based on whether it's the main question or an answer
    const handleChange = (e) => {
      if (isQuestion) {
        setQuestionComment(e.target.value);
      } else {
        setAnswerComments({ ...answerComments, [targetId]: e.target.value });
      }
    };
  
    return (
      <form className="mt-2 ml-8" onSubmit={(e) => e.preventDefault()}>
        <textarea
          className="w-full h-24 p-2 mb-2 border border-gray-300 rounded"
          placeholder="Enter your comment..."
          value={isQuestion ? questionComment : answerComments[targetId]}
          onChange={handleChange}
        ></textarea>
        {errorMsg && <div className="text-red-500">{errorMsg}</div>}
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      </form>
    );
  };
  
  

  const handleQuestionUpvote = (e) => {
    setErrMsg("");
    axios.put(`http://localhost:8000/put/increaseQuestionVote/${currQuestionId}`,{},{
      withCredentials: true
    }).then(response => {
      setQuestion(response.data); // update question to render new upvote amount
    }).catch(err => {
      setErrMsg(err.response.data);
    })
  }

  const handleQuestionDownvote = (e) => {
    setErrMsg("");
    axios.put(`http://localhost:8000/put/decreaseQuestionVote/${currQuestionId}`,{},{
      withCredentials: true
    }).then(response => {
      setQuestion(response.data); // update question to render new upvote amount
    }).catch(err => {
      setErrMsg(err.response.data);
    })
  }

  const handleAnswerUpvote = (e) => {
    setErrMsg("");
    axios.put(`http://localhost:8000/put/increaseAnswerVote/${e.target.id}`,{},{
      withCredentials: true
    }).then(response => {
      setAnswers(answers.map(a => a._id === e.target.id ? response.data : a)); // replace the old answer to render new vote amonut
    }).catch(err => {
      setErrMsg(err.response.data);
    })
  }

  const handleAnswerDownvote = (e) => {
    setErrMsg("");
    axios.put(`http://localhost:8000/put/decreaseAnswerVote/${e.target.id}`,{},{
      withCredentials: true
    }).then(response => {
      setAnswers(answers.map(a => a._id === e.target.id ? response.data : a)); // replace the old answer to render new vote amonut
    }).catch(err => {
      setErrMsg(err.response.data);
    })
  }

  const editAnswer = (answerId) => { // change to edit question page
    handlePageChange({target: {id: "edit-answer"}, questionId: answerId});
  }

  const deleteAnswer = (answerId) => {
    axios.post(`http://localhost:8000/post/deleteAnswer/${answerId}`,{
      questionId : currQuestionId
    },{
      withCredentials: true
    })
    .then(res => {
      setAnswers(answers.filter(a => a._id.toString() !== answerId));
    }).catch(err => {
      console.log(err);
    })
  };

  return (
    <div>
      <strong className="text-rose-600">{errMsg}</strong>
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
          {renderComments(question.comment, question._id, true)}
          {renderCommentForm(question._id, true)}
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
            <button className="text-red-500 mr-4" onClick={handleAnswerDownvote} id = {answer._id}>
              Downvote
            </button>
            {(userId !== "" && userId === answer.ans_by._id.toString()) ? <button className="text-red-500 mr-4" onClick={() => editAnswer(answer._id)}>
              Edit
            </button> : ""}
            {(userId !== "" && userId === answer.ans_by._id.toString()) ? <button className="text-red-500" onClick={() => deleteAnswer(answer._id)}>
              Delete
            </button> : ""}
            <div className="text-gray-500 mt-1">Votes: {answer.votes}</div>
          </div>
          <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Comments:</h3>
        {renderComments(answer.comment, answer._id, false)}
        {renderCommentForm(answer._id)}
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
