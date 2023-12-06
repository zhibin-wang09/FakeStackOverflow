import { useState } from 'react';
import axios from 'axios';
import ShortInput from './short_input';
import TextArea from './textarea';
import extractLinks from '../processInput';

export default function AskQuestion(props) {
    const [title, setTitle] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [tags, setTags] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isTitleMoreThan100Char, setIsTitleMoreThan100char] = useState(false);
    const [isMoreThan5Tags, setIsMoreThan5Tags] = useState(false);
    const [isEachTagMoreThan10Char, setIsEachTagMoreThan10Char] = useState(false);
    const [isInvalidHyperlink, setIsInvAlidHyperLink] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        if(tags.length === 0) return;
        let tagsarr = tags.toLowerCase().trim().split(" ");
        let titlet = title.trim();
        let text = questionText.trim();
        setErrorMsg('');

        // Validation checks
        let isTitleValid = titlet.length <= 100;
        let isTagsValid = tagsarr.length <= 5 && tagsarr.every(tag => tag.length <= 10);
        let isHyperlinkValid = extractLinks(text) !== null;

        setIsTitleMoreThan100char(!isTitleValid);
        setIsMoreThan5Tags(!isTagsValid);
        setIsEachTagMoreThan10Char(!isTagsValid);
        setIsInvAlidHyperLink(!isHyperlinkValid);

        if (!isTitleValid || !isTagsValid || !isHyperlinkValid) {
            return;
        }

        if (titlet && text && tagsarr.length) {
            // Post question to backend
            axios.post('http://localhost:8000/post/questions', {
                title: titlet,
                text: text,
                tags: tagsarr,
            },{
                withCredentials: true
            })
            .then(response => {
                // Handle successful post
                setTitle("");
                setQuestionText("");
                setTags("");
                props.backToQuestions(); // Adjust as needed
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
                <form id="post-question-form" action="#" className="space-y-4" onSubmit={handleSubmit}>
                <ShortInput
                    label="Question Title* (100 characters or less)"
                    value={title}
                    setValue={setTitle}
                    errorMessage={(title ? (isTitleMoreThan100Char ? "Title must be 100 characters or less" : "") : "This field is required") }
                    id="question-title"
                    placeholder="Write a title..."  
                    submitted={submitted}
                />  
                <TextArea 
                    label="Question Details* (be specific!)"
                    value={questionText}
                    setValue={setQuestionText}
                    errorMessage={questionText ? (isInvalidHyperlink ? "Hyperlink must be in format [](https://) or [](http://)" : "") : "This field is required"}
                    id="question-text"
                    placeholder="Write a description..."
                    submitted={submitted}
                />
                    
                    <ShortInput 
                    label = "Tags* (add details!)"
                    value={tags}
                    setValue={setTags}
                    errorMessage={tags ? (isMoreThan5Tags ? "Maximum 5 tags" : (isEachTagMoreThan10Char ? "Each tag can have maximum 10 characters" : "")) : "This field is required"}
                    id="question-text"
                    placeholder=""
                    submitted={submitted}
                />
                    <button type="submit"
                        className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium py-2 px-4 rounded-lg focus:ring-4 focus:ring-blue-200 focus:ring-opacity-50">
                        Post Question
                    </button>
                </form>
            </div>
        </div>
        );
}