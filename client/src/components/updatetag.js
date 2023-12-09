import React, {useEffect, useState} from "react"
import axios from 'axios'
import TextArea from "./textarea";

export default function UpdateTag(props){
    const [tagName ,setTagName] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8000/get/tag/${props.questionId}`)
        .then(response => {
            setTagName(response.data.name);
        }).catch(error => {
            console.log(error);
        })
    },[props.questionId])

    function handleSubmit(e){
        axios.put(`http://localhost:8000/put/tagname/${props.questionId}`,{
            name: tagName
        }).then(res => {
            props.handlePageChange({target: {id: 'profile-page'}});
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="w-5/6 mt-4 ">
            <div className="mx-8">
                <form id="post-answer-form" action="#" className="space-y-4" onSubmit={handleSubmit}>
                <TextArea 
                    label="EditTag"
                    value={tagName}
                    setValue={setTagName}
                    id="tag-text"
                    placeholder="Write a description..."
                />
                
                    <button type="submit"
                        className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium py-2 px-4 rounded-lg focus:ring-4 focus:ring-blue-200 focus:ring-opacity-50">
                        Edit Tag
                    </button>
                </form>
            </div>
        </div>
    )
}