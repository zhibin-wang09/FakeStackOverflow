import Question from './question.js';
import TagGroup from './taggroup.js';
import AskQuestion from './askquestion.js';
import PostAnswer from './postanswer.js';
import QuestionPage from './questionpage.js';

export default function DisplayContainer(props){

    const content = props.page;
    const data = props.data;
    let displayContent = null;
    if(content === 'question-page'){
        displayContent = data.map(d => 
        <Question 
            key={d._id} 
            qid = {d._id}
            views={d.views} 
            title ={d.title} 
            askedBy ={d.asked_by} 
            askDate={d.ask_date_time}
            onQuestionClick = {props.onQuestionClick}
            tagIds = {Object.keys(d.tags).map(t => [d.tags[t]._id , d.tags[t].name])}
            >
        </Question>);
    }else if(content === 'tag-page'){
        displayContent = <TagGroup updateQuestion = {props.postQuestion} backToQuestionsFromTags = {props.backToQuestionsFromTags}></TagGroup>
    }else if(content === 'ask-question'){
        displayContent= <AskQuestion backToQuestions={props.backToQuestions} askQuestion = {props.postQuestion}></AskQuestion>
    }else if(content === 'post-answer'){
        displayContent= <PostAnswer currQuestionId ={props.currQuestionId} backToQuestions={props.backToQuestions} answerQuestion = {props.postAnswer}></PostAnswer>
    }else if(content === 'detail'){
        displayContent = <QuestionPage handlePageChange={props.handlePageChange}currQuestionId = {props.currQuestionId}/>
    }

    return (
        <div className='mx-8 mt-4'>
            {displayContent}
        </div>
    )
}   