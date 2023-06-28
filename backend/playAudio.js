//plays audio for a set amount of seconds
function playAudio(seconds) {
  console.log("playingAudio");

  setTimeout(() => {

  }, seconds * 1000)
}

module.exports = { playAudio };