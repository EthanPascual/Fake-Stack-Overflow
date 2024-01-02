import { useState, useEffect } from "react";
import axios from "axios";
export default function UserAnswerPage({ questionId, displayContent, username, userId, setAnswerId }) {

    let [answersList, setAnswersList] = useState([]);
    let [voteCounter, setVoteCounter] = useState(0);
    let [questionsList, setQuestionsList] = useState([]);
    let [commentsList, setCommentsList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/comments').then(res => { setCommentsList(res.data) });
    }, []);
    useEffect(() => {
        axios.get('http://localhost:8000/answers').then(res => { setAnswersList(res.data) });
    }, []);
    useEffect(() => {
        axios.get('http://localhost:8000/questions').then(res => { setQuestionsList(res.data) });
    }, []);

    let [usersList, setUsersList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/users').then(res => { setUsersList(res.data) });
    }, []);

    console.log(commentsList);

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    const formatDate = (question) => {
        let convertDate = new Date(question.ans_date_time);
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

    let [currentPage, setCurrentPage] = useState(1);
    let [totalPages, setTotalPages] = useState(1);
    let [currentCommentPage, setCommentCurrentPage] = useState(1);
    let [totalCommentPages, setCommentTotalPages] = useState(1);
    let [currentAnsCommentPage, setAnsCommentCurrentPage] = useState(1);
    let [totalAnsCommentPages, setAnsCommentTotalPages] = useState(1);
    const itemsPerComment = 3;
    const CommentTable = ({ answer, commentsList, usersList }) => {
        const itemsPerAnsComment = 3;

        // Define the initial state for this CommentTable component
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(
            Math.ceil(answer.comments.length / itemsPerAnsComment)
        );

        const handleNextCommentAnsPage = () => {
            if (currentPage === totalPages) {
                return;
            } else {
                // Update the current page state
                setCurrentPage(currentPage + 1);
            }
        };

        const handlePrevCommentAnsPage = () => {
            if (currentPage === 1) {
                return;
            } else {
                // Update the current page state
                setCurrentPage(currentPage - 1);
            }
        };

        const commentsToDisplay = commentsList
            .filter((comment) => answer.comments.includes(comment._id))
            .slice((currentPage - 1) * itemsPerAnsComment, currentPage * itemsPerAnsComment);

        console.log(commentsToDisplay);

        return (
            <>
                <table className="commentTable">
                    {commentsToDisplay.map((comment) => (
                        <tr>
                            <td class="comment">{comment.text}</td>
                            <td class="comment">
                                said by {usersList.find((user) => user._id === comment.ans_By).username}
                            </td>
                            <td>{comment.upVotesComments.length} Votes</td>
                        </tr>
                    ))}
                </table>
                <div>
                    <button onClick={handlePrevCommentAnsPage} disabled={currentPage === 1 || totalPages == 0}>Prev</button>
                    <button onClick={handleNextCommentAnsPage} disabled={currentPage === totalPages || totalPages == 0}>Next</button>
                </div>
            </>
        );
    };

    const itemsPerPage = 5;
    const handleNextCommentPage = () => {
        if (currentCommentPage === totalCommentPages) {
            return;
        }
        else {
            setCommentCurrentPage(currentCommentPage + 1);
        }
    }
    const handlePrevCommentPage = () => {
        if (currentCommentPage === 1) {
            return;
        }
        else {
            setCommentCurrentPage(currentCommentPage - 1);
        }
    }




    const handleNextPage = () => {


        if (currentPage === totalPages) {
            return;
        }
        else {
            setCurrentPage(currentPage + 1);
        }
    }

    const handlePrevPage = () => {
        if (currentPage === 1) {
            return;
        }
        else {
            setCurrentPage(currentPage - 1);
        }
    };

    let question = questionsList.find(question => question._id === questionId);
    useEffect(() => {
        if (question) {
            setVoteCounter(question.upVotes.length - question.downVotes.length);
        }
    }, [question]);

    
    if (question && usersList.length > 0) {

        let questionCommentsList = commentsList;
        let answerCommentsList = commentsList;
        // next/prev for answers page
        totalPages = Math.ceil(answersList.filter((answer) => { return question.answers.includes(answer._id) }).length / itemsPerPage);


        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        answersList = answersList.filter((answer) => { return question.answers.includes(answer._id) }).slice(indexOfFirstItem, indexOfLastItem);


        console.log(answersList);

        console.log(answersList.filter((answer) => { return question.answers.includes(answer._id) }));

        
        //maybe this fixes
        totalCommentPages = Math.ceil(question.comments.length / itemsPerComment);
        const indexOfLastComment = currentCommentPage * itemsPerComment;
        const indexOfFirstComment = indexOfLastComment - itemsPerComment;
        questionCommentsList = commentsList.filter((comment) => { return question.comments.includes(comment._id) }).slice(indexOfFirstComment, indexOfLastComment);
        let commentItems;
        if (usersList.length > 0) {
            commentItems = questionCommentsList.filter((comment) => { return question.comments.includes(comment._id) }).map(
                comment =>
                    <tr>
                        <td class="comment">{comment.text}</td>
                        <td class="comment">said by {usersList.find(user => user._id === comment.ans_By).username}</td>
                        <td>{comment.upVotesComments.length} Votes</td>

                    </tr>


            )
        }

        let tableItemsUser;
        let tableItemsOther;
        if (usersList.length > 0) {
            // Create an object to store state for each answer's CommentTable
            const commentTableState = {};
            answersList.forEach((answer) => {
                commentTableState[answer._id] = {
                    currentPage: 1,
                    totalPages: Math.ceil(answer.comments.length / 3),
                };
            });

            const removeAnswerFromQuestion = (answerId, question) => {
                const updatedAnswers = question.answers.filter(answer => answer !== answerId);
                console.log(updatedAnswers);
                const updatedQuestion = { ...question, answers: updatedAnswers };
                axios.put(`http://localhost:8000/questions/${question._id}`, updatedQuestion)
                  .then(response => {
                    console.log(`Successfully removed answer ${answerId} from question ${question._id}`);
                  })
                  .catch(error => {
                    console.error(`Error removing answer ${answerId} from question ${question._id}`, error);
                  });
              }

            const deleteAnswer = (id) => {
                console.log(answersList)
                const answer = answersList.find(answer => answer._id === id);
                const currentQuestion = questionsList.find(question => question._id === questionId);
                if (answer) {
                    const deletedAnswerComments = answer.comments;
                    deletedAnswerComments.forEach(element => {deleteComment(element)});
                }
        
                if(currentQuestion){
                    removeAnswerFromQuestion(id, currentQuestion);
                }
                axios.delete(`http://localhost:8000/answers/delete/${id}`)
                    .then(response => {
                        console.log('Successfully deleted answer');
                        let updatedAnswersList = answersList.filter(answer => answer._id != id)
                        setAnswersList(updatedAnswersList);
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

            const editAnswer = (id) => {
                setAnswerId(id);
                displayContent('EditAnswers');
            }

            tableItemsUser = answersList.filter((answer) => {
                return question.answers.includes(answer._id) && answer.ans_By === userId;;
            }).map((answer) => {
                let answersComment = answerCommentsList.filter((comment) => answer.comments.includes(comment._id));
                return (
                    <tr>
                        <td>{answer.text}</td>
                        <td>
                            <CommentTable
                                answer={answer}
                                commentsList={answersComment}
                                usersList={usersList}
                                commentTableState={commentTableState}
                            />
                        </td>
                    
                        <td>{answer.upVotesAns.length - answer.downVotesAns.length} Votes</td>
                        <td>
                            <button className="editButtons" onClick={() => editAnswer(answer._id)}>Edit</button>
                            <button className="editButtons" onClick={() => deleteAnswer(answer._id)}>Delete</button>
                        </td>
                        {usersList.find((user) => user._id === answer.ans_By) && (
                            <td>
                                {usersList.find((user) => user._id === answer.ans_By).username} <br />
                                answered {formatDate(answer)}
                            </td>
                        )}
                    </tr>
                );
            });
            tableItemsOther = answersList.filter((answer) => {
                return question.answers.includes(answer._id) && answer.ans_By !== userId;;
            }).map((answer) => {
                let answersComment = answerCommentsList.filter((comment) => answer.comments.includes(comment._id));
                return (
                    <tr>
                        <td>{answer.text}</td>
                        <td>
                            <CommentTable
                                answer={answer}
                                commentsList={answersComment}
                                usersList={usersList}
                                commentTableState={commentTableState}
                            />
                        </td>
                    
                        <td>{answer.upVotesAns.length - answer.downVotesAns.length} Votes</td>
                        <td>
                        </td>
                        {usersList.find((user) => user._id === answer.ans_By) && (
                            <td>
                                {usersList.find((user) => user._id === answer.ans_By).username} <br />
                                answered {formatDate(answer)}
                            </td>
                        )}
                    </tr>
                );
            });
        }

        return (
            <>
                <div className="main">
                    <h1>Editing Answers For: {question.title}</h1>
                    <p>Asked By: {usersList.find((user) => user._id === question.asked_by).username}</p>
                    <h2>{question.answers.length} Answers</h2>
                    <h3>{question.views} Views</h3>
                    <h4>{voteCounter} Votes</h4>
                    <h5 id = "CheckingRepVote"></h5>
                    <p>{question.text}
                        <table id="commentTable">
                            {
                                commentItems
                            }
                        </table>
                        <button id="prev" value="Prev" onClick={() => handlePrevCommentPage()} disabled={currentCommentPage === 1}> Prev</button>
                        <button id="next" value="Next" onClick={() => handleNextCommentPage()} disabled={currentCommentPage === totalCommentPages || totalCommentPages === 0}> Next</button>

                    </p>
                    <br/>
                    <h2>Your Answers</h2>
                    <table id="questionTable">
                        {tableItemsUser}
                    </table>
                    <h2>Other's Answers</h2>
                    <table id="questionTable">
                        {tableItemsOther}
                    </table>
                    <button id="prev" value="Prev" onClick={() => handlePrevPage()} disabled={currentPage === 1}> Prev</button>
                    <button id="next" value="Next" onClick={() => handleNextPage()} disabled={currentPage === totalPages || totalPages === 0}> Next</button>
                </div>
            </>

        );
    } else {
        return (
            <>
                <div className='main'>
                </div>

            </>
        );
    }

}