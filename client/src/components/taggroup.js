import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TagGroup(props) {
    const [tags, setTags] = useState([]);
    const [questionsByTag, setQuestionsByTag] = useState(new Map());

    useEffect(() => {
        // Fetch all questions from the server
        axios.get('http://localhost:8000/get/questions')
            .then(response => {
                const allQuestions = response.data;
                const tagMap = new Map();
                // Iterate through each question and categorize them based on their tags
                allQuestions.forEach(question => { // build the hashmap from the questions returned. Each question associated with some tags. Assign the tags -> [questions]
                    for(const i in question.tags){
                        if(!tagMap.has(JSON.stringify(question.tags[i]))){ // use JSON.stringify to keep the hashmap stable
                            tagMap.set(JSON.stringify(question.tags[i]), []);
                        }
                        tagMap.get(JSON.stringify(question.tags[i])).push(question);
                    }                 
                });
                let tagsArr = Array.from(tagMap.keys()); // convert map keys to array
                tagsArr = tagsArr.map(a => JSON.parse(a)); // reverse JSON.stringify with JSON.parse to get the object

                setQuestionsByTag(tagMap);
                setTags(tagsArr);
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }, []);

    const handleTagClick = (tag) => {
        const questions = questionsByTag.get(JSON.stringify(tag)); // search the questions associated with clicked tag
        props.updateQuestion(questions); // update the question to the associated tag
        props.backToQuestionsFromTags(); // back to home page
    };

    return (
        <div className="py-4 px-6">
            <div className="text-lg mb-4">All Tags: {tags.length > 0 ? tags.length + " Tag(s)" : "No tags found."}</div>
            {tags.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {tags.map(tag => (
                        <div key={tag._id} className="border-dotted border-2 p-4 hover:bg-gray-100" onClick={() => handleTagClick(tag)}>
                            <button className="text-blue-600 hover:underline">{tag.name}</button>
                            <div>{questionsByTag.get(JSON.stringify(tag)).length || 0} Question(s)</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

