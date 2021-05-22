import React, { useEffect, useState } from 'react';
import './Proto.css';
import io from 'socket.io-client';
import Peer from 'peerjs';
import { useParams } from 'react-router';
import Loading from './Loading';
const socket = io.connect('http://localhost:5000');
const myPeer = new Peer(undefined, {
  host: '/',
  port: 5000,
  path: '/peerjs',
});
function Proto() {
  const { roomId } = useParams();
  const [stream, setStream] = useState();
  const [quizSettings, setquizSettings] = useState(true);
  const [category, setCategory] = useState();
  const [difficulty, setDifficulty] = useState('');
  const [catHistory, setCatHistory] = useState('');
  const [catGadgets, setCatGadgets] = useState('');
  const [catComputers, setCatComputers] = useState('');
  const [catEasy, setCatEasy] = useState('');
  const [catMedium, setCatMedium] = useState('');
  const [catHard, setCatHard] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [scoreboard, setscoreboard] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState();
  const [score, setScore] = useState(0);
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
        socket.on('quiz-started', (ques) => {
          setQuizStarted(true);
          setquizSettings(false);
          setQuizQuestions(ques);
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
  const handleSetCategoryHistory = () => {
    setCatHistory('active');
    setCatGadgets('');
    setCatComputers('');
    setCategory(23);
  };
  const handleSetCategoryGadgets = () => {
    setCatHistory('');
    setCatGadgets('active');
    setCatComputers('');
    setCategory(30);
  };
  const handleSetCategoryComputers = () => {
    setCatHistory('');
    setCatGadgets('');
    setCatComputers('active');
    setCategory(18);
  };
  const handleSetDifficultyEasy = () => {
    setCatEasy('active');
    setCatMedium('');
    setCatHard('');
    setDifficulty('easy');
  };
  const handleSetDifficultyMedium = () => {
    setCatEasy('');
    setCatMedium('active');
    setCatHard('');
    setDifficulty('medium');
  };
  const handleSetDifficultyHard = () => {
    setCatEasy('');
    setCatMedium('');
    setCatHard('active');
    setDifficulty('hard');
  };
  const handleStartQuiz = async () => {
    setquizSettings(false);
    setQuizStarted(true);
    let quesData;
    await fetch(
      `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
    )
      .then((response) => response.json())
      .then((data) => {
        quesData = data;
      });
    socket.emit('start-quiz', quesData.results);
  };
  const handleIncorrectOption = (e, index, i) => {
    if (
      document
        .getElementById(`option${index}_correct`)
        .classList.contains('active')
    )
      setScore(score - 10);
    const options = document.querySelectorAll(`.option_btn${index}`);
    options.forEach((option) => {
      option.classList.remove('active');
    });
    document.getElementById(`option${index}_${i}`).classList.toggle('active');
  };
  const handleCorrectOption = (e, index) => {
    if (
      document
        .getElementById(`option${index}_correct`)
        .classList.contains('active') === false
    )
      setScore(score + 10);
    const options = document.querySelectorAll(`.option_btn${index}`);
    options.forEach((option) => {
      option.classList.remove('active');
    });
    document
      .getElementById(`option${index}_correct`)
      .classList.toggle('active');
  };
  const handleSubmitQuiz = () => {
    setscoreboard(true);
    setQuizStarted(false);
  };
  const handleAnotherQuiz = () => {
    setscoreboard(false);
    setQuizStarted(false);
    setquizSettings(true);
  };
  return (
    <div className='Proto'>
      <div className='main__left'>
        <div className='quiz__box'>
          {quizSettings && (
            <div className='quiz__settings'>
              <h1>Categories</h1>
              <button
                className={`category__btn ${catHistory}`}
                onClick={handleSetCategoryHistory}
              >
                History
              </button>
              <button
                className={`category__btn ${catGadgets}`}
                onClick={handleSetCategoryGadgets}
              >
                Gadgets
              </button>
              <button
                className={`category__btn ${catComputers}`}
                onClick={handleSetCategoryComputers}
              >
                Computers
              </button>
              <h1>Difficulty</h1>
              <button
                className={`category__btn ${catEasy}`}
                onClick={handleSetDifficultyEasy}
              >
                Easy
              </button>
              <button
                className={`category__btn ${catMedium}`}
                onClick={handleSetDifficultyMedium}
              >
                Medium
              </button>
              <button
                className={`category__btn ${catHard}`}
                onClick={handleSetDifficultyHard}
              >
                Hard
              </button>
              <h1>Start Quiz</h1>
              <button className='start__btn' onClick={handleStartQuiz}>
                Start
              </button>
            </div>
          )}
          {quizStarted && (
            <div className='quiz'>
              {quizQuestions &&
                quizQuestions.map((question, index) => {
                  return (
                    <div className='quiz__questions'>
                      <h3>{`Q${index + 1}. ${question.question}`}</h3>
                      <br />
                      {question.incorrect_answers.map((option, i) => {
                        return (
                          <div>
                            <button
                              id={`option${index + 1}_${i + 1}`}
                              className={`option_btn${
                                index + 1
                              } quiz__option__btn`}
                              onClick={(e) =>
                                handleIncorrectOption(e, index + 1, i + 1)
                              }
                            >{`${option}`}</button>
                            <br />
                          </div>
                        );
                      })}
                      <button
                        id={`option${index + 1}_correct`}
                        className={`option_btn${index + 1} quiz__option__btn`}
                        onClick={(e) => handleCorrectOption(e, index + 1)}
                      >{`${question.correct_answer}`}</button>
                      <br />
                    </div>
                  );
                })}
              {!quizQuestions && !scoreboard && <Loading />}
              {quizQuestions && (
                <div>
                  <br />
                  <br />
                  <button
                    className='submit__quiz__btn'
                    onClick={handleSubmitQuiz}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          )}
          {scoreboard && (
            <div className='scoreboard'>
              <h4>{`Your score:- ${score}`}</h4>
              <button className='another__quiz' onClick={handleAnotherQuiz}>
                Try another quiz
              </button>
            </div>
          )}
        </div>
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
