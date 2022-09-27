import "./styles.css";
import PizzicatoRecorder from "pizzicato-recorder";
import Pizzicato from "pizzicato";
import audio from "../viper.mp3";

PizzicatoRecorder(Pizzicato);

document.addEventListener("click", () => {
  console.log("start");
  Pizzicato.Recorder.start({ mute: false });
  var sound = new Pizzicato.Sound(audio, () => {
    sound.addEffect(delay);
    sound.play();
  });
  var delay = new Pizzicato.Effects.HighPassFilter({
    frequency: 22000,
    peak: 10,
  });

  // await sleep(2000);
  // sound.connect(dest);
  sound.on("end", function () {
    console.log("end");
    Pizzicato.Recorder.stop("wav", handleAudio);
  });
});

// document.addEventListener("click", () => {
//   var sineWave = new Pizzicato.Sound({
//     source: "wave",
//     options: {
//       frequency: 440
//     }
//   });

//   sineWave.play();
// });

function handleAudio(file, fileType) {
  console.log("Stop");
  let url = URL.createObjectURL(file);
  let hf = document.createElement("a");
  hf.href = url;
  hf.download = "AtLastSuccess." + fileType;
  hf.innerHTML = hf.download;
  hf.click();
}

document.getElementById("app").innerHTML = `
<h1>Frequency Modulation & Download!</h1>
<div>
  Download from
  <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">here</a>.
</div>
`;
