import { useState,useEffect } from "react";
import axios from "axios";
export default function EditAnswerPage({questionId, displayContent, username, userId, setAnswerId}) {
    

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const text = e.target.responseText.value;
      
        if (text === "") {
          document.getElementById("CheckingInvalid").innerHTML = "Invalid Input";
        } else {
            axios.put(`http://localhost:8000/answers/${questionId}`, {
          text: text
        })
        .then(async (res) => {
          console.log('successfully edited answer');
          displayContent('UsersAnswers');
        })
        .catch(err => console.error(err));
      }  
    }
      
        

        return (
            <>
            <div id="responsePage" className = "main">
            <form onSubmit ={handleSubmit}>
            <h2>Editing Answer Text*</h2>
            <input type="text" id="responseText" name="responseText" /><br />

            <h2 id="CheckingInvalid" className="InvalidCheck"></h2>
            <button type = "submit" className="postButton">Post Answer</button>
            </form>
            </div>


            </>
            
        );  
    
    }