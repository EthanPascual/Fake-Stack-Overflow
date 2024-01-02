import { useState,useEffect } from "react";
import axios from "axios";

export default function AskQuestionPage({displayContent, resetTags, userId}) {
    let [usersList, setUsersList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/users').then(res => { setUsersList(res.data) });
    }, []);

    let [tagsList,setTags] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/tags').then(res => {setTags(res.data)});
    }, [])

    
    const tagIdsArray = ([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(e.target.questionTitle.value == "" || e.target.questionText.value == "" || e.target.questionTags.value == "" || e.target.questionSum.value == ""){
            e.preventDefault();
            document.getElementById('InvalidCheck').innerHTML = 'Invalid Input! you must not leave any box empty!';

        }
        else{
        document.getElementById('InvalidCheck').innerHTML = '';
        const tags = e.target.questionTags.value.split(" ");
        const tagsListNames = tagsList.map((tag) => tag.name);
        console.log(tagsListNames);
        if(usersList.find((user) => user._id === userId).rep < 50 && !tags.every((tagN) => tagsListNames.includes(tagN)) && !usersList.find((user) => user._id === userId).admin){
            e.preventDefault();
            console.log(tags.every((tagN) => tagsList.includes(tagN)));
            document.getElementById('InvalidCheck').innerHTML = 'Sorry you cannot create a new tag, your reputation is below 50!';
        }else if(e.target.questionSum.value.length > 140){
            document.getElementById('InvalidCheck').innerHTML = 'Sorry summarys are only allowed to be 140 characters or shorter!';
        }
        else if(e.target.questionTitle.value > 100){
            document.getElementById('InvalidCheck').innerHTML = 'Sorry titles are only allwed to be 100 character or shorter!';
        }
        else{
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
                    const newTag = tagsList.find(newTag => newTag   .name === tag)._id;
                    console.log(newTag);
                    tagIdsArray.push(newTag);

            } 

        }
        await Promise.all(tags.map(addTagSchema));
        console.log(tagIdsArray);
        console.log(userId);
        await axios.post('http://localhost:8000/newQuestions',{
                title: e.target.questionTitle.value,
                text: e.target.questionText.value,
                tags: tagIdsArray,
                answers: [],
                asked_by: userId,
                ask_date_time: new Date(),
                views: 0,
                upVotes: [],
                downVotes: [],
                sum: e.target.questionSum.value
        });
        resetTags('');
        displayContent('Questions');
        }
        }
    }

    return (
            <>
                <div id="askQuestionPage" className="askQuestionPage">
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
                        <button type = "submit" className="postButton">Post Question</button>
                    </form>
                </div>

            </>
        );
    
    }