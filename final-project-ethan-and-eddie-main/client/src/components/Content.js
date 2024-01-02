import { useEffect, useState } from "react";
import Banner from './Banner';
import SideBar from './SideBar';
import QuestionsPage from './QuestionsPage';
import TagsPage from './TagsPage';
import AskQuestionPage from "./AskQuestionPage";
import AnswerPage from "./AnswerPage";
import AnswerQPage from "./AnswerQPage";
import UserProfile from "./UserProfile";
import ModifyQuestionPage from "./ModifyQuestionPage";
import UsersQuestions from "./UsersQuestions";
import UsersTags from "./UsersTags";
import UserAnswerPage from "./UserAnswerPage";
import EditAnswerPage from "./EditAnswerPage";
import EditTags from "./EditTags";
import AdminUserProfile from "./AdminUserProfile";

export default function Content({setPage, setUsername, setUserId, username, userId, admin, adminId, adminName, setAdmin, setAdminId, setAdminName}) {
    
    const [content, setContent] = useState('Questions');
    const [searchI, setSearch] = useState("");
    const [answerId, setAnswerId] = useState('');
    const [tagId, setTagId] = useState('');
    const [inUsers, setInUsers] = useState(false);
    const [changeAnswerId, setChangeAnswerId] = useState('');
    const [changeTagId, setChangeTagId] = useState('');

    
    console.log(username);

    switch(content){
        case 'Questions':
            return(
                <>
                    <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                    <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                    <QuestionsPage searchInput={searchI} displayContent={setContent} findAnswerById={setAnswerId} specificTag={tagId} resetTag={setTagId} username={username}/>
                </>
            );
            break;
        case 'AskQuestion':
            return(
                <>
                    <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                    <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                    <AskQuestionPage displayContent={setContent} resetTags={setTagId} userId={userId}/>
                </>
            );
            break;
        case 'Tags':
            return(
                <>
                    <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                    <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                    <TagsPage displayContent={setContent} selectTag={setTagId}/>
                </>
            );
            break;
        case 'Answers':
            return(
                <>
                    <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                    <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                    <AnswerPage questionId={answerId} displayContent={setContent} username={username} userId={userId} />
                </>
            );
            break;
        case 'AnswerQuestion':
            return(
                <>
                    <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                    <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                    <AnswerQPage questionId={answerId} displayContent={setContent} username={username} userId={userId}/>
                </>
            );
            break;
        case 'UserProfile':
            return(
                <>
                    <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                    <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                    <UserProfile userId={userId} username={username} setContent={setContent} setQuestionId={setAnswerId} tagId={tagId} setTagId={setTagId} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                </>
            );
            break;
        case 'ModifyQuestion':
            return(
                <>
                    <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                    <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                    <ModifyQuestionPage displayContent={setContent} resetTags={setTagId} userId={userId} questionId={answerId}/>
                </>
            );
            break;
        case 'UsersQuestions':
            return(
                <>
                    <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                    <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                    <UsersQuestions displayContent={setContent} resetTag={setTagId} userId={userId} username={username} setInUsers={setInUsers} selectQuestion={setAnswerId} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                </>
            );
            break;
        case 'UsersTags':
                return(
                    <>
                        <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                        <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                        <UsersTags displayContent={setContent} selectTag={setTagId} userId={userId} username={username} setInUsers={setInUsers} setChangeTagId={setChangeTagId}/>
                    </>
                );
                break;
            case 'UsersAnswers':
                    return(
                        <>
                            <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                            <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                            <UserAnswerPage questionId={answerId} displayContent={setContent} username={username} userId={userId} setAnswerId={setChangeAnswerId} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                        </>
                    );
                    break;
            case 'EditAnswers':
                    return(
                        <>
                            <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                            <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                            <EditAnswerPage questionId={changeAnswerId} displayContent={setContent} username={username} userId={userId} setAnswerId={setAnswerId}/>
                        </>
                    );
                    break;
            case 'EditTags':
                    return(
                        <>
                            <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                            <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                            <EditTags changeTagId={changeTagId} displayContent={setContent} username={username} userId={userId}/>
                        </>
                    );
                    break;
            case 'AdminUserProfile':
            return(
                <>
                    <Banner changeSearch={setSearch} username={username} setUsername={setUsername} setUserId={setUserId} setContent={setContent} setPage={setPage} setInUsers={setInUsers} admin={admin} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName} adminName={adminName}/>
                    <SideBar displayContent={setContent} resetTags={setTagId} inUsers={inUsers} setInUsers={setInUsers} admin={admin} adminId={adminId} adminName={adminName} setUserId={setUserId} setUsername={setUsername}/>
                    <AdminUserProfile userId={userId} username={username} setContent={setContent} setQuestionId={setAnswerId} tagId={tagId} setTagId={setTagId} adminName={adminName} adminId={adminId} setUsername={setUsername} setUserId={setUserId} setInUsers={setInUsers}/>
                </>
            );
            break;
                    
    }

    return (
         <>
             <div id="header" className="header">
                 <h1>Content Page</h1>
             </div>
         </>
         
     );
     
 }