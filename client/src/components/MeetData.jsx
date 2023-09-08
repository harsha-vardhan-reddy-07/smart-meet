import React, { useContext, useState } from 'react'
import '../styles/MeetData.css';
import { SocketContext } from '../context/SocketContext';
import { Link } from 'react-router-dom';

const MeetData = () => {

    const [pastMeets, setPastMeets] = useState(false);
    const {socket, myMeets} = useContext(SocketContext)

    const [editRoomName, setEditRoomName] = useState('');
    const [editMeetDate, setEditMeetDate] = useState('none');
    const [editMeetTime, setEditMeetTime] = useState('none');
    

  return (
    <div className="myMeets-body">
          <div className="myMeets-body-nav">
            <ul>
              <li style={pastMeets ? {borderBottom: "none"} : {borderBottom: "2px solid rgb(245, 252, 254, 0.7)"}} onClick={() => setPastMeets(false)}>Upcomming meetings</li>
              <li style={!pastMeets ? {borderBottom: "none"} : {borderBottom: "2px solid rgb(245, 252, 254, 0.7)"}} onClick={() => setPastMeets(true)}>Past meetings</li>
            </ul>
          </div>

          <div className="myMeets-body-content">
            
            {!pastMeets ?

            // Upcomming meets
            <div className="upcomming-meet-content">


              {myMeets.length > 0 ?
            
                myMeets.map((meet, i) =>{


                  if (meet.meetDate !== "none" &&  meet.meetTime !== "none" && meet.meetType === "scheduled"){
                    
                    const currDate = new Date();
                    const date =  new Date(meet.meetDate + 'T' + meet.meetTime); 
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const hours = String(date.getHours()).padStart(2, "0");
                    const minutes = String(date.getMinutes()).padStart(2, "0");
                    if (currDate < date){

                      return(

                        <>

                        <div className="upcomming-meet-card">
                          <div className='details-controls'>
                          <div className="meet-card-details">
                            <p>Meet: <span> {meet.roomName} </span></p>
                            <p>Meet Id: <span> {meet._id} </span></p>
                          </div>
                          <div className="meet-card-controls">
                            <Link to={`/meet/${meet._id}`} ><button  className='joinBtn'>Join</button></Link>
                            <button className='editBtn' data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={()=> {setEditRoomName(meet.roomName); setEditMeetDate(meet.meetDate); setEditMeetTime(meet.meetTime); }} >Edit</button>
                            <button  className='deleteBtn' onClick={() =>{ socket.emit("delete-meet", {roomId: meet._id}) }}>Delete</button>
                          </div>
                          </div>
                          <div className="meet-card-timings">
                            <h4>Timings:</h4>
                            <div className="meet-card-timings-details">
                              <p>Date: <span> {day}/{month}/{year} </span></p>
                              <p>Created Time: <span>  {hours}:{minutes} </span></p>
                            </div>
                          </div>
                        </div>


                        {/* // update meet details - modal */}
                        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" style={{width: "30vw"}}>
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="staticBackdropLabel">Edit Meet</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                              <div class="form-floating mb-3 ">
                                <input type="text" class="form-control" id="floatingInput" placeholder='Name your meet' value={editRoomName} onChange={(e)=> setEditRoomName(e.target.value)} />
                                <label for="floatingInput">Meet name</label>
                              </div>

                              <p style={{margin: " 10px 0px 0px 0px", color: 'rgb(2, 34, 58)'}}>Meet Date: </p>
                              <input type='date' class="form-control" value={editMeetDate} onChange={(e) => setEditMeetDate(e.target.value)} />
                              <p style={{margin: " 10px 0px 0px 0px", color: 'rgb(2, 34, 58)'}}>Meet Time: </p>
                              <input type='time' class="form-control" value={editMeetTime} onChange={(e) => setEditMeetTime(e.target.value)} />
                          
          
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                              <button type="button" class="btn btn-primary" onClick={() =>{socket.emit("update-meet-details", {roomId: meet._id, roomName: editRoomName, newMeetDate: editMeetDate, newMeetTime: editMeetTime})}} data-bs-dismiss="modal">Update</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      </>
                      )
                    }

                  }})
                
                  : 
                  <p>No upcomming meets</p>
                  }




                  


                 


                

            </div>
            :

            // Past meetings
            <div className="past-meet-content">

            {myMeets.length > 0 ?
            
            myMeets.map((meet, i) =>{

              


              if (meet.meetDate === "none" ||  meet.meetTime === "none" || meet.meetType === "instant"){
                

                const date =  new Date(meet.createdAt); 
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");
                
                return(


                  <div className="past-meet-card" key={i}>
              <div className='details-controls'>
                <div className="meet-card-details">
                  <p>Meet: <span> {meet.roomName} </span></p>
                  <p>Meet Id: <span> {meet._id} </span></p>
                </div>
              </div>
              <div className="meet-card-timings">
                <h4>Timings:</h4>
                <div className="meet-card-timings-details">
                  <p>Date: <span> {day}/{month}/{year} </span></p>
                  <p>Created Time: <span>  {hours}:{minutes} </span></p>
                </div>
              </div>
            </div>
              )
            }else if (new Date() > new Date(meet.meetDate + 'T' + meet.meetTime)){

                const date =  new Date(meet.meetDate + 'T' + meet.meetTime); 
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");
                
                return(


                  <div className="past-meet-card">
                    <div className='details-controls'>
                      <div className="meet-card-details">
                        <p>Meet: <span> {meet.roomName} </span></p>
                        <p>Meet Id: <span> {meet._id} </span></p>
                      </div>
                    </div>
                    <div className="meet-card-timings">
                      <h4>Timings:</h4>
                      <div className="meet-card-timings-details">
                        <p>Date: <span> {day}/{month}/{year} </span></p>
                        <p>Created Time: <span>  {hours}:{minutes} </span></p>
                      </div>
                    </div>
                  </div>
                )


            }
            })
            
            
            :
            
            
            <p>No past meets</p>
            
            }  
            


          

      </div>
            }


          </div>

      </div>

  )
}

export default MeetData