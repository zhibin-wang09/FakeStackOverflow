import { useState } from 'react';
import ShortInput from './short_input';
import TextArea from './textarea';
import axios from 'axios'; // Import Axios

export default function PostAnswer(props) {
    const [questionText, setQuestionText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        const trimmedQuestionText = questionText.trim();

        if (trimmedQuestionText !== "") {
            // Post answer to backend
            axios.post(`http://localhost:8000/post/answer/${props.currQuestionId}`, {
                text: trimmedQuestionText,
            })
            .then(response => {
                // Handle successful post
                // You can also update the UI or redirect the user as needed
                            // Go back to main page
                props.backToQuestions();
                // Reset form fields
                setQuestionText("");
            })
            .catch(error => {
                setErrorMsg(error.response.data);
            });

        }
    };

    return (
        <div className="w-5/6 mt-4 ">
            <div className="mx-8">
                <strong className='text-rose-600'>{errorMsg}</strong>
                <form id="post-answer-form" action="#" className="space-y-4" onSubmit={handleSubmit}>
                <TextArea 
                    label="Answer Text* (Answer for post)"
                    value={questionText}
                    setValue={setQuestionText}
                    errorMessage={(questionText ? "" : "This field is required") || (questionText.trim() !== "" ? "" : "Answer must not be only spaces")}
                    id="answer-text"
                    placeholder="Write a description..."
                    submitted={submitted}
                />
                
                    <button type="submit"
                        className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium py-2 px-4 rounded-lg focus:ring-4 focus:ring-blue-200 focus:ring-opacity-50">
                        Post Answer
                    </button>
                </form>
            </div>
        </div>
    )
}