import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminUserProfile({ userId, username, setQuestionId, setContent, tagId, setTagId, adminName, adminId, setUsername, setUserId, setInUsers }) {

    let [questionsList, setQuestionsList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/questions').then(res => { setQuestionsList(res.data) });
    }, []);

    let [usersList, setUsersList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/users').then(res => { setUsersList(res.data) });
    }, []);

    let [commentsList, setCommentsList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/comments').then(res => { setCommentsList(res.data) });
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

    const goToUserProfile = (usernameSet, id) => {
        console.log('going to user profile');
        setUsername(usernameSet);
        setInUsers(true);
        setUserId(id);
        setContent('UserProfile');
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
    let error = <p className="InvalidCheck" id="tryDeletingThyself"></p>
    const deleteUser = (id) => {
        const userName = usersList.find((user) => user._id === id).username;
        const confirmed = window.confirm("Are you sure you want to delete the user " + userName + "?" );
        if (confirmed) {
           // The user confirmed the deletion, proceed with the deletion logic
           //document.getElementById('tryDeletingThyself').innerHTML = "";
           let questionsToDelete = questionsList.filter(questions => questions.asked_by === id);
           questionsToDelete.forEach(question => deleteQuestion(question._id));
     
           let answersToDelete = answersList.filter(answers => answers.ans_By === id);
           answersToDelete.forEach(answer => deleteAnswer(answer._id));
     
           let commentsToDelete = commentsList.filter(comments => comments.ans_By === id);
           commentsToDelete.forEach(comment => deleteComment(comment._id));
     
           axios.delete(`http://localhost:8000/users/delete/${id}`)
              .then(response => {
                 console.log('Successfully deleted User');
                 const updatedUsers = usersList.filter(user => user._id !== id);
                 setUsersList(updatedUsers);
              })
              .catch(error => {
                 console.error(error)
              });
        } else {
            return;
           // The user canceled the deletion
           // Handle cancellation if needed
        }
     }
     

    let currentUser = usersList.find(user => user._id === adminId)
    const tableItems = usersList.map(
        user =>
            <tr>
                <td><a class="questionLink" onClick={() => goToUserProfile(user.username, user._id)}>{user.username}</a><br/>{user.admin}</td>
                <td>
                    {user.email}
                </td>
                <td>{user.rep} reputation</td>
                <td>Joined {formatDateUser(user)}</td>
                <td>
                    <button className="editButtons" onClick={() => deleteUser(user._id)}>Delete User</button>
                </td>
            </tr>
    );
    const answerMap = answersList.map(answer => <></>);
    let repNum = 0;
    if(usersList.length > 0){
        repNum = usersList.find(user => user._id == userId).rep
    }
   if(currentUser && answersList.length > 0){
    return (
        <>
            <div className="main">
                <h1>Admin User Profile: {adminName}</h1>
                <h2>Reputation: {repNum}</h2>
                <p>Joined {formatDateUser(currentUser)}</p>
                <h3>Users</h3>
                <table id="questionTable">{tableItems}</table>
                {error}
                {answerMap}
            </div>


        </>

    );
   }else{
    return(<></>);
   }

}