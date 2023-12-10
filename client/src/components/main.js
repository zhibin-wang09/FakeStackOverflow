import DisplayContainer from "./displaycontainer";
import Popup from "./popup";
import React from 'react';

export default function Main(props) {
  const handlePopupClose = (action) => {
    props.setShowPopup(false);
    if (action === 'signup') {
      console.log('signup');
      // Go to signup page
      props.handlePageChange({ target: { id: 'signup' } });
    } else if (action === 'login') {
      // Go to login page
      props.handlePageChange({ target: { id: 'login' } });  
      console.log('login');
    }
  };

  const closePopup = (action) => {
    props.setShowPopup(false);
    handlePopupClose(action); // Pass the action to handlePopupClose
  };

  let display = (
    <DisplayContainer
      handleInputChange={props.handleInputChange}
      page={props.sortAndPage.page}
      data={props.data}
      onQuestionClick={props.onQuestionClick}
      currentQuestion={props.currentQuestion}
      postQuestion={props.postQuestion}
      backToQuestions={props.backToQuestions}
      handlePageChange={props.handlePageChange}
      postAnswer={props.postAnswer}
      backToQuestionsFromTags={props.backToQuestionsFromTags}
      currQuestionId={props.currQuestionId}
      userId={props.userId}
    />
  );

  return (
    <>
      {props.showPopup && <Popup closePopup={closePopup} setShowPopup={props.setShowPopup} showPopup={props.showPopup}/>}
      {display}
    </>
  );
}
