import axios from "axios";
import React, { useEffect, useState } from "react";

function daysPassedSinceISODate(isoDate) {
  const currentDate = new Date();
  const isoDateObject = new Date(isoDate);

  // Calculate the difference in milliseconds
  const timeDifference = currentDate - isoDateObject;

  // Convert milliseconds to days
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  if(isNaN(daysPassed)){
    return "";
  }
  return daysPassed;
}

export default function ProfilePage(props) {
  // placeholder data that I use for testing this crap cus idk what backend doin 
  const [user, setUser] = useState({});
  const [questionAnswered, setQuestionAnswered] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [tags,setTags] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setErrMsg("");
    axios.get('http://localhost:8000/profile',{
      withCredentials: true
    })
    .then(response => {
      setUser(response.data.u[0]);
      setQuestions(response.data.q);
      setTags(response.data.t);
      setIsAdmin(response.data.u[0].role === 'normal' ? false : true); // sets if the user is admin or not
      setQuestionAnswered(response.data.qAnswered);
    }).catch(err => {
      setErrMsg(err.response.data);
    })
  },[])

  useEffect(() => {
    if(!isAdmin){
      return;
    }
    setErrMsg("");
    axios.get('http://localhost:8000/admin/profile',{
      withCredentials: true
    }).then(res => {
      setUsers(res.data);
    }).catch(err => {
      console.log("error" ,err)
    })
  },[isAdmin])

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
      setTags(res.data.t);
      setQuestionAnswered(res.data.qAnswered);
    }).catch(err => {
      console.log(err);
    })
  };


  const editTag = (tagId) => {
    // do later
    props.handlePageChange({target: {id : 'edit-tag'}, questionId : tagId});
  };

  const deleteTag = (tagId) => {
    console.log(tagId);
    axios.post(`http://localhost:8000/post/deleteTag/${tagId}`, {},{
      withCredentials: true
    }).then(res => {
      setTags(res.data);
    }).catch(err => {
      console.log(err);
    })
  };


  const deleteUser = (userId) => {
    axios.post(`http://localhost:8000/post/deleteUser/${userId}`, {},{
      withCredentials: true
    }).then(res => {
      setUsers(res.data);
    }).catch(err => {
      console.log(err);
    })
  }

  const switchProfile = (userId) => {
    console.log("reqreq")
    axios.get(`http://localhost:8000/profile/${userId}`,{
      withCredentials: true
    })
    .then(response => {
      console.log(response);
      setUser(response.data.u[0]);
      setQuestions(response.data.q);
      setTags(response.data.t);
      setIsAdmin(response.data.u[0].role === 'normal' ? false : true); // sets if the user is admin or not
      setQuestionAnswered(response.data.qAnswered);
    }).catch(err => {
      setErrMsg(err.response.data);
    })
  }

  // this function should take the site to the question detail page
  const toQuestionDetail = (questionId) => {
    props.handlePageChange({target : {id: 'detail'}, id: user._id.toString(), questionId : questionId})
  }

  const renderAdminInfo = () => {
    return (
      <div className="mx-8 mt-4"> 
        <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Profile</h2>
        <strong className="text-rose-600">{errMsg}</strong>
        </div>

        <div className="bg-gray-100 p-4 mt-4 rounded-md shadow-md">
          <div className="flex items-center space-x-4 mb-4">
            <div>
              <p className="text-xl font-bold">{user.username}</p>
              <p>Member for: {daysPassedSinceISODate(user.memberSince)} days</p>
              <p>Reputation: {user.reputation}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Users</h3>
            <h5 className="text-lg font-bold mb-2">Total users: {users.length}</h5>
            <ul>
              {users.map(u => {
                  return (<li id ={u._id} key={u._id} className="mb-2">
                      <strong className= "text-blue-500 hover:underline" onClick={() => switchProfile(u._id)}>
                        {u.email}
                      </strong>
                      <button className="ml-2 text-sm text-red-500" onClick={() => deleteUser(u._id)}>
                        Delete
                      </button>
                  </li>)
                })
              }
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if(isAdmin){
    return renderAdminInfo();
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
            <p>Member for: {daysPassedSinceISODate(user.memberSince)} days</p>
            <p>Reputation: {user.reputation}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">My Questions</h3>
          <ul>
            {questions.map((question) => (
              <li id= {question._id} key={question._id} className="mb-2">
                <strong
                  onClick={() => editQuestion(question._id)}
                  className="text-blue-500 hover:underline"
                >
                  {question.title}
                </strong>
                <button
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
                {(
                  <>
                    <button
                      className="ml-2 text-sm text-gray-500"
                      onClick={() => editTag(tag._id)} // Fix: Pass tag.id instead of tag._id
                    >
                      Edit
                    </button>
                    <button
                      className="ml-2 text-sm text-red-500"
                      onClick={() => deleteTag(tag._id)} // Fix: Pass tag.id instead of tag._id
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
            {questionAnswered.map((answeredQuestion) => (
              <li key={answeredQuestion._id} className="mb-2">
                <strong
                  className="text-blue-500 hover:underline"
                  onClick={() => toQuestionDetail(answeredQuestion._id)}
                >
                  {answeredQuestion.title}
                </strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
