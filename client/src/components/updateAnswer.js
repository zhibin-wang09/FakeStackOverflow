import { useEffect, useState } from 'react';
import TextArea from './textarea';
import axios from 'axios'; // Import Axios

export default function UpdateAnswer(props) {
    const [questionText, setQuestionText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8000/get/answer/${props.questionId}`)
        .then(response => {
            setQuestionText(response.data.text);
        }).catch(error => {
            console.log(error);
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        const trimmedQuestionText = questionText.trim();

        if (trimmedQuestionText !== "") {
            // Post answer to backend
            axios.put(`http://localhost:8000/put/modifyAnswer/${props.questionId}`, {
                text: trimmedQuestionText,
            },{
                withCredentials: true
            })
            .then(response => {
                // Handle successful post
                // You can also update the UI or redirect the user as needed
                            // Go back to main page
                props.handlePageChange({target: {id: 'profile-page'}});
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