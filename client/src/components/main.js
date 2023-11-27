import DisplayContainer from "./displaycontainer";
import React from 'react'

export default function Main(props){


    let display = <DisplayContainer handleInputChange = {props.handleInputChange} page = {props.sortAndPage.page} data = {props.data} onQuestionClick = {props.onQuestionClick} currentQuestion={props.currentQuestion}
                    postQuestion = {props.postQuestion} backToQuestions = {props.backToQuestions} handlePageChange={props.handlePageChange} postAnswer = {props.postAnswer} backToQuestionsFromTags = {props.backToQuestionsFromTags}
                    currQuestionId ={props.currQuestionId}/>;

    return (
            <>
                {display}
            </>
    )
}