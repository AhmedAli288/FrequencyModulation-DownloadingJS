import "./styles.css";
import PizzicatoRecorder from "pizzicato-recorder";
import Pizzicato from "pizzicato";
import audio from "../viper.mp3";

PizzicatoRecorder(Pizzicato);

const myAudio = document.querySelector("audio");
const pre = document.querySelector("pre");
const myScript = document.querySelector("script");
const button = document.querySelector("button");
let audioCtx;

pre.innerHTML = myScript.innerHTML;

myAudio.addEventListener("play", () => {
    if (!audioCtx) {
        // Set up AudioContext
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(myAudio);

        const biquadFilter = audioCtx.createBiquadFilter();
        biquadFilter.type = "highpass";
        // biquadFilter.frequency.value = 1000;
        // biquadFilter.detune.value = 15360; //[-153600, 153600]
        biquadFilter.frequency.setValueAtTime(
            40000,
            audioCtx.currentTime
        );

        // connect the AudioBufferSourceNode to the destination
        source.connect(audioCtx.destination);

        button.onclick = function () {
            const active = button.getAttribute("data-active");
            if (active === "false") {
                button.setAttribute("data-active", "true");
                button.innerHTML = "Remove compression";

                source.disconnect(audioCtx.destination);
                console.log("start");
                source.connect(biquadFilter);
                biquadFilter.connect(audioCtx.destination);
                // Pizzicato.Recorder.start({ mute: false });
                // source.start()

            } else if (active === "true") {
                button.setAttribute("data-active", "false");
                button.innerHTML = "Add compression";
                // Pizzicato.Recorder.stop("wav", handleAudio);

                source.disconnect(biquadFilter);
                // compressor.disconnect(audioCtx.destination);
                source.connect(audioCtx.destination);
            }
        };
        var playerID = document.getElementById('music');
        playerID.addEventListener("ended", function (e) {
            alert('ended');
        }, false);
    }
});

// aud.onended = function() {
//   alert("The audio has ended");
//   // Pizzicato.Recorder.stop("wav", handleAudio);

// };

function handleAudio(file, fileType) {
    console.log("Stop");
    let url = URL.createObjectURL(file);
    let hf = document.createElement("a");
    hf.href = url;
    hf.download = "AtLastSuccess." + fileType;
    hf.innerHTML = hf.download;
    hf.click();
}


// document.getElementById("app").innerHTML = `
// <h1>Compressor example</h1>
// <audio controls>
//   <!-- <source src="viper.ogg" type="audio/ogg" /> -->
//   <source id="music" src="viper.mp3" type="audio/mp3" />
//   <p>Browser too old to support HTML5 audio? How depressing!</p>
// </audio>
// <button data-active="false">Add compression</button>
// <pre></pre>
// `;