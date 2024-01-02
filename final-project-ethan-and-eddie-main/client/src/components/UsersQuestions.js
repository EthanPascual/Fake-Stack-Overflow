import axios from 'axios';
import { useEffect, useState } from 'react';
export default function UsersQuestions({displayContent, resetTag, username, userId, setInUsers, selectQuestion, admin, adminName, adminId, setUsername, setUserId}) {

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
            
        if(today.getFullYear() == convertDate.getFullYear()){
                let hourNum = Math.floor(minNum / 60);
                if(currentDayTime < 60){
    
                    return (`${currentDayTime} seconds ago`);
        
                }
                else if(currentDayTime < 3600){
                    
                    if(minNum < 2){
                        return (`${minNum} minute ago`);
                    }
                    else{
                        return (`${minNum} minutes ago`);
                    }
                }
                else if(hourNum < 24){
        
                    if(hourNum < 2){
                        return (`${hourNum} hour ago`);
                    }
                    else{
                        return (`${hourNum} hours ago`);
                    }
                }else{
                    normalDate = normalDate.replace(`, ${today.getFullYear()}`, '')
                    return(`${normalDate}`)
                }
                
            }
            else{
            return(`${normalDate}`);
            }
    }
   
    let[questionsList,setQuestions] = useState([]);
    let[questionCounter, setQuestionCounter] = useState(0);
    let [questionsFilter, setQuestionsFilter] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/questions').then(res => {
            
        setQuestions(res.data);
        setQuestionsFilter(res.data)
        setQuestionCounter(res.data.length);
    
    });
    }, []);

    let [tagsButtonList,setTags] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/tags').then(res => {setTags(res.data)});
    }, [])

    let [answersList,setAnswersList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/answers').then(res => {setAnswersList(res.data)});
    }, []);
    let [usersList,setUsersList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/users').then(res => {setUsersList(res.data)});
    }, []);
   

    //Trying to limit questions
    let [currentPage, setCurrentPage] = useState(1);
    let [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    questionsFilter = questionsFilter.slice(indexOfFirstItem, indexOfLastItem);

    totalPages = Math.ceil(questionsList.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage === Math.ceil(questionsList.length / itemsPerPage)) {
            return;
          }
        else{
        setCurrentPage(currentPage + 1);
        }
    };

    const filterForTag = (tagId) => {
        resetTag(tagId);
        if(admin){setUsername(adminName); setUserId(adminId);}
        setInUsers(false);
        displayContent('Questions');
    }

    const handlePrevPage = () => {
        if (currentPage === 1) {
            return;
          }
          else{
        setCurrentPage(currentPage - 1);
          }
    };
    let questionsUserFilter;
    const currentUser = usersList.find(user => user._id === userId)
    useEffect(() => {
        if (answersList.length > 0 && currentUser) {
          questionsUserFilter = questionsFilter.filter((question) => {
            return question.answers.some((answerId) => {
              const answer = answersList.find((answer) => answer._id === answerId);
              if(answer){
                return answer.ans_By === currentUser._id;
              }
            })
          });
          setQuestionsFilter(questionsUserFilter);
        }
      }, [answersList, currentUser]);

    const goToUserAnswers = (id) => {
        selectQuestion(id);
        displayContent('UsersAnswers');
    }

    //questionsFilter = questionsFilter.sort((a,b) => {return Date.parse(b.ask_date_time) - Date.parse(a.ask_date_time)});
    let tableItems;
    if(usersList.length > 0){
        if(questionsFilter.length > 0){
            tableItems = questionsFilter.map(
                question => 
                <tr>
                    <td>{question.answers.length} answers<br />{question.views} views</td>
                    <td>
                        <a class = "questionLink" onClick={() => goToUserAnswers(question._id)}>{question.title}</a><br/>
                        {tagsButtonList.filter((tag) => {return question.tags.includes(tag._id)}).map(tagButton => <button className='tagButton'onClick={() => filterForTag(tagButton._id)}>{tagButton.name}</button>)}
                    </td>
                    <td>{question.upVotes.length - question.downVotes.length} Votes</td>
                    <td>{usersList.find(user => user._id === question.asked_by).username} asked  {formatDate(question)}</td>
                </tr>
            );
        } else {
            tableItems = <p>You have not yet answered any questions!</p>
        }
        
    }
    console.log(tableItems)
    return (
        <>
            <div className="main">
                <h1 id="QuestionsPageTitle">Questions answered by {username}</h1> 
                <div id="questionList">
                    <table id="questionTable">
                        {tableItems}
                    </table>
                    <button id = "prev" value="Prev" onClick = {() => handlePrevPage()} disabled={currentPage === 1}> Prev</button>
                    <button id = "next" value="Next" onClick = {() => handleNextPage()} disabled={currentPage === totalPages}> Next</button>
                </div>
            </div>
        </>
        
    );
   
    
    }