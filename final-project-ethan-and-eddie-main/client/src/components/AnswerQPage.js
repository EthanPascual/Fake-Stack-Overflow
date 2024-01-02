import { useState,useEffect } from "react";
import axios from "axios";
export default function AnswerQPage({questionId, displayContent, username, userId}) {
    
    let [questionsList, setQuestionsList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/questions').then(res => {setQuestionsList(res.data)});
    }, [])
    let question = questionsList.find(question => question._id == questionId)
    let ids;
    if(question){
        ids = question.answers;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const text = e.target.responseText.value;
      
        if (text === "") {
          document.getElementById("CheckingInvalid").innerHTML = "Invalid Input";
        } else {
            axios.post('http://localhost:8000/newAnswers', {
          text: text,
          ans_By: userId,
          ans_date_time: new Date()
        })
        .then(async (res) => {
          console.log('adding answer to question');
          console.log(res.data)
          const answerId = res.data._id;
      
          const updatedQuestionsList = [...questionsList];
          const questionIndex = updatedQuestionsList.findIndex(question => question._id === questionId);
      
          if (questionIndex !== -1) {
            updatedQuestionsList[questionIndex].answers.push(answerId);
            setQuestionsList(updatedQuestionsList);
      
            await axios.put(`http://localhost:8000/questions/${questionId}`, { answers: updatedQuestionsList[questionIndex].answers });
            console.log('added answer to question');
            displayContent('Answers');
          }
        })
        .catch(err => console.error(err));
      }  
    }
      
        

        return (
            <>
            <div id="responsePage" className = "main">
            <form onSubmit ={handleSubmit}>
            <h2>Answer Text*</h2>
            <input type="text" id="responseText" name="responseText" /><br />

            <h2 id="CheckingInvalid" className="InvalidCheck"></h2>
            <button type = "submit" className="postButton">Post Answer</button>
            </form>
            </div>


            </>
            
        );  
    
    }