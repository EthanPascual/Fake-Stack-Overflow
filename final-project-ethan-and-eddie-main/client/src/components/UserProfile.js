import { useState, useEffect } from "react";
import axios from "axios";

export default function UserProfile({ userId, username, setQuestionId, setContent, tagId, setTagId, setInUser, admin, adminName, adminId, setUsername, setUserId }) {

    let [questionsList, setQuestionsList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/questions').then(res => { setQuestionsList(res.data) });
    }, []);

    let [usersList, setUsersList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/users').then(res => { setUsersList(res.data) });
    }, []);

    let [tagsList, setTagsList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/tags').then(res => { setTagsList(res.data) });
    }, []);

    let [answersList, setAnswersList] = useState([]);
    useEffect(() => {
       axios.get('http://localhost:8000/answers').then(res => { setAnswersList(res.data) });
    }, []);

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    const formatDate = (question) => {
        let convertDate = new Date(question.ask_date_time);
        let normalDate = convertDate.toLocaleString('en-US', options).replace(/,([^,]*)$/, ' at$1');
        const today = new Date();
        const currentDayTime = Math.floor((today.getTime() - convertDate.getTime()) / 1000);
        let minNum = Math.floor(currentDayTime / 60);

        if (today.getFullYear() == convertDate.getFullYear()) {
            let hourNum = Math.floor(minNum / 60);
            if (currentDayTime < 60) {

                return (`${currentDayTime} seconds ago`);

            }
            else if (currentDayTime < 3600) {

                if (minNum < 2) {
                    return (`${minNum} minute ago`);
                }
                else {
                    return (`${minNum} minutes ago`);
                }
            }
            else if (hourNum < 24) {

                if (hourNum < 2) {
                    return (`${hourNum} hour ago`);
                }
                else {
                    return (`${hourNum} hours ago`);
                }
            } else {
                normalDate = normalDate.replace(`, ${today.getFullYear()}`, '')
                return (`${normalDate}`)
            }

        }
        else {
            return (`${normalDate}`);
        }
    }

    const formatDateUser = (user) => {
        let convertDate = new Date(user.join_date);
        let normalDate = convertDate.toLocaleString('en-US', options).replace(/,([^,]*)$/, ' at$1');
        const today = new Date();
        const currentDayTime = Math.floor((today.getTime() - convertDate.getTime()) / 1000);
        let minNum = Math.floor(currentDayTime / 60);

        if (today.getFullYear() == convertDate.getFullYear()) {
            let hourNum = Math.floor(minNum / 60);
            if (currentDayTime < 60) {

                return (`${currentDayTime} seconds ago`);

            }
            else if (currentDayTime < 3600) {

                if (minNum < 2) {
                    return (`${minNum} minute ago`);
                }
                else {
                    return (`${minNum} minutes ago`);
                }
            }
            else if (hourNum < 24) {

                if (hourNum < 2) {
                    return (`${hourNum} hour ago`);
                }
                else {
                    return (`${hourNum} hours ago`);
                }
            } else {
                normalDate = normalDate.replace(`, ${today.getFullYear()}`, '')
                return (`${normalDate}`)
            }

        }
        else {
            return (`${normalDate}`);
        }
    }

    const changeQuestion = (questionId) => {
        setQuestionId(questionId);
        setContent('ModifyQuestion');
    }

    const filterForTag = (id) => {
        setTagId(id);
        setInUser(false);
        if(admin){setUsername(adminName); setUserId(adminId);}
        setContent('Questions');
    }

    const deleteAnswer = (id) => {
        console.log(answersList)
        const answer = answersList.find(answer => answer._id === id);
        if (answer) {
            const deletedAnswerComments = answer.comments;
            deletedAnswerComments.forEach(element => {deleteComment(element)});
        }
        
        
        axios.delete(`http://localhost:8000/answers/delete/${id}`)
            .then(response => {
                console.log('Successfully deleted answer');
            })
            .catch(error => {
                console.error(error)
            });
    }

    const deleteComment = (id) => {
        axios.delete(`http://localhost:8000/comments/delete/${id}`)
            .then(response => {
                console.log('Successfully deleted comment');
            })
            .catch(error => {
                console.error(error)
            });
    }
    
    const deleteQuestion = (id) => {
        let deletedQuestionAnswers = questionsList.find(question => question._id == id).answers;
        console.log(deletedQuestionAnswers)
        deletedQuestionAnswers.forEach(element => {deleteAnswer(element)});

        let deletedQuestionComments = questionsList.find(question => question._id == id).comments;
        console.log(deletedQuestionComments);
        deletedQuestionComments.forEach(element => {deleteComment(element)});

        axios.delete(`http://localhost:8000/questions/delete/${id}`)
            .then(response => {
                console.log('Successfully deleted question');
                const updatedQuestions = questionsList.filter(question => question._id !== id);
                setQuestionsList(updatedQuestions);
            })
            .catch(error => {
                console.error(error)
            });
    }

    let currentUser = usersList.find(user => user._id == userId);
    const askedQuestions = questionsList.filter(question => question.asked_by == userId);
    let tableItems = askedQuestions.map(
        question =>
            <tr>
                <td>{question.answers.length} answers<br />{question.views} views</td>
                <td>
                    <a class="questionLink" onClick={() => changeQuestion(question._id)}>{question.title}</a><br />
                    {tagsList.filter((tag) => { return question.tags.includes(tag._id) }).map(tagButton => <button className='tagButton' onClick={() => filterForTag(tagButton._id)}>{tagButton.name}</button>)}
                </td>
                <td>{question.upVotes.length - question.downVotes.length} Votes</td>
                <td>{username} asked  {formatDate(question)}</td>
                <td>
                    <button onClick={() => deleteQuestion(question._id)}>Delete Question</button>
                </td>
            </tr>
    );
    if(tableItems.length == 0){
        tableItems = <p>You have not yet asked any questions</p>
    }
    const answerMap = answersList.map(answer => <></>);
    let repNum = 0;
    if(usersList.length > 0){
        repNum = usersList.find(user => user._id == userId).rep
    }
   if(currentUser && answersList.length > 0){
    return (
        <>
            <div className="main">
                <h1>User Profile: {username}</h1>
                <h2>Reputation: {repNum}</h2>
                <p>Joined {formatDateUser(currentUser)}</p>
                <h3>Questions Asked</h3>
                <table id="questionTable">{tableItems}</table>
                {answerMap}
            </div>


        </>

    );
   }else{
    return(<></>);
   }

}