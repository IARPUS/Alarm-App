//plays audio for a set amount of seconds
import { Howl } from 'howler'
function playAudio(seconds) {
  const sound = new Howl({
    src: ['./audioFiles/alarmSound.mp3'], // Replace with the actual path to your alarm file
    autoplay: true,
    loop: true,
    duration: 100,
    volume: 1, // Adjust the volume as needed
  });
  sound.play();
  const milliseconds = seconds * 1000;
  setTimeout(() => {
    sound.stop();
  }, milliseconds)
}

export { playAudio }