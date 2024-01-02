import { useState,useEffect } from "react";
import axios from "axios";

export default function ModifyQuestionPage({displayContent, resetTags, userId, questionId}) {
    console.log(questionId);
    let [tagsList,setTags] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/tags').then(res => {setTags(res.data)});
    }, [])
    let [questionsList,setQuestions] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/questions').then(res => {setQuestions(res.data)});
    }, [])
    
    const tagIdsArray = ([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(e.target.questionTitle.value == "" || e.target.questionText.value == "" || e.target.questionTags.value == "" || e.target.questionSum.value == ""){
            e.preventDefault();
            document.getElementById('InvalidCheck').innerHTML = 'Invalid Input';

        }
        else{
        document.getElementById('InvalidCheck').innerHTML = '';
        const tags = e.target.questionTags.value.split(" ");
        async function addTagSchema(tag){
        
            if(tagsList.find((existTag) => existTag.name === tag)){
                const tagExistIds = tagsList.find((existTag) => existTag.name === tag)._id;
                tagIdsArray.push(tagExistIds);
            }
            else{
                   
                    await axios.post('http://localhost:8000/newTags',{
                    name: tag
                    })
                    const res = await axios.get('http://localhost:8000/tags');
                    tagsList = res.data;
                    console.log(tagsList);
                    const newTag = tagsList.find(newTag => newTag.name === tag)._id;
                    console.log(newTag);
                    tagIdsArray.push(newTag);

            } 

        }
        await Promise.all(tags.map(addTagSchema));
        console.log(tagIdsArray);
        console.log(userId);
        try {
            await axios.put(`http://localhost:8000/questions/${questionId}`, {
              title: e.target.questionTitle.value,
              text: e.target.questionText.value,
              tags: tagIdsArray,
              sum: e.target.questionSum.value
            });
          } catch (error) {
            console.error(error);
          }
        resetTags('');
        displayContent('UserProfile');
        }
    }
if(questionsList.length > 0){
    return (
        <>
            <div className="askQuestionPage">
                <h1>Changing Question: {questionsList.find(question => question._id == questionId).title}</h1>
                <h2>Question Title*</h2>
                <p><i>Limit title to 100 characters or less</i></p>
                <form onSubmit={handleSubmit}>
                    <input type="text" id="qTitle" name="questionTitle" maxLength="100" /><br />


                    <h2>Question Text*</h2>
                    <p><i>Add details</i></p>

                    <input type="text" id="qText" name="questionText" /><br />

                    <h2>Question Summary*</h2>
                    <p><i>Add details</i></p>

                    <input type="text" id="qSum" name="questionSum" /><br />


                    <h2>Tags*</h2>
                    <p><i>Add keywords separated by whitespace</i></p>

                    <input type="text" id="qTags" name="questionTags" /><br />

                    <h2 id="InvalidCheck" className="InvalidCheck"></h2>
                    <button type = "submit" className="postButton">Change Question</button>
                </form>
            </div>

        </>
    );

} else {
    return(<>
    </>);
}
    
    }