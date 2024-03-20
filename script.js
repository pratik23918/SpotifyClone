console.log("let's write the javascript code")


async function getSongs(){
    let a= await fetch("http://127.0.0.1:3000/songs/")
    let response = await  a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    let songs=[];//empty array
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href);
        }
        
    } 
    return songs;
    
}
async function main(){
    //get the list of alll the songs 
    let songs=await 
    getSongs();
    console.log(songs)

    // Play the first song 
    var audio = new Audio(songs[0]);
    audio.play();
    
}

main();

