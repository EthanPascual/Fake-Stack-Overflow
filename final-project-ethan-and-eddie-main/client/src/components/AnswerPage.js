import { useState, useEffect } from "react";
import axios from "axios";
export default function AnswerPage({ questionId, displayContent, username, userId }) {

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

    const displayAnswerQPage = () => {
        displayContent('AnswerQuestion');

    }

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
                            {username && <button onClick={() => handleUpVoteComment(comment._id)}>Up</button>}
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

    const handleUpVote = (questionId) => {

        const userUpdateId = questionsList.find((question) => question._id === questionId).asked_by;
        let repUpdate = usersList.find((user) => user._id === userUpdateId).rep;
        let repUser = usersList.find((user) => user._id === userId).rep; 
        if (repUser < 50 && !usersList.find((user) => user._id === userId).admin) {
            console.log("Your rep is below 50!");
            document.getElementById("CheckingRepVote").innerHTML = "Sorry you cannot vote as your reputation is below 50!";
        }
        else {
            const question = questionsList.find((question) => question._id === questionId);
            const userHasUpVoted = question.upVotes.includes(userId);
            console.log(userUpdateId);

            let updatedUpVotes = question.upVotes;
            let updatedDownVotes = question.downVotes;
            if (userHasUpVoted) {
                updatedUpVotes = updatedUpVotes.filter((id) => id !== userId);
                repUpdate -= 5;
            }
            else {
                updatedUpVotes = updatedUpVotes.concat(userId);
                updatedDownVotes = updatedDownVotes.filter((id) => id !== userId);
                repUpdate += 5;
            }
            axios.put(`http://localhost:8000/questions/${questionId}`, {
                upVotes: updatedUpVotes,
                downVotes: updatedDownVotes,
            })
                .then((response) => {
                    // update answer's votes count in answersList
                    const updatedQuestionsList = questionsList.map((q) => {
                        if (q._id === questionId) {
                            return {
                                ...q,
                                upVotes: updatedUpVotes,
                                downVotes: updatedDownVotes,
                            };
                        }
                        return q;
                    });

                    setQuestionsList(updatedQuestionsList);
                })
                .catch((error) => {
                    console.log('Error updating answer votes', error);
                });



            console.log(userUpdateId);
            axios.put(`http://localhost:8000/users/${userUpdateId}`, {
                rep: repUpdate
            }).then((response) => {

                const updatedUsersList = usersList.map((u) => {
                    if (u._id === userUpdateId) {
                        return {
                            ...u,
                            rep: repUpdate
                        }
                    }
                    return u;
                });

                setUsersList(updatedUsersList);

            }).catch((error) => {

                console.log("error updating user rep", error);
            });


        }
    }

    const handleDownVote = (questionId) => {
        const userUpdateId = questionsList.find((question) => question._id === questionId).asked_by;
        let repUpdate = usersList.find((user) => user._id === userUpdateId).rep;
        let repUser = usersList.find((user) => user._id === userId).rep; 
        if (repUser < 50 && !usersList.find((user) => user._id === userId).admin) {
            console.log("Your rep is below 50!");
            document.getElementById("CheckingRepVote").innerHTML = "Sorry you cannot vote as your reputation is below 50!";
        }
        else {
            const question = questionsList.find((question) => question._id === questionId);
            const userHasDownVoted = question.downVotes.includes(userId);

            let updatedUpVotes = question.upVotes;
            let updatedDownVotes = question.downVotes;
            if (userHasDownVoted) {
                updatedDownVotes = updatedDownVotes.filter((id) => id !== userId);
                repUpdate += 10;
            }
            else {
                updatedUpVotes = updatedUpVotes.filter((id) => id !== userId);
                updatedDownVotes = updatedDownVotes.concat(userId);
                repUpdate -= 10;
            }
            axios.put(`http://localhost:8000/questions/${questionId}`, {
                upVotes: updatedUpVotes,
                downVotes: updatedDownVotes,
            })
                .then((response) => {
                    // update answer's votes count in answersList
                    const updatedQuestionsList = questionsList.map((q) => {
                        if (q._id === questionId) {
                            return {
                                ...q,
                                upVotes: updatedUpVotes,
                                downVotes: updatedDownVotes,
                            };
                        }
                        return q;
                    });

                    setQuestionsList(updatedQuestionsList);
                })
                .catch((error) => {
                    console.log('Error updating answer votes', error);
                });
            axios.put(`http://localhost:8000/users/${userUpdateId}`, {
                rep: repUpdate
            }).then((response) => {

                const updatedUsersList = usersList.map((u) => {
                    if (u._id === userUpdateId) {
                        return {
                            ...u,
                            rep: repUpdate
                        }
                    }
                    return u;
                });

                setUsersList(updatedUsersList);

            }).catch((error) => {

                console.log("error updating user rep", error);
            });

        }
    }


    const handleUpVoteAns = (answerId) => {

        const userUpdateId = answersList.find((answer) => answer._id === answerId).ans_By;
        let repUpdate = usersList.find((user) => user._id === userUpdateId).rep;
        let repUser = usersList.find((user) => user._id === userId).rep; 
        if (repUser < 50 && !usersList.find((user) => user._id === userId).admin) {
            console.log("Your rep is below 50!");
            document.getElementById("CheckingRepVote").innerHTML = "Sorry you cannot vote as your reputation is below 50!";
        }
        else {
            console.log(userUpdateId);
            const answer = answersList.find((answer) => answer._id === answerId);
            const userHasUpVoted = answer.upVotesAns.includes(userId);

            let updatedUpVotesAns = answer.upVotesAns;
            let updatedDownVotesAns = answer.downVotesAns;
            if (userHasUpVoted) {
                updatedUpVotesAns = updatedUpVotesAns.filter((id) => id !== userId);
                repUpdate -= 5;
            }
            else {
                updatedUpVotesAns = updatedUpVotesAns.concat(userId);
                updatedDownVotesAns = updatedDownVotesAns.filter((id) => id !== userId);
                repUpdate += 5;
            }
            axios.put(`http://localhost:8000/answers/${answerId}`, {
                upVotesAns: updatedUpVotesAns,
                downVotesAns: updatedDownVotesAns,
            })
                .then((response) => {
                    // update answer's votes count in answersList
                    const updatedAnswersList = answersList.map((a) => {
                        if (a._id === answerId) {
                            return {
                                ...a,
                                upVotesAns: updatedUpVotesAns,
                                downVotesAns: updatedDownVotesAns,
                            };
                        }
                        return a;
                    });

                    setAnswersList(updatedAnswersList);
                })
                .catch((error) => {
                    console.log('Error updating answer votes', error);
                });
            axios.put(`http://localhost:8000/users/${userUpdateId}`, {
                rep: repUpdate
            }).then((response) => {

                const updatedUsersList = usersList.map((u) => {
                    if (u._id === userUpdateId) {
                        return {
                            ...u,
                            rep: repUpdate
                        }
                    }
                    return u;
                });

                setUsersList(updatedUsersList);

            }).catch((error) => {

                console.log("error updating user rep", error);
            });

        }
    }
    const handleDownVoteAns = (answerId) => {
        const userUpdateId = answersList.find((answer) => answer._id === answerId).ans_By;
        let repUpdate = usersList.find((user) => user._id === userUpdateId).rep;
        let repUser = usersList.find((user) => user._id === userId).rep; 
        if (repUser < 50 && !usersList.find((user) => user._id === userId).admin) {
            console.log("Your rep is below 50!");
            document.getElementById("CheckingRepVote").innerHTML = "Sorry you cannot vote as your reputation is below 50!";
        }
        else {
            const answer = answersList.find((answer) => answer._id === answerId);
            const userHasDownVoted = answer.downVotesAns.includes(userId);

            let updatedUpVotesAns = answer.upVotesAns;
            let updatedDownVotesAns = answer.downVotesAns;

            if (userHasDownVoted) {
                // remove the user's downvote
                updatedDownVotesAns = updatedDownVotesAns.filter((id) => id !== userId);
                repUpdate += 10;
            } else {
                // remove the user's upvote (if any) and add downvote
                updatedUpVotesAns = updatedUpVotesAns.filter((id) => id !== userId);
                updatedDownVotesAns = updatedDownVotesAns.concat(userId);
                repUpdate -= 10;
            }

            // send PUT request to update answer's upVotesAns and downVotesAns arrays
            axios.put(`http://localhost:8000/answers/${answerId}`, {
                upVotesAns: updatedUpVotesAns,
                downVotesAns: updatedDownVotesAns,
            })
                .then((response) => {
                    // update answer's votes count in answersList
                    const updatedAnswersList = answersList.map((a) => {
                        if (a._id === answerId) {
                            return {
                                ...a,
                                upVotesAns: updatedUpVotesAns,
                                downVotesAns: updatedDownVotesAns,
                            };
                        }
                        return a;
                    });

                    setAnswersList(updatedAnswersList);
                })
                .catch((error) => {
                    console.log('Error updating answer votes', error);
                });
            axios.put(`http://localhost:8000/users/${userUpdateId}`, {
                rep: repUpdate
            }).then((response) => {

                const updatedUsersList = usersList.map((u) => {
                    if (u._id === userUpdateId) {
                        return {
                            ...u,
                            rep: repUpdate
                        }
                    }
                    return u;
                });

                setUsersList(updatedUsersList);

            }).catch((error) => {

                console.log("error updating user rep", error);
            });
        }
    }

    let question = questionsList.find(question => question._id === questionId);
    useEffect(() => {
        if (question) {
            setVoteCounter(question.upVotes.length - question.downVotes.length);
        }
    }, [question]);

    const handleUpVoteComment = (commentId) => {

        console.log(commentId);
        const comment = commentsList.find((comment) => comment._id === commentId);
        const userHasUpVoted = comment.upVotesComments.includes(userId);

        let updatedUpVotesComments = comment.upVotesComments;

        if (userHasUpVoted) {

            updatedUpVotesComments = updatedUpVotesComments.filter((id) => id !== userId);
        } else {


            updatedUpVotesComments = updatedUpVotesComments.concat(userId);
        }
        axios.put(`http://localhost:8000/comments/${commentId}`, {
            upVotesComments: updatedUpVotesComments,

        })
            .then((response) => {

                const updatedCommentsList = commentsList.map((c) => {
                    if (c._id === commentId) {
                        return {
                            ...c,
                            upVotesComments: updatedUpVotesComments,

                        };
                    }
                    return c;
                });

                setCommentsList(updatedCommentsList);
            })
            .catch((error) => {
                console.log('Error updating answer votes', error);
            });




    }
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

        const handleCommentSubmit = (e) => {
            e.preventDefault();
           
            const text = e.target.commentText.value;
            const ans_By = userId;
            let repUser = usersList.find((user) => user._id === userId).rep;

            if (text === "") {
                document.getElementById("CheckingComment").innerHTML = "Invalid Input";
                console.log("comment rejected!");
            } 
            else if(repUser < 50 && !usersList.find((user) => user._id === userId).admin){
                console.log("comment rejected!");
                document.getElementById("CheckingComment").innerHTML = "Sorry you can't create a comment, your reputation is below 50!";
            }
            else if(text.length > 140){
                document.getElementById("CheckingAnswerComment").innerHTML = "Sorry your comment is too long! (140 max)";
            }
            else{
                document.getElementById("CheckingComment").innerHTML = "";
                console.log("comment posted!");
                axios.post('http://localhost:8000/newComments', {
                    text: text,
                    ans_By: ans_By,
                }).then(async (res) => {
                    console.log('adding comment to question');
                    console.log(res.data);
                    const commentId = res.data._id;

                    const updatedQuestionsList = [...questionsList];
                    const questionIndex = updatedQuestionsList.findIndex(question => question._id === questionId);

                    if (questionIndex !== -1) {
                        updatedQuestionsList[questionIndex].comments.push(commentId);
                        setQuestionsList(updatedQuestionsList);

                        await axios.put(`http://localhost:8000/questions/${questionId}`, { comments: updatedQuestionsList[questionIndex].comments }).then(
                            (response) => {
                                console.log('updated question with comment');
                                setCommentsList([...commentsList, res.data]);
                                displayContent('Answers');
                            }
                        ).catch((error) => {
                            console.log('Error updating question comments', error);
                        });
                    }

                    e.target.commentText.value = ""
                }).catch((error) => {
                    console.log('Error adding comment', error);
                });
            }
        };
        const handleAnswerCommentSubmit = (e, answerId) => {
            e.preventDefault();
            console.log("comment posted!");
            const text = e.target.commentAnsText.value;
            const ans_By = userId;
            let repUser = usersList.find((user) => user._id === userId).rep;
            if (text === "") {
                document.getElementById("CheckingAnswerComment").innerHTML = "Invalid Input";
            } 
            else if(repUser < 50 && !usersList.find((user) => user._id === userId).admin){
                document.getElementById("CheckingAnswerComment").innerHTML = "Sorry you can't create a comment, your reputation is below 50!";
            }else if(text.length > 140){
                document.getElementById("CheckingAnswerComment").innerHTML = "Sorry your comment is too long! (140 max)";
            }
            else{
                document.getElementById("CheckingAnswerComment").innerHTML = "";
                axios
                    .post("http://localhost:8000/newComments", {
                        text: text,
                        ans_By: ans_By,
                    })
                    .then(async (res) => {
                        console.log("adding comment to answer");
                        console.log(res.data);
                        const commentId = res.data._id;

                        const updatedAnswersList = [...answersList];
                        const answerIndex = updatedAnswersList.findIndex(
                            (answer) => answer._id === answerId
                        );
                        console.log(answerId);
                        if (answerIndex !== -1) {
                            updatedAnswersList[answerIndex].comments.push(commentId);

                            if (setAnswersList) {
                                setAnswersList(updatedAnswersList);
                            }

                            if (setCommentsList) {
                                setCommentsList([...commentsList, res.data]);
                            }

                            await axios
                                .put(`http://localhost:8000/answers/${answerId}`, {
                                    comments: updatedAnswersList[answerIndex].comments,
                                })
                                .then(() => {
                                    console.log(updatedAnswersList);
                                    // clear comment input field
                                    e.target.commentAnsText.value = "";
                                    console.log("added comment to answer");
                                    displayContent("Answers");
                                })
                                .catch((error) => {
                                    console.log("Error updating answer comments", error);
                                });
                        }
                    })
                    .catch((error) => {
                        console.log("Error adding comment", error);
                    });
            }
        };
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
                        {username && <button onClick={() => handleUpVoteComment(comment._id)}>Up</button>}


                    </tr>


            )
        }

        let tableItems;
        if (usersList.length > 0) {
            // Create an object to store state for each answer's CommentTable
            const commentTableState = {};
            answersList.forEach((answer) => {
                commentTableState[answer._id] = {
                    currentPage: 1,
                    totalPages: Math.ceil(answer.comments.length / 3),
                };
            });

            tableItems = answersList.filter((answer) => {
                return question.answers.includes(answer._id);
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
                        
                        <td>
                            {username && (
                                
                                <form onSubmit={(e) => handleAnswerCommentSubmit(e, answer._id)}>
                                    <h2 id="CheckingAnswerComment" className="InvalidCheck"></h2>
                                    <input type="text" id="commentAnsText" name="commentAnsText" />
                                    <br />
                                    <button type="submit" className="postComment">
                                        Post Comment
                                    </button>
                                    
                                </form>
                            )}
                        </td>
                        <td>{answer.upVotesAns.length - answer.downVotesAns.length} Votes</td>
                        <td>
                            {username && <button onClick={() => handleUpVoteAns(answer._id)}>Up</button>}
                            {username && <button onClick={() => handleDownVoteAns(answer._id)}>Down</button>}
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
                    <h1>{question.title}</h1>
                    <p>Asked By: {usersList.find((user) => user._id === question.asked_by).username}</p>
                    <h2>{question.answers.length} Answers</h2>
                    <h3>{question.views} Views</h3>
                    <h4>{voteCounter} Votes</h4>

                    {username && <button id="upVote" onClick={() => handleUpVote(question._id)}>Up</button>}
                    {username && <button id="downVote" onClick={() => handleDownVote(question._id)}>Down</button>}
                    <h5 id = "CheckingRepVote"></h5>
                    <p>{question.text}
                        <table id="commentTable">
                            {
                                commentItems
                            }
                        </table>
                        {username && <form onSubmit={handleCommentSubmit}>
                            <input type="text" id="commentText" name="commentText" /><br />
                            <button type="submit" className="postComment">Post Comment</button>
                            <h2 id="CheckingComment" className="InvalidCheck"></h2>
                        </form>}
                        <button id="prev" value="Prev" onClick={() => handlePrevCommentPage()} disabled={currentCommentPage === 1}> Prev</button>
                        <button id="next" value="Next" onClick={() => handleNextCommentPage()} disabled={currentCommentPage === totalCommentPages || totalCommentPages === 0}> Next</button>

                    </p>

                    <table id="questionTable">
                        {tableItems}
                    </table>
                    <button id="prev" value="Prev" onClick={() => handlePrevPage()} disabled={currentPage === 1}> Prev</button>
                    <button id="next" value="Next" onClick={() => handleNextPage()} disabled={currentPage === totalPages || totalPages === 0}> Next</button>
                    {username && <button className="postButton" onClick={displayAnswerQPage}> Answer Question </button>}
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