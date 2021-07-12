
//Same domain as the server
const socket = io('/');

//access the video-layout by videoLayout
const videoLayout= document.getElementById('video-layout');

//Creating video element
const myVideo = document.createElement('video');

//Specifies the audio output of the video 
myVideo.muted = true;

//constant peers created
const peers = {};

//Create and run peerjs server
var peer = new Peer(undefined,{
   path: '/peerjs',
    host: '/',
    port: '443'
}); 


//Declare video view which enables us to view our own own video in the meeting
let videoView

//mediaDevices.getUserMedia() method prompts the user for permission to use a media input
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    videoView= stream;
    //Adding video to stream
    addVideo(myVideo, stream);
    //Emitted when a remote peer attempts to call you
    peer.on('call', call => {
        // receiving a call
        call.answer(stream)
        //video element is created
        const video = document.createElement('video')
        //receives two same remote streams and adds the user video stream
        call.on('stream', userVideoStream => {
          addVideo(video, userVideoStream)
        })
    })

    //Connecting new participant in the video stream
    socket.on('user-connected', userLink => {
      setTimeout ( () =>
        {
        connectToNewParticipant(userLink, stream)
      },1000)
    })
 
let text = $("input");
// when press enter send message

//Bind an event handler to the "keydown" JavaScript event
$('html').keydown(function (e) {
  if (e.which == 13 && text.val().length !== 0) {
    //Emits message
    socket.emit('message', text.val());
    text.val('')
  }
});

//Send message from one user to another
socket.on("createMessage", message => {
  $("ul").append(`<li class="message"><b>"user"</b><br/>${message}</li>`);
  scrollToBottom()
})
})

//User disconnects 
socket.on('user-disconnected', userLink => {
if (peers[userLink]) peers[userLink].close()
})

//Connecting with another peer
peer.on('open', id => {
  //peer will join room via ROOM_LINK
socket.emit('join-room', ROOM_LINK, id)
})


//This function helps in connecting new Participant to the meeting 
function connectToNewParticipant(userLink, stream) {
//users can answer calls made to them
const call = peer.call(userLink, stream)
// A video element is created for new partcipant
const video = document.createElement('video')
//To recieve participants video stream
call.on('stream', userVideoStream => {
  //Adding the participants video 
  addVideo(video, userVideoStream)
})
//Closing the call and removing the video stream
call.on('close', () => {
  video.remove()
})

peers[userLink] = call
}

//Faciliates to add new video in the call
function addVideo(video, stream) {
video.srcObject = stream
//attaches an event handler to the video element 
video.addEventListener('loadedmetadata', () => {
  //Supports video playback
  video.play()
})
//Appending new video to the video layout
videoLayout.append(video)
}


//The specified node scrolls to the bottom
const scrollToBottom = () => {
var d = $('.main__chat_window');
d.scrollTop(d.prop("scrollHeight"));
}

//MuteUnmute functionality
const muteUnmute = () => {
const enabled = videoView.getAudioTracks()[0].enabled;
//if enabled is true set Unmute button
if (enabled) {
  videoView.getAudioTracks()[0].enabled = false;
  setUnmuteButton();
} 
//if enabled is false set mute button
else {
  setMuteButton();
  videoView.getAudioTracks()[0].enabled = true;
}
}

//Video Stop and play functionality
const playStop = () => {
console.log('object')
let enabled = videoView.getVideoTracks()[0].enabled;
//if enabled is true , set Play video
if (enabled) {
  videoView.getVideoTracks()[0].enabled = false;
  setPlayVideo()
} 
// if enabled is false, set stop video
else {
  setStopVideo()
  videoView.getVideoTracks()[0].enabled = true;
}
}
//Creating buttons

//Sets the mute microphone button
const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  //Sets the Unmute microphone button
  const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  //Sets Stop Video Button
  const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
  }
  
  //Sets Play Video Button
  const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
  }
  

  




