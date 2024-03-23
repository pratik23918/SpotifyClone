console.log("let's write the javascript code")


let currentSong= new Audio();


//function to convert seconds into Minute seconds
function secondsToMinuteSeconds(seconds) {
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
async function getSongs() {
    //fetch api I've used 
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = [];//empty array
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }

    }
    return songs;

}

const playMusic=(track,pause=false)=>{
   currentSong.src="./songs/"+track;
   if(!pause){
    currentSong.play();
    play.src="pause.svg";
   }
  
  
   document.querySelector(".songinfo").innerHTML=decodeURI(track);
   //decode uri means uniforn resource identifier is decode from encoded
   document.querySelector(".songtime").innerHTML="00:00/00:00"
}
async function main() {
    
    //get the list of all the songs 
    let songs = await getSongs();
    // console.log(songs)
    playMusic(songs[0],true) 

    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    // console.log(songUL.innerHTML);

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
    e.addEventListener("click", element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML)
    })
       
    });
   //Attach an event listener to prev, play and next
   play.addEventListener("click",()=>{
    if(currentSong.paused){
          currentSong.play();
          play.src="pause.svg"
    }else{
        currentSong.pause();
        play.src="play.svg"
    }
   })
  //Listen for time upadate event function
  currentSong.addEventListener("timeupdate",()=>{
   console.log(currentSong.currentTime, currentSong.duration);
   document.querySelector(".songtime").innerHTML=`${secondsToMinuteSeconds(currentSong.currentTime)}/${secondsToMinuteSeconds(currentSong.duration)}`

   
  document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
  })

  //Add an event listener
  document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent=e.offsetX/e.target.getBoundingClientRect().width*100;
    console.log(e.offsetX, e.target.getBoundingClientRect().width,
    currentSong.currentTime,  currentSong.duration,percent);
  
 document.querySelector(".circle").style.left=percent+"%";
 currentSong.currentTime=((currentSong.duration)*percent)/100;
  })

  //Add an event listener for the hamburger
  document.querySelector(".hamburger").addEventListener("click", ()=>{
     document.querySelector(".left").style.left="0%";
  })
// Add an event listener for the close/cross button
  document.querySelector(".close").addEventListener("click",()=>{
      document.querySelector(".left").style.left="-120%"
  })
 
}

main();

