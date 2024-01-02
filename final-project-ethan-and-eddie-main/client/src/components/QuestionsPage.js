import axios from 'axios';
import { useEffect, useState } from 'react';
export default function QuestionsPage({searchInput, displayContent, findAnswerById, specificTag, resetTag, username}) {

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
          const sorted = res.data.sort((a,b) => {return Date.parse(b.ask_date_time) - Date.parse(a.ask_date_time)});
          setQuestions(sorted);
          setQuestionsFilter(sorted);
          setQuestionCounter(sorted.length);
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
   
    
    const displayAnswerPage = (id) => {
        let updateViews = questionsList.find(question => question._id === id).views += 1;
        console.log('testing put')
        axios.put(`http://localhost:8000/questions/${id}`, {views:updateViews});
        console.log('put works')
        findAnswerById(id);
        displayContent('Answers');
    }

    const filterForTag = (id) => {
        resetTag(id);
    }

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

    const handlePrevPage = () => {
        if (currentPage === 1) {
            return;
          }
          else{
        setCurrentPage(currentPage - 1);
          }
    };
   

    const sortNewest = () =>{
        
        setQuestionsFilter(questionsList.sort((a,b) => {return Date.parse(b.ask_date_time) - Date.parse(a.ask_date_time)}));
        setQuestionCounter(questionsList.length);
        console.log(questionsList);
    }

    const sortActive = () => {

        

        let sortedQuestions = [...questionsList]; // Create a new array by spreading the questionsList state
        sortedQuestions = sortedQuestions.sort((a, b) => {
            // ...
            const latestAnswerA = answersList.find(answer => answer._id === a.answers[a.answers.length - 1]);
          const latestAnswerB = answersList.find(answer => answer._id === b.answers[b.answers.length - 1]);
          const dateA = latestAnswerA ? Date.parse(latestAnswerA.ans_date_time) : undefined;
          const dateB = latestAnswerB ? Date.parse(latestAnswerB.ans_date_time) : undefined;
      
          if (dateA === undefined && dateB === undefined) return 0;
          if (dateA === undefined) return 1;
          if (dateB === undefined) return -1;
            // Change the sorting order to ascending
            return dateA - dateB;
          });
        questionsFilter = sortedQuestions.sort((a, b) => {
          const latestAnswerA = answersList.find(answer => answer._id === a.answers[a.answers.length - 1]);
          const latestAnswerB = answersList.find(answer => answer._id === b.answers[b.answers.length - 1]);
          const dateA = latestAnswerA ? Date.parse(latestAnswerA.ans_date_time) : undefined;
          const dateB = latestAnswerB ? Date.parse(latestAnswerB.ans_date_time) : undefined;
      
          if (dateA === undefined && dateB === undefined) return 0;
          if (dateA === undefined) return 1;
          if (dateB === undefined) return -1;
      
          return dateB - dateA;
        });
        console.log(sortedQuestions);
        setQuestionsFilter(sortedQuestions);
        setQuestionCounter(sortedQuestions.length);
      };
      
    const sortUnanswered = () =>{
       
        setQuestionsFilter(questionsList.filter(question => question.answers.length == 0))
        setQuestionCounter(questionsList.filter(question => question.answers.length == 0).length)
        setTotalPages(Math.ceil(questionsList.filter(question => question.answers.length == 0).length / itemsPerPage))
       



        
        
        
    }

    useEffect(() => {
        if(searchInput.includes("[") && searchInput.includes("]")){
            let tagSearchArray = searchInput.match(/\[(.*?)\]/g).map(tagOnly => tagOnly.slice(1, -1))
            let regSearchArray = searchInput.trim().split(/\[.*?\]/).filter(Boolean).map(makeL => makeL.toLowerCase());
            let tagIdList = tagsButtonList.filter((findTag) => tagSearchArray.includes(findTag.name));
            tagIdList = tagIdList.map(tag => tag._id);
            let searchQuestions = questionsList.filter((question) => question.tags.some(tagItem => tagIdList.includes(tagItem)) || regSearchArray.some(regItem => question.title.toLowerCase().includes(regItem.toLowerCase())));
            setQuestionsFilter(searchQuestions);
        }
        else if (searchInput !== "") {
          let searchQuestions = questionsList.filter((question) => question.title.toLowerCase().includes(searchInput.toLowerCase().trim()));
          setQuestionsFilter(searchQuestions);
        } else {
          setQuestionsFilter(questionsList);
        }
      }, [searchInput, questionsList]);

      let specificTagName = tagsButtonList.find(tag => tag._id == specificTag);
      useEffect(() => {
        if(specificTag !== '' && specificTagName){
          console.log(specificTag);
          console.log('I am filtering for specific Tags');
          document.getElementById('QuestionsPageTitle').innerHTML = "Questions with Tag: " + specificTagName.name;
          setQuestionsFilter(questionsList.filter((question) => question.tags.includes(specificTag)));
        } else {
            document.getElementById('QuestionsPageTitle').innerHTML = "All Questions"
            setQuestionsFilter(questionsList);
        }
      }, [specificTag, questionsList]);

      const displayAskQPage = () => {
        console.log('displaying AskQuestion page');
        displayContent('AskQuestion');
    }
    
    let tableItems;
    if(usersList.length > 0){
        tableItems = questionsFilter.map(
            question => 
            <tr>
                <td>{question.answers.length} answers<br />{question.views} views</td>
                <td>
                    <a class = "questionLink" onClick={() => displayAnswerPage(question._id)}>{question.title}</a><br/>
                    {tagsButtonList.filter((tag) => {return question.tags.includes(tag._id)}).map(tagButton => <button className='tagButton'onClick={() => filterForTag(tagButton._id)}>{tagButton.name}</button>)}
                    <p>Summary: {question.sum} </p>
                </td>
                <td>{question.upVotes.length - question.downVotes.length} Votes</td>
                <td>{usersList.find(user => user._id === question.asked_by).username} asked  {formatDate(question)}</td>
            </tr>
        );
    }
    
    return (
        <>
            <div className="main">
                <h1 id="QuestionsPageTitle">All Questions</h1> 
                <p id="questionCounter"> {questionCounter} questions</p>
                {username && <div className="askQuestionButton">
                    <button className="postButton" onClick={displayAskQPage}>Ask Question</button>
                </div>}
                <div className="statusButton">
                    <button id="statusButtonNewest" value="Newest" onClick = {() => sortNewest()} >Newest</button>
                    <button id="statusButtonActive" value="Active" onClick = {() => sortActive()}>Active</button>
                    <button id="statusButtonUnanswered" value="Unanswered" onClick = {() => sortUnanswered()}>Unanswered</button>
                </div>
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