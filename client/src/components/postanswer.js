import { useState } from 'react';
import ShortInput from './short_input';
import TextArea from './textarea';
import axios from 'axios'; // Import Axios

export default function PostAnswer(props) {
    const [questionText, setQuestionText] = useState("");
    const [username, setUsername] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        const trimmedQuestionText = questionText.trim();
        const trimmedUsername = username.trim();

        if (trimmedQuestionText !== "" && trimmedUsername !== "") {
            // Post answer to backend
            axios.post(`http://localhost:8000/post/answer/${props.currQuestionId}`, {
                text: trimmedQuestionText,
                ans_by: trimmedUsername
            })
            .then(response => {
                // Handle successful post
                // You can also update the UI or redirect the user as needed
                            // Go back to main page
                props.backToQuestions();
                // Reset form fields
                setQuestionText("");
                setUsername("");
            })
            .catch(error => {
                console.error('Error posting answer:', error);
            });

        }
    };

    return (
        <div className="w-5/6 mt-4 ">
            <div className="mx-8">
                <form id="post-answer-form" action="#" className="space-y-4" onSubmit={handleSubmit}>
                <ShortInput
                    label="Username* (Posting under this name)"
                    value={username}
                    setValue={setUsername}
                    errorMessage={(username ? "" : "This field is required") || (username.length > 100 ? "Title must be 100 characters or less" : "") 
                    || (username.trim() !== "" ? "" : "Username must not be only spaces")
                    }
                    id="question-title"
                    placeholder="Write a title..."  
                    submitted={submitted}
                />
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