console.log("let's write the javascript code")
let songs;
let curFolder;
let currentSong = new Audio();


//function to convert seconds into Minute seconds
function secondsToMinuteSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    // Calculate the number of minutes
    var minutes = Math.floor(seconds / 60);

    // Calculate the remaining seconds
    var remainingSeconds = Math.floor(seconds % 60);

    // Format the minutes and seconds with leading zeros if necessary
    var formattedMinutes = String(minutes).padStart(2, '0');
    var formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Concatenate the minutes and seconds with a colon separator
    var formattedTime = formattedMinutes + ':' + formattedSeconds;

    return formattedTime;
}


//getSongs function
async function getSongs(folder) {
    curFolder = folder;
    //fetch api I've used 
    let a = await fetch(`/songs/${folder}`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs = [];//empty array
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            /* here element.href.split(`/${folder}/`)[1]) will give array
            of length 2 and we are interested in considering the second place index i.e. 1*/
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }
    // return songs;

    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    // console.log(songUL.innerHTML);
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
      <img class="invert" src="./music.svg" alt="music icons">
      <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Song Artists</div>
      </div>
      <div class="playnow">
      <span>Play Now</span>
      <img class="invert" src="./play.svg" alt="play now">
      </div> </li>`;
    }
    //Attach an event listenser to each song 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })

    });
    return songs;

}

const playMusic = (track, pause = false) => {
    currentSong.src = `./${curFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    //decode uri means uniforn resource identifier is decode from encoded
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

//Display Albums method
async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div")
    // console.log(div);
    div.innerHTML = response;
    console.log(div);
    let anchors = div.getElementsByTagName("a")
    console.log(anchors)
    let cardContainer = document.querySelector(".cardContainer")
    // console.log(anchors)
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            console.log(e.href.split("/").slice(-2)[0])
            let folder = e.href.split("/").slice(-2)[0]
            // console.log(folder)
            //get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card ">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                    color="#000000" fill="none">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor" fill="#000" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
            </div>
            <img src="/songs/${folder}/covers.jpeg" alt="artist-image">
            <h2>${response.title}</h2>
            <p>Artist</p>

        </div>`

        }
    }
    //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e)
        e.addEventListener("click", async items => {
            console.log(items, items.currentTarget.dataset)
            songs = await getSongs(`songs/${items.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        })
    })
}

async function main() {


    await getSongs("songs/cs");
    // // console.log(songs)
    playMusic(songs[0], true)

    //display all the albums pn the page
    displayAlbums();


    //Attach an event listener to prev, play and next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg"
        } else {
            currentSong.pause();
            play.src = "play.svg"
        }
    })
    //Listen for time upadate event function
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinuteSeconds(currentSong.currentTime)} / ${secondsToMinuteSeconds(currentSong.duration)}`


        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an event listener
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
        console.log(e.offsetX, e.target.getBoundingClientRect().width,
            currentSong.currentTime, currentSong.duration, percent);

        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    //Add an event listener for the hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%";
    })
    // Add an event listener for the close/cross button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add an event listener for the previous button
    previous.addEventListener("click", () => {
        currentSong.pause();
        console.log("previous is clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }


    })

    // add an event listener for the next button
    next.addEventListener("click", () => {
        currentSong.pause();
        console.log("next is clicked");
        // console.log(currentSong.src);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(songs, index);
        if ((index + 1) < songs.length - 1) {
            playMusic(songs[index + 1])
        }
        // else{
        //     playMusic(songs[index + 1])
        // }
    })

    // add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value);

        currentSong.volume = parseInt(e.target.value) / 100
    })


    //Add the event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log(e.target)
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = 0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
        }
    })


}

main();

