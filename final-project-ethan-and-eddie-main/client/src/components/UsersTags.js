import { useState,useEffect } from "react";
import axios from "axios";
export default function UsersTags({displayContent, selectTag, username, userId, setInUsers, setChangeTagId, admin, adminName, adminId, setUsername, setUserId}) {
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
        if(admin){setUsername(adminName); setUserId(adminId);}
        setInUsers(false);
        displayContent('Questions');
    }
    const itemsPerRow = 3;
    const rows = [];

    const userQuestions = questionsList.filter(question => question.asked_by === userId);
    const userTags = tagsList.filter(tag => userQuestions.some(question => question.tags.includes(tag._id)));

    const removeTagFromQuestion = (id, tagId) => {
        const currentQuestion = questionsList.find(question => question._id === id);
        const updatedTags = currentQuestion.tags.filter(tag => tag !== tagId);
        axios.put(`http://localhost:8000/questions/${id}`, {tags: updatedTags})
                  .then(response => {
                    console.log(`Successfully removed answer tag from question`);
                  })
                  .catch(error => {
                    console.error(`Error removing answer tag from question`, error);
                  });
    }
    
    const deleteTag = (id) => {
        console.log(questionsList);
        console.log(id);
        let questionsWithSpecificTag = questionsList.filter(question => question.tags.includes(id));
        if(questionsWithSpecificTag){
            console.log(questionsWithSpecificTag);
            if(questionsWithSpecificTag.some(question => question.asked_by !== userId)){
                console.log("can't delete tag if there are other users also using that tag");
                document.getElementById('checkDelete').innerHTML = "This tag is being used by another user";
                return;
            }else{
                questionsWithSpecificTag.forEach(element => {removeTagFromQuestion(element._id, id)});
                axios.delete(`http://localhost:8000/tags/delete/${id}`)
                .then(response => {
                    console.log('Successfully deleted tag');
                    let updatedTagsList = tagsList.filter(tag => tag._id !== id);
                    setTags(updatedTagsList);
                })
                .catch(error => {
                    console.error(error)
                });
            }
        }
    }

    const editTag = (id) => {
        let questionsWithSpecificTag = questionsList.filter(question => question.tags.includes(id));
        if(questionsWithSpecificTag){
            console.log(questionsWithSpecificTag);
            if(questionsWithSpecificTag.some(question => question.asked_by !== userId)){
                console.log("can't delete tag if there are other users also using that tag");
                document.getElementById('checkDelete').innerHTML = "This tag is being used by another user";
                return;
            }else{
                setChangeTagId(id);
                displayContent('EditTags');
            }
        }
    }
    
    for (let i = 0; i < userTags.length; i += itemsPerRow) {
        const rowItems = userTags.slice(i, i + itemsPerRow).map(tag =>
            <td>
            <div class="tagCell">
            <a class="questionLink" onClick={() => displayQuestionsForTag(tag._id)}>{tag.name}</a>
            <p>{questionsList.filter(question => question.tags.includes(tag._id)).length} Questions</p>
            <div>
                <button className="editButtons" onClick={() => editTag(tag._id)}>Edit</button>
                <button className="editButtons" onClick={() => deleteTag(tag._id)}>Delete</button>
            </div>
            </div>
            </td>
        );

        const row = <tr>{rowItems}</tr>;
        rows.push(row);
    }
let tableItems;
if(rows.length > 0){
    tableItems = <table>{rows}</table>;
} else {
    tableItems = <p>You have not yet created any tags</p>
}


    return (
        <>
            <div className="main">
                <h1>{username}'s Tags</h1>
                <h1> {userTags.length} Tags</h1>
                <p className="InvalidCheck" id="checkDelete"></p>
                <table id='tagTable'>{tableItems}</table>
            </div> 
        </>
        
    );
    
    }