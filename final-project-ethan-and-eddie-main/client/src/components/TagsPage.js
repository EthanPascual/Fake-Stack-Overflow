import { useState,useEffect } from "react";
import axios from "axios";
export default function TagsPage({displayContent, selectTag}) {
    // need to restrict that the user must have 50 rep to create a new tag
    let [tagsList,setTags] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/tags').then(res => {setTags(res.data)});
    }, [])

    let [questionsList,setQuestions] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/questions').then(res => {setQuestions(res.data)});
    }, [])

    const displayQuestionsForTag = (tagId) => {
        selectTag(tagId);
        displayContent('Questions');
    }
    
    const itemsPerRow = 3;
    const rows = [];

    for (let i = 0; i < tagsList.length; i += itemsPerRow) {
        const rowItems = tagsList.slice(i, i + itemsPerRow).map(tag =>
            <td>
            <div class="tagCell">
            <a class="questionLink" onClick={() => displayQuestionsForTag(tag._id)}>{tag.name}</a>
            <p>{questionsList.filter(question => question.tags.includes(tag._id)).length} Questions</p>
            </div>
            </td>
        );

        const row = <tr>{rowItems}</tr>;
        rows.push(row);
    }

const tableItems = <table>{rows}</table>;

    return (
        <>
            <div className="main">
                <h1> {tagsList.length} Tags</h1>
                <h1 id='allTagsTitle'>All Tags</h1>
                <table id='tagTable'>{tableItems}</table>
            </div> 
        </>
        
    );
    
    }