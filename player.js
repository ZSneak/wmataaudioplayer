class AudioPlayer {

PlayAudio(station, line, destination, nearby, nextStop, status) {
    let audiothings = [];
    if (nearby == "At Station") {
        audiothings = this.AtStation(line, destination, nextStop);
        console.log(audiothings);
    } else {
        audiothings = this.ApproachingStation(line, destination, nextStop);
        console.log(audiothings);
    }
    let currentIndex = 0;
    function playNext() {
        if (currentIndex < audioFiles.length) {
            var currentAudio = audiothings[currentIndex];
            currentIndex++;
            currentAudio.play();
            currentAudio.onended = playNext;
            }
        }
}

AtStation(line, destination, nextStop) {
    var audios = []
    
    audios.push(new Audio("/resc/audio/Chimes/DoorChime.wav"));
    audios.push(new Audio("/resc/audio/Doors/OpenDoor.wav"));
    audios.push(new Audio(`/resc/audio/LineNames/${line}.wav`));
    audios.push(new Audio(`/resc/audio/Stations/${destination}.wav`));
    audios.push(new Audio("/resc/audio/Doors/movetothecenterofthecar.wav"));
    audios.push(new Audio("/resc/audio/TransitionWords/NextStop.wav"));
    audios.push(new Audio(`/resc/audio/Stations/${nextStop}.wav`));
    audios.push(new Audio("/resc/audio/Doors/CloseDoor.wav"));

    return audios;

}

ApproachingStation(line, destination) {}
}
