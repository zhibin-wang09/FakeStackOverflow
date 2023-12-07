import { useState, useEffect } from 'react';
import axios from 'axios';
import ShortInput from './short_input';
import TextArea from './textarea';
import extractLinks from '../processInput';

export default function UpdateQuestion( {questionId, handlePageChange}) {
    const [question, setQuestion] = useState({});
    const [title, setTitle] = useState('');
    const [questionText, setQuestionText] = useState('');

    const [tags, setTags] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isTitleMoreThan100Char, setIsTitleMoreThan100char] = useState(false);
    const [isMoreThan5Tags, setIsMoreThan5Tags] = useState(false);
    const [isEachTagMoreThan10Char, setIsEachTagMoreThan10Char] = useState(false);
    const [isInvalidHyperlink, setIsInvAlidHyperLink] = useState(false);

    useEffect(() => {
        console.log(questionId);
        axios.get(`http://localhost:8000/get/questions/${questionId}`)
            .then((response) => {
                const { title, text,tags } = response.data;
                setTitle(title);
                setQuestionText(text);
                let tagsString = ""; // convert tag array into string
                for(const i in tags){
                    tagsString = tagsString.concat(tags[i].name + " "); // append the names to the string
                }
                if(tagsString.length != 0) tagsString.slice(0,tagsString.length -1); // remove the last space
                setTags(tagsString); // set the tag
            })
            .catch((error) => {
                console.error('Error fetching question:', error);
            });
    }, [questionId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        if(tags.length === 0) return;
        let tagsarr = tags.toLowerCase().trim().split(" ");
        let titlet = title.trim();
        let text = questionText.trim();

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
            axios.put(`http://localhost:8000/put/modifyQuestion/${questionId}`,{
                text: text,
                title: titlet,
                tags, tagsarr
            },{
                withCredentials: true
            }).then(response => {
                console.log(response);
                handlePageChange({target: {id: 'profile-page'}});
            }).catch(err => {
                console.log(err);
            })
        }
    };

    return (
        <div className="w-5/6 mt-4 ">
            <div className="mx-8">
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
                        Edit Question
                    </button>
                </form>
            </div>
        </div>
        );
}