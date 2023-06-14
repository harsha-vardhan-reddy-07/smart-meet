import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../context/SocketContext';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';


const Chat = ({roomId, userId}) => {

  const {participants, chatsContainerOpen, socket} = useContext(SocketContext);
  const [texts, setTexts] = useState([])
  const [textInput, setTextInput] = useState('');
  

 

  const sendMsg = async () => {
    await socket.emit("new-chat", {msg : [userId, textInput], roomId: roomId});
    setTexts(current => [...current, [userId, textInput]]);
    console.log("sentt");
    setTextInput('');
  }

  useEffect(() =>{
    socket.on("new-chat-arrived", async({msg, room})=>{
      console.log("newwww");
      if (room === roomId){
        setTexts(current => [...current, msg]);
      }
      console.log("textss", texts);
  })
  }, [socket])



  return (
    <div className='chats-page' 
    style={chatsContainerOpen ? {right: "1vw"} : {right: "-25vw"}}
    >
        <h3>Chat Room..</h3>
        <hr id='h3-hr' />
        
        <div className="chat-container">

          <div className="chat-messages-box">

          {texts.length > 0 ? 
            texts.map((i, id) => {
              return (
                <div className="message-body" key={id}>
                <span className="sender-name">{participants[i[0]]}</span>
                <p className="message">{i[1]}</p>
              </div>
              )
            })
         : 
         <p>no chats</p>}

          </div>
          <div className="send-messages-box">
            <input type="file" id='fileInput'  />
            <label htmlFor='fileInput'><AttachFileIcon /></label>
            <input type="text" value={textInput} onChange={(e)=> setTextInput(e.target.value)} />
            <button onClick={sendMsg} ><SendIcon /></button>
          </div>
        </div>
    </div>
  )
}

export default Chat;