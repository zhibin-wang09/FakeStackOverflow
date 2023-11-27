
export default function SubHeader(props) {

  let questionDisplay = '';
  if (props.currentPage.page === 'question-page') {
    questionDisplay = props.numQuestions > 0 ? `All Questions: ${props.numQuestions} questions` : "No Questions Found!";
  } else if (props.currentPage.page === 'detail') {
    questionDisplay = `# of Answers: ${props.numQuestions}`;
  }

  let questionTitle = props.currentQuestion ? props.currentQuestion : '';

  return (
    <div className="flex justify-between mx-14">
      <h5 id="num-questions" className="text-xl">{questionDisplay}</h5>
      <h5 id="question-name">{questionTitle}</h5>
      <button id='ask-question' className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mx-2" onClick={props.handlePageChange}>
        Ask Question
      </button>
    </div>
  );
}
