let audiothings = [];
async function PlayAudio22(station, line, destination, nearby, nextStop) {
    if (nearby == "At Station") {
        audiothings = AtStation2(line, destination, nextStop);
        console.log(audiothings);
    } else {
        audiothings = this.ApproachingStation(line, destination, nextStop);
        console.log(audiothings);
    }
    for (let i=0; (i<audiothings.length); i++) {
        await playAudioAndWait(audiothings[i]);        
    }
}

function playAudioAndWait(audio) {
  return new Promise((resolve, reject) => {    
    // Resolve the promise when audio finishes
    audio.addEventListener('ended', () => resolve());
    
    // Reject if there is an error
    audio.addEventListener('error', (e) => reject(e));
    
    // Start playback
    audio.play().catch(reject);
  });
}

function AtStation2(line, destination, nextStop) {
    var audios = []

    audios.push(new Audio("/resc/audio/Chimes/DoorChime.wav"));
    audios.push(new Audio("/resc/audio/Doors/OpenDoor.wav"));
    audios.push(new Audio(`/resc/audio/LineNames/${line}.wav`));
    audios.push(new Audio(`/resc/audio/Stations/${destination}.wav`));
    audios.push(new Audio("/resc/audio/Doors/whenboarding.wav"));
    audios.push(new Audio("/resc/audio/TransitionWords/NextStop.wav"));
    audios.push(new Audio(`/resc/audio/Stations/${nextStop}.wav`));
    audios.push(new Audio("resc/audio/Chimes/DoorChime.wav"));
    audios.push(new Audio("/resc/audio/Doors/CloseDoor.wav"));

    return audios;

}
function PlayAudio2(){
PlayAudio22("Archives", "Green", "Greenbelt", "At Station", "Gallery Place");
}