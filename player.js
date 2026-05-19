class AudioPlayer {

async PlayAudio(station, line, destination, nearby, nextStop) {
    let audiothings = [];
    if (nearby == "At Station") {
        audiothings = this.AtStation(line, destination, nextStop);
        console.log(audiothings);
    } else {
        audiothings = this.ApproachingStation(line, nextStop, destination, station);
        console.log(audiothings);
    }
    
    async function playAudioAndWait(audio) {
        return new Promise((resolve, reject) => {    
        // Resolve the promise when audio finishes
        audio.addEventListener('ended', () => resolve());
        
        // Reject if there is an error
        audio.addEventListener('error', (e) => reject(e));
        
        // Start playback
        audio.play().catch(reject);      
        console.log(audio + " is playing");
    });
}
    for (let i=0; (i<audiothings.length); i++) {
        await playAudioAndWait(audiothings[i]);        
    }
}

AtStation(line, destination, nextStop) {
    var audios = []

    const doorChime = (new Audio("/resc/audio/Chimes/DoorChime.wav"));
    doorChime.volume = 0.25;
    audios.push(doorChime);
    audios.push(new Audio("/resc/audio/Doors/OpenDoor.wav"));
    audios.push(new Audio(`/resc/audio/LineNames/${line}.wav`));
    audios.push(new Audio(`/resc/audio/Stations/${destination}.wav`));
    const whenboarding = (new Audio("/resc/audio/Doors/whenboarding.wav"));
    whenboarding.volume = 1;
    audios.push(whenboarding);
    audios.push((nextStop == destination) ? new Audio("/resc/audio/TransitionWords/NextLastStop.wav") : new Audio("/resc/audio/TransitionWords/NextStop.wav"));
    audios.push(new Audio(`/resc/audio/Stations/${nextStop}.wav`));
    audios.push(doorChime);
    audios.push(new Audio("/resc/audio/Doors/CloseDoor.wav"));

    return audios;

}

ApproachingStation(line, station, destination, previous) {
    
    const metroLineLists = {
  "Red": [
    "Bethesda", 
    "Brookland-CUA", 
    "Cleveland Park", 
    "Farragut North", 
    "Forest Glen", 
    "Fort Totten", 
    "Friendship Heights", 
    "Glenmont", 
    "Grosvenor-Strathmore", 
    "Medical Center", 
    "NoMa-Gallaudet U", 
    "North Bethesda", 
    "Rhode Island Ave", 
    "Rockville", 
    "Shady Grove", 
    "Silver Spring", 
    "Takoma", 
    "Tenleytown-AU", 
    "Twinbrook", 
    "Union Station", 
    "Van Ness-UDC", 
    "Wheaton", 
    "Woodley Park"
  ],
  "Orange": [
    "Capitol South", 
    "Court House", 
    "Deanwood", 
    "Dunn Loring", 
    "East Falls Church", 
    "Eastern Market", 
    "Federal Center SW", 
    "Federal Triangle", 
    "Foggy Bottom-GWU", 
    "L'Enfant Plaza", 
    "Landover", 
    "Metro Center", 
    "Minnesota Ave", 
    "New Carrollton", 
    "Potomac Ave", 
    "Stadium-Armory", 
    "Vienna"
  ],
  "Silver": [
    "Ashburn", 
    "Capitol South", 
    "Court House", 
    "East Falls Church", 
    "Eastern Market", 
    "Federal Center SW", 
    "Federal Triangle", 
    "Foggy Bottom-GWU", 
    "Greensboro", 
    "Herndon", 
    "Innovation Center", 
    "Loudoun Gateway", 
    "L'Enfant Plaza", 
    "McLean", 
    "Metro Center", 
    "Potomac Ave", 
    "Reston Town Center", 
    "Spring Hill", 
    "Stadium-Armory", 
    "Tysons", 
    "Washington Dulles International Airport", 
    "Wiehle-Reston East"
  ],
  "Blue": [
    "Addison Road", 
    "Benning Road", 
    "Braddock Road", 
    "Capitol Heights", 
    "Capitol South", 
    "Downtown Largo", 
    "Eastern Market", 
    "Federal Center SW", 
    "Federal Triangle", 
    "Foggy Bottom-GWU", 
    "Franconia-Springfield", 
    "King St-Old Town", 
    "L'Enfant Plaza", 
    "Metro Center", 
    "Morgan Boulevard", 
    "Potomac Ave", 
    "Stadium-Armory", 
    "Van Dorn Street"
  ],
  "Yellow": [
    "Archives", 
    "Braddock Road", 
    "Gallery Place", 
    "Huntington", 
    "King St-Old Town", 
    "Mt Vernon Sq",
    "Shaw-Howard U",
    "U Street",
    "Columbia Heights",
    "Georgia Ave-Petworth",
    "Fort Totten", 
    "College Park-U of Md",
    "Greenbelt"
  ],
  "Green": [
    "Anacostia", 
    "Archives", 
    "Branch Ave", 
    "College Park-U of Md", 
    "Columbia Heights", 
    "Congress Heights", 
    "Fort Totten", 
    "Gallery Place", 
    "Georgia Ave-Petworth", 
    "Greenbelt", 
    "Mt Vernon Sq", 
    "Navy Yard-Ballpark", 
    "Naylor Road", 
    "Shaw-Howard U", 
    "Southern Ave", 
    "Suitland", 
    "U Street", 
    "Waterfront"
  ]
};

    var audios = [];
    
    audios.push(new Audio("/resc/audio/TransitionWords/ThisIs.wav"));
    audios.push(new Audio(`/resc/audio/Stations/${station}.wav`));
    if (station == destination) {
        audios.push(new Audio("/resc/audio/TransitionWords/LastStop.wav"));
    }
    
    const addAudioIfExists = async (url, volume = null) => {
        if (await this.fileExists(url)) {
            const audio = new Audio(url);
            if (volume !== null) audio.volume = volume;
            audios.push(audio);
        } else {
            console.warn(`Audio file not found: ${url}`);
        }
    };

    var slDest = "Downtown Largo";
    if (line == "Silver") {slDest = ((destination == "New Carrolton") || (destination == "Downtown Largo") ? "WEST" : "EAST");}

    addAudioIfExists(`/resc/audio/Transfers/${line}/${station}.wav`);
    addAudioIfExists(`/resc/audio/Transfers/${line}/${station}${destination}.wav`);
    addAudioIfExists(`/resc/audio/Transfers/${line}/${station}${slDest}.wav`);
    addAudioIfExists(`/resc/audio/Transfers/${line}/${station}${slDest}${destination}.wav`);
    addAudioIfExists(`/resc/audio/Transfers/${line}/${station}WEST${previous}.wav`);

    console.log(metroLineLists[line].includes(station));
    if (metroLineLists[line].includes(station)) {
        addAudioIfExists("/resc/audio/DoorDir/Left.wav");
    } else{
        addAudioIfExists("/resc/audio/DoorDir/Right.wav");
    }
    console.log("Doors will open on the " + (metroLineLists[line].includes(station)) ? "Left" : "Right");


    return audios;
}

async fileExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error(`Error checking file existence for ${url}:`, error);
        return false;
    }
}

}