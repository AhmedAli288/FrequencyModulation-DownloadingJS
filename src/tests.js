import "./styles.css";
import PizzicatoRecorder from "pizzicato-recorder";
import Pizzicato from "pizzicato";
import audio from "../viper.mp3";

PizzicatoRecorder(Pizzicato);

let audioCtx = new AudioContext();
let offlineCtx = new OfflineAudioContext(2, 44100 * 40, 44100);

let source = offlineCtx.createBufferSource();

// define constants for dom nodes

const pre = document.querySelector("pre");
const myScript = document.querySelector("script");
const play = document.querySelector(".play");
const stop = document.querySelector(".stop");

// use XHR to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source

function getData() {
  let request = new XMLHttpRequest();

  request.open("GET", audio, true);

  request.responseType = "arraybuffer";

  request.onload = function () {
    let audioData = request.response;

    audioCtx.decodeAudioData(audioData, function (buffer) {
      var myBuffer = buffer;
      source.buffer = myBuffer;

      const biquadFilter = offlineCtx.createBiquadFilter();
      biquadFilter.type = "highpass";
      // biquadFilter.frequency.value = 1000;
      // biquadFilter.detune.value = 15360; //[-153600, 153600]
      biquadFilter.frequency.setValueAtTime(20000, offlineCtx.currentTime);

      // source.disconnect(audioCtx.destination);
      source.connect(biquadFilter);
      // biquadFilter.connect(audioCtx.destination);
      biquadFilter.connect(offlineCtx.destination);
      source.start();
      // source.loop = true;

      offlineCtx
        .startRendering()
        .then(function (renderedBuffer) {
          console.log("Rendering completed successfully");
          var audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          var song = audioCtx.createBufferSource();
          song.buffer = renderedBuffer;
          console.log("buff", renderedBuffer.getChannelData(1));
          // song.connect(audioCtx.destination);
          song.start();
        })
        .catch(function (err) {
          console.log("Rendering failed: " + err);
          // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
        });
    });
  };

  request.send();
  // function handleAudio(file, fileType) {
  //     console.log("Stop");
  //     let url = URL.createObjectURL(file);
  //     let hf = document.createElement("a");
  //     hf.href = url;
  //     hf.download = "AtLastSuccess." + fileType;
  //     hf.innerHTML = hf.download;
  //     hf.click();
  // }
}

// Run getData to start the process off

getData();

offlineCtx.oncomplete = function (e) {
  let song = audioCtx.createBufferSource();
  song.buffer = e.renderedBuffer;

  song.connect(audioCtx.destination);

  play.onclick = function () {
    song.start();
  };

  console.log("completed!");
};

// dump script to pre element
