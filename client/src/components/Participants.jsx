import React, { useContext } from 'react';
import '../styles/MeetPage.css';
import { SocketContext } from '../context/SocketContext';

const Participants = () => {

    const {participants, participantsListOpen} = useContext(SocketContext);

  return (
    <div className='participants-page' style={participantsListOpen ? {right: "1vw"} : {right: "-25vw"}}>
        <h3>Members Online..</h3>
        <hr id='h3-hr' />
        <div className="participants-container">

            {Object.values(participants).length > 0 ?

            Object.values(participants).map((member)=>{
                    return(

                    <div className="participant">
                    <div className="participant-logo"><p>{member.charAt(0).toUpperCase()}</p></div>
                    <h4>{member}</h4>
                </div>
                    )
                })
        
            :
            <p>No members</p>
            }
        </div>
    </div>
  )
}

export default Participants