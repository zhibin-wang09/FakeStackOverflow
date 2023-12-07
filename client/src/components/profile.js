import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ProfilePage(props) {
  // placeholder data that I use for testing this crap cus idk what backend doin 
  const [user, setUser] = useState({});
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [tags,setTags] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setErrMsg("");
    axios.get('http://localhost:8000/profile',{
      withCredentials: true
    })
    .then(response => {
      setUser(response.data.u[0]);
      setQuestions(response.data.q);
      setAnswers(response.data.a);
      setTags(response.data.t);
      setIsAdmin(response.data.u[0].role === 'normal' ? false : true); // sets if the user is admin or not
    }).catch(err => {
      setErrMsg(err.response.data);
    })
  },[])

  const editQuestion = (questionId) => {
    // change the display container page to edit-question
    // pass in the questionId to the edit-question page
    props.handlePageChange({target: {id: 'edit-question'}, questionId: questionId});
  };

  
  const deleteQuestion = (questionId) => {
    // do this later
    axios.post(`http://localhost:8000/post/deleteQuestion/${questionId}`,{},{
      withCredentials: true
    })
    .then(res => {
      setQuestions(res.data.q);
    }).catch(err => {
      console.log(err);
    })
  };


  const editTag = (tagId) => {
    // do later
    console.log(`Editing tag with ID ${tagId}`);
  };

  const deleteTag = (tagId) => {
    // do later
    console.log(`Deleting tag with ID ${tagId}`);
  };


  const editAnswer = (answerId) => {
    props.handlePageChange({target: {id: 'edit-answer'}, questionId: answerId});
  };


  const deleteAnswer = (answerId) => {
    // do later
    console.log(`Deleting answer with ID ${answerId}`);
  };

  const renderAdminInfo = () => {
    return (
      <div className="mx-8 mt-4"> 

      </div>
    )
  }

  return (
    <div className="mx-8 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profile</h2>
        <strong className="text-rose-600">{errMsg}</strong>
        
      </div>

      <div className="bg-gray-100 p-4 mt-4 rounded-md shadow-md">
        <div className="flex items-center space-x-4 mb-4">
          <div>
            <p className="text-xl font-bold">{user.username}</p>
            <p>Member since: {user.memberSince}</p>
            <p>Reputation: {user.reputation}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">My Questions</h3>
          <ul>
            {questions.map((question) => (
              <li id= {question._id} key={question._id} className="mb-2">
                <a
                  href={`/questions/${question.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {question.title}
                </a>
                <button id = {question._id}
                  className="ml-2 text-sm text-gray-500"
                  onClick={() => editQuestion(question._id)}
                >
                  Edit
                </button>
                <button id = {question._id}
                  className="ml-2 text-sm text-red-500"
                  onClick={() => deleteQuestion(question._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">My Tags</h3>
          <ul>
            {tags.map((tag) => (
              <li key={tag._id} className="mb-2">
                <span>{tag.name}</span>
                {tag.editable && (
                  <>
                    <button
                      className="ml-2 text-sm text-gray-500"
                      onClick={() => editTag(tag.id)} // Fix: Pass tag.id instead of tag._id
                    >
                      Edit
                    </button>
                    <button
                      className="ml-2 text-sm text-red-500"
                      onClick={() => deleteTag(tag.id)} // Fix: Pass tag.id instead of tag._id
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Questions I've Answered</h3>
          <ul>
            {answers.map((answeredQuestion) => (
              <li key={answeredQuestion._id} className="mb-2">
                <a
                  href={`/questions/${answeredQuestion.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {answeredQuestion.text}
                </a>
                {/* Display user's answer */}
                <button
                  className="ml-2 text-sm text-gray-500"
                  onClick={() => editAnswer(answeredQuestion._id)} // Fix: Pass answeredQuestion.id instead of answeredQuestion._id
                >
                  Edit Answer
                </button>
                <button
                  className="ml-2 text-sm text-red-500"
                  onClick={() => deleteAnswer(answeredQuestion._id)} // Fix: Pass answeredQuestion.id instead of answeredQuestion._id
                >
                  Delete Answer
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
