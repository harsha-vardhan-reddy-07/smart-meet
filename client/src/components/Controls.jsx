import { useContext, useEffect, useRef, useState } from "react";
import '../styles/MeetPage.css';
import { Button } from "@mui/base";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import LogoutIcon from '@mui/icons-material/Logout';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ForumIcon from '@mui/icons-material/Forum';
import PersonIcon from '@mui/icons-material/Person';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";


import RecordRTC from 'recordrtc';
import download from 'downloadjs';
import { Tooltip } from "@mui/material";



export default function Controls(props) {
  const { tracks, client, setStart, setInCall,  screenTrack, setScreenTrack, participantsListOpen, setParticipantsListOpen, chatsContainerOpen, setChatsContainerOpen} = useContext(SocketContext);
  const [trackState, setTrackState] = useState({ video: true, audio: true });
 
  const [screenSharing, setScreenSharing] = useState(false);
  const [screenSharingOff, setScreenSharingOff] = useState(false);


  

  // Screen recording
  const [screenRecording, setScreenrecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const recorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const videoStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const stream = new MediaStream([...audioStream.getTracks(), ...videoStream.getTracks()]);
      const recorder = RecordRTC(stream, { type: 'video' });
      recorderRef.current = recorder;
      recorder.startRecording();
      setScreenrecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    recorderRef.current.stopRecording( async() => {
      const blob = recorderRef.current.getBlob();
      setRecordedBlob(blob);
      setScreenrecording(false);
    });
  };

  const downloadVideo = async () => {
    if (recordedBlob) {
      await download(recordedBlob, 'recorded-video.webm');
      setRecordedBlob(null);
    }
  };



  // Screen sharing
  
  const startScreenSharing = async () => {
    try {
      const screenSharingTrack = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: '1080p_1',
      });
      setScreenTrack(screenSharingTrack);
      setScreenSharing(true);
      setScreenSharingOff(false);
    } catch (error) {
      console.error('Failed to create screen sharing track:', error);
    }
  };

  const stopScreenSharing = async () => {
    if (screenTrack) {
      await client.unpublish(screenTrack);
      await client.publish(tracks[1]);
      await screenTrack.stop();
      setScreenTrack(null);
      setScreenSharing(false);
      setScreenSharingOff(true);
    }
  };

  useEffect(() =>{
    if(screenSharing){
      
      if (screenTrack && tracks){
        const fun = async () =>{
          await client.unpublish(tracks[1]);
          await client.publish(screenTrack);
        }
        fun();
      }
    }
    
  }, [screenTrack, client, screenSharing, screenSharingOff]);

 


  // Conference controls (video and audio)

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const navigate = useNavigate()

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
    navigate('/');
  };
  


  return (
    <div className="controls-page">

      <div className="controllers-video-part">

          <Button
            variant="contained"
            color={trackState.audio ? "primary" : "secondary"}
            onClick={() => mute("audio")}
          >
            {trackState.audio ? 
            
              <Tooltip title="Mike is on" placement="top">
                  <MicIcon /> 
                  </Tooltip>
                  : 
                  <Tooltip title="Mike is off" placement="top">
                  <MicOffIcon />
                  </Tooltip>}
                  
          </Button>
        
        
      
        <Button
          variant="contained"
          color={trackState.video ? "primary" : "secondary"}
          onClick={() => mute("video")}
        >
          {trackState.video ? 
              <Tooltip title="Camera is on" placement="top">
              <VideocamIcon /> 
              </Tooltip>
              : 
              <Tooltip title="Camera is off" placement="top">
              <VideocamOffIcon />
              </Tooltip>
              }
        </Button>
     
      {screenTrack ? (
        
          <Button
          variant="contained"
          color={trackState.video ? "primary" : "secondary"}
          onClick={stopScreenSharing}
        >
           <Tooltip title="Stop screen sharing" placement="top">
           <StopScreenShareIcon />
           </Tooltip>
        </Button>
       
      ) : (
        
          <Button
          variant="contained"
          color={trackState.video ? "primary" : "secondary"}
          onClick={startScreenSharing}
        >
          <Tooltip title="Screen share" placement="top">
          <PresentToAllIcon /> 
          </Tooltip>
        </Button>
      
      )}

      {screenRecording ? (
        
        <Button
          variant="contained"
          color={trackState.video ? "primary" : "secondary"}
          onClick={stopRecording}
        >
          <Tooltip title="Stop recording" placement="top">
           <StopCircleIcon />
           </Tooltip>
        </Button>
      
      ) : (
        
        <Button
          variant="contained"
          onClick={startRecording}
        >
          <Tooltip title="Start recording" placement="top">
          <RadioButtonCheckedIcon /> 
          </Tooltip>
        </Button>
      
      )}
      {recordedBlob ? 
      
      <Button
        variant="contained"
        color={"danger"}
        onClick={downloadVideo}
      >
        <Tooltip title="Download" placement="top">
        <CloudDownloadIcon />
        </Tooltip>
      </Button>
     : ''
    }
      
        <Button
          variant="contained"
          color="default"
          onClick={() => leaveChannel()}
        >
          <Tooltip title="Leave meet" placement="top">
          <LogoutIcon />
          </Tooltip>
        </Button>
      
      </div>

      <div className="controllers-chat-participants">
      <button onClick={()=>{
          setParticipantsListOpen(false);
          setChatsContainerOpen(!chatsContainerOpen);
        }}>
        <Tooltip title="Chats" placement="top">
         <ForumIcon />
         </Tooltip>
        </button>
        <button onClick={()=>{
          setParticipantsListOpen(!participantsListOpen);
          setChatsContainerOpen(false);
        }}>
        <Tooltip title="Participants" placement="top">
         <PersonIcon />
         </Tooltip>
        </button>
      </div>
      
    </div>
      
      
  );
}
