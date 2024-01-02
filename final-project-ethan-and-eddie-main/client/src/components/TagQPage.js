import { useState,useEffect } from "react";
import axios from "axios";
export default function TagQPage({tagId, displayContent}) {
    
    let [questionsList, setQuestionsList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/questions').then(res => {setQuestionsList(res.data)});
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
        let convertDate = new Date(question.ans_date_time);
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
    

    let question = questionsList.find(question => question._id === questionId);
    if(question){
        const tableItems = answersList.filter((answer) => {return question.answers.includes(answer._id)}).map(
            answer =>
            <tr>
                <td>{answer.text}</td>
                <td>{answer.ans_By} <br/> answered {formatDate(answer)}</td>
            </tr>
        );
        return (
            <>
                <div className="main">
                    <h1>{question.title}</h1>
                    <h3>{question.answers.length} Answers</h3>
                    <h3>{question.views} Views</h3>
                    <p>{question.text}</p>
                    <table id="questionTable">
                        {tableItems}
                    </table>
    
                    <button className="postButton" onClick={displayAnswerQPage}> Answer Question </button>
                </div> 
            </>
            
        );  
    } else {
        return(
            <>
            <div className ='main'>
            </div>
            
            </>
        );
    }
    
    }