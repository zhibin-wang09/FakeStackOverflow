import DisplayContainer from "./displaycontainer";
import Popup from "./popup";
import React from 'react'
import { useState } from 'react';

export default function Main(props){
    const [showPopup, setShowPopup] = useState(true);

    const closePopup = () => {
      setShowPopup(false);
    };


    let display = <DisplayContainer handleInputChange = {props.handleInputChange} page = {props.sortAndPage.page} data = {props.data} onQuestionClick = {props.onQuestionClick} currentQuestion={props.currentQuestion}
                    postQuestion = {props.postQuestion} backToQuestions = {props.backToQuestions} handlePageChange={props.handlePageChange} postAnswer = {props.postAnswer} backToQuestionsFromTags = {props.backToQuestionsFromTags}
                    currQuestionId ={props.currQuestionId}/>;

    return (
            <>
                {showPopup && <Popup closePopup={closePopup} />}
                {display}
            </>
    )
}