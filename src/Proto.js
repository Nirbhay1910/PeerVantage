import React, { useEffect, useState } from 'react';
import './Proto.css';
import io from 'socket.io-client';
import Peer from 'peerjs';
import { useParams } from 'react-router';
const socket = io.connect('http://localhost:5000');
const myPeer = new Peer(undefined, {
  host: '/',
  port: 5000,
  path: '/peerjs',
});
function Proto() {
  const { roomId } = useParams();
  const [stream, setStream] = useState();
  let myVideo = document.createElement('video');
  myVideo.muted = true;
  const peers = {};
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        addVideoStream(myVideo, stream);
        myPeer.on('call', (call) => {
          call.answer(stream);
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });
        socket.on('user-connected', (userId) => {
          connectToNewUser(userId, stream);
        });

        socket.on('user-disconnected', (userId) => {
          if (peers[userId]) peers[userId].close();
        });
      });

    myPeer.on('open', (id) => {
      socket.emit('join-room', roomId, id);
    });
  }, []);

  const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
      video.remove();
    });

    peers[userId] = call;
  };
  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    document.getElementById('video-grid').append(video);
  };

  const muteUnmute = () => {
    const enabled = stream.getAudioTracks()[0].enabled;
    if (enabled) {
      stream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      stream.getAudioTracks()[0].enabled = true;
    }
  };
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `;
    document.querySelector('.main__mute_button').innerHTML = html;
  };

  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `;
    document.querySelector('.main__mute_button').innerHTML = html;
  };
  const playStop = () => {
    console.log('object');
    let enabled = stream.getVideoTracks()[0].enabled;
    if (enabled) {
      stream.getVideoTracks()[0].enabled = false;
      setPlayVideo();
    } else {
      setStopVideo();
      stream.getVideoTracks()[0].enabled = true;
    }
  };
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `;
    document.querySelector('.main__video_button').innerHTML = html;
  };

  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `;
    document.querySelector('.main__video_button').innerHTML = html;
  };

  return (
    <div className='Proto'>
      <div className='main__left'>
        <div className='quiz__box'></div>
      </div>
      <div className='main__right'>
        <div className='main__videos'>
          <div id='video-grid'></div>
        </div>
        <div className='main__controls'>
          <div className='main__controls__block'>
            <div
              onClick={muteUnmute}
              className='main__controls__button main__mute_button'
            >
              <i className='fas fa-microphone'></i>
              <span>Mute</span>
            </div>
            <div
              onClick={playStop}
              className='main__controls__button main__video_button'
            >
              <i className='fas fa-video'></i>
              <span>Stop Video</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Proto;
