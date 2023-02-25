let songQueueList = [
   // {

   // }
]
let palylsitList = [
   // {

   // }
]
try{
   palylsitList = [...JSON.parse(window.localStorage.getItem('playlsit'))]
   renderPlaylistList()
}catch{
   console.log("error while retriving local storage")
}

fetch("https://api.napster.com/v2.2/tracks/top?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=10")
.then((response)=>response.json())
.then((data)=>{
   console.log(data);
   tracks = data.tracks; // there is a tracks array inside tracks key of the object taht I have fetched
   const topTracks = document.querySelector('.topTracks-container');
   tracks.forEach(track => {
      const element = `
         <div data-track-url="${track.previewURL}" data-track-id="${track.id}" class="track-card">
            <img class="track-image" src="https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/200x200.jpg" />
            <i data-song-option-toggle="${track.id}" class="fa-solid fa-ellipsis"></i>
                  <div data-track-id="${track.id}" class="song-card-options">
                     <p data-value="addToPlaylist" data-track-id="${track.id}" class="song-card-option">Add to playlist</p>
                     <p data-value="addToQueue" data-track-id="${track.id}" class="song-card-option">Add to queue</p>
                     <p data-value="playNow" data-track-id="${track.id}" class="song-card-option">Play now</p>
                  </div>
            <p class="track-title">${track.name}</p>
         
            </div>
      `
      topTracks.insertAdjacentHTML('beforeend', element);
   });
})

document.querySelector('body').addEventListener('click', (e) => {
   if(e.target.classList.contains('track-card')){
      const ref = e.target;
      console.log(ref)
      songUrl = e.target.dataset.trackUrl
      songName = ref.querySelector('.track-title').textContent;
      imgUrl = ref.querySelector('.track-image').src
      playTheSong({
         songUrl, songName, imgUrl
      })

   };

   if(e.target.classList.contains('artist-container')){
      let url = e.target.dataset.songsLink;
      (async () => {
         const data = await renderSearchOutput(url)
         renderTracksForSearch(data.tracks, ".artist-output")
      })();
   }
   if(e.target.classList.contains('album-container')){
      let url = e.target.dataset.songsLink;
      (async () => {
         const data = await renderSearchOutput(url)
         renderTracksForSearch(data.tracks, ".album-output")
      })();
   }
   if(e.target.classList.contains('playlist-container')){
      let url = e.target.dataset.songsLink;
      (async () => {
         console.log(url);
         const data = await renderSearchOutput(url + "?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=10")
         console.log("playlist tracks", data);
         renderTracksForSearch(data.tracks, ".playlists-output")
      })();
   }

   if(e.target.id === "home-link"){
      document.querySelector('.nav-links').classList.remove('open')
      document.querySelector('.topTracks').classList.remove("hide-page")
      document.querySelector('.top-playlist').classList.remove("hide-page")
      document.querySelector('.playlist-page').classList.add("hide-page")
      document.querySelector('.search-page').classList.add("hide-page")  
   }
   if(e.target.id === "playlist-link"){
      document.querySelector('.nav-links').classList.remove('open')
      document.querySelector('.topTracks').classList.add("hide-page")
      document.querySelector('.top-playlist').classList.add("hide-page")
      document.querySelector('.playlist-page').classList.remove("hide-page")  
      document.querySelector('.search-page').classList.add("hide-page")  
   }
   if(e.target.id === "search-link"){
      document.querySelector('.nav-links').classList.remove('open')
      document.querySelector('.search-page').classList.remove("hide-page")  
      document.querySelector('.topTracks').classList.add("hide-page")
      document.querySelector('.top-playlist').classList.add("hide-page")
      document.querySelector('.playlist-page').classList.add("hide-page")  
      
   }
   if(e.target.classList.contains('option')){
      const parent = e.target.parentNode.parentNode;
      parent.classList.remove('open-options');
      const txt = e.target.innerText;
      console.log(txt)
      const display = document.querySelector('.filter > .display');
      display.innerHTML = `${txt} <i class="fa-solid fa-sliders"></i>`
      console.log(e.target.dataset.value);
      let searchPage = document.querySelector(".search-page");
      searchPage.dataset.value = e.target.dataset.value;     
   }
   if(e.target.dataset.songOptionToggle){
      // console.log("clicked on eclipse", e.target.dataset.songOptionTogglep)
      const optionContainer = e.target.parentNode.querySelector(`.song-card-options`)
      // console.log(optionContainer);
      optionContainer.classList.toggle('display-options')
   }
   if(e.target.classList.contains('song-card-option')){
      // console.log(e.target);
      e.target.parentNode.classList.remove('display-options')
      let cmd = (e.target.dataset.value)
      if(cmd === "addToPlaylist"){
         palylsitList.push({
            id : `${e.target.parentNode.parentNode.dataset.trackId}`,
            songUrl : `${e.target.parentNode.parentNode.dataset.trackUrl}`,
            songName : `${e.target.parentNode.parentNode.querySelector('.track-title').innerText}`,
            imgUrl : `${e.target.parentNode.parentNode.querySelector('.track-image').src}`
         })
         window.localStorage.setItem('playlsit', JSON.stringify(palylsitList))
         renderPlaylistList()
         
      }else if(cmd === "addToQueue"){
         console.log(e.target.parentNode.parentNode, "song required", "queue")
         console.log(e.target.parentNode.parentNode, "song required", "playlist")
         songQueueList.push({
            id : `${e.target.parentNode.parentNode.dataset.trackId}`,
            songUrl : `${e.target.parentNode.parentNode.dataset.trackUrl}`,
            songName : `${e.target.parentNode.parentNode.querySelector('.track-title').innerText}`,
            imgUrl : `${e.target.parentNode.parentNode.querySelector('.track-image').src}`
         })
         renderqueue()
         
      }else if(cmd === "playNow"){
         console.log(e.target.parentNode.parentNode, "song required", "play")
         console.log(e.target.parentNode.parentNode.dataset)

      }else if(cmd === "removeSong"){
         console.log(e.target.parentNode.parentNode, "look here")
         const id = e.target.parentNode.parentNode.dataset.trackId
         newPlaylist = palylsitList.filter(item => item.id !== id) 
         palylsitList = newPlaylist;
         renderPlaylistList();
         window.localStorage.setItem('playlsit', JSON.stringify(palylsitList))

      }
   }
   if(e.target.id === "queue-remove-btn"){
      let id = e.target.parentNode.dataset.trackId;
      const newQueueList = songQueueList.filter(item => item.id !== id);
      songQueueList = [...newQueueList];
      renderqueue();
   }
})

function renderPlaylistList(){
   const container = document.querySelector('.playlistList-container');
   while(container.firstChild){
      container.firstChild.remove();
   }
   palylsitList.forEach(song => {
      console.log(song);
      const element = `
      <div data-track-url="${song.songUrl}" data-track-id="${song.id}" class="track-card">
      <img class="track-image" src="${song.imgUrl}" />
      <i data-song-option-toggle="${song.id}" class="fa-solid fa-ellipsis"></i>
                      <div data-track-id="${song.id}" class="song-card-options">
                          <p data-value="addToPlaylist" data-track-id="${song.id}" class="song-card-option">Add to playlist</p>
                          <p data-value="addToQueue" data-track-id="${song.id}" class="song-card-option">Add to queue</p>
                          <p data-value="playNow" data-track-id="${song.id}" class="song-card-option">Play now</p>
                          <p data-value="removeSong" data-track-id="${song.id}" class="song-card-option">Remove Song</p>
                      </div>
      <p class="track-title">${song.songName}</p>
   
      </div>
      `
      container.insertAdjacentHTML('beforeend', element)
   })
}

function renderqueue(){
   console.log(songQueueList)
   const container = document.querySelector('.songs-queue-tracks-container');
   while(container.firstChild){
      container.firstChild.remove();
   }
   songQueueList.forEach(song => {
      console.log(song);
      const element = `
      <div data-track-url="${song.songUrl}" data-track-id="${song.id}" class="songs-queue-track">
      <img class="track-image" src="${song.imgUrl}" />
                      
      <p class="track-title">${song.songName}</p>
      <p class="track-duration">00 : 29</p>
      <i id="queue-remove-btn" class="fa-solid fa-xmark"></i>
      </div>
      `
      container.insertAdjacentHTML('afterbegin', element)

   })
}

document.querySelector('.display').addEventListener('click', (e) => {
   e.currentTarget.parentNode.classList.toggle('open-options')
   console.log("clicked");
})

//playlist
fetch("https://api.napster.com/v2.2/playlists/featured?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=3")
.then((response2)=>response2.json())
.then((data2)=>{
   console.log("look here")
   console.log(data2);
   playlists = data2.playlists;
   const topPlaylist = document.querySelector('.top-playlist');
   playlists.forEach(playlist => {
      const elements = `
      <div class="playlist-item"
            <img class="playlist-image" src="https://direct.napster.com/imageserver/v2/playlists/${playlist.id}/artists/images/200x200.jpg" />
            <h1 class="playlist-title">${playlist.name}</h1>
         <div data-playlist-url="${playlist["links"]["tracks"]["href"]}" data-playlist-id="${playlist.id}" class="playlist-card">

         </div>
      </div>
      `
      topPlaylist.insertAdjacentHTML('beforeend', elements);
      const playlistTracksQuery = playlist["links"]["tracks"]["href"] + "?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=10";
      fetch(playlistTracksQuery)
      .then(response => response.json())
      .then(data => {
         console.log(data)
         const container = document.querySelector(`[data-playlist-url="${playlist['links']['tracks']['href']}"]`)
         data.tracks.forEach(track => {
               const element = `
               <div data-track-url="${track.previewURL}" data-track-id="${track.id}" class="track-card">
               <img class="track-image" src="https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/200x200.jpg" />
               <i data-song-option-toggle="${track.id}" class="fa-solid fa-ellipsis"></i>
                               <div data-track-id="${track.id}" class="song-card-options">
                                   <p data-value="addToPlaylist" data-track-id="${track.id}" class="song-card-option">Add to playlist</p>
                                   <p data-value="addToQueue" data-track-id="${track.id}" class="song-card-option">Add to queue</p>
                                   <p data-value="playNow" data-track-id="${track.id}" class="song-card-option">Play now</p>
                               </div>
               <p class="track-title">${track.name}</p>
            
               </div>
               `
               container.insertAdjacentHTML('beforeend', element);

         })
      })
      .catch(error => {
         console.log(error);
      })
   });
}).catch(error => {
   console.log(error);
})

document.querySelector('.btn').addEventListener('click', (e) => {
   e.preventDefault();
   const search = document.querySelector('#search').value.trim();
   const query = `https://api.napster.com/v2.2/search/verbose?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&query=${search}&per_type_limit=10`;
   fetch(query)
   .then(response => response.json())
   .then(data => {
      // console.log(data);
      goToSearchPage();
      const tracks = data.search.data.tracks;
      const atrists = data.search.data.artists;
      const albums = data.search.data.albums;
      const playlists = data.search.data.playlists;
      console.log("look here",data.search.data)
      
      console.log(tracks);
      const container = document.querySelector('.search-container-tracks');
      while(container.firstChild){
         container.firstChild.remove();
      }
      tracks.forEach(track => {
         const element = `
         <div data-track-url="${track.previewURL}" data-track-id="${track.id}" class="track-card">
         <img class="track-image" src="https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/200x200.jpg" />
         <i data-song-option-toggle="${track.id}" class="fa-solid fa-ellipsis"></i>
                         <div data-track-id="${track.id}" class="song-card-options">
                             <p data-value="addToPlaylist" data-track-id="${track.id}" class="song-card-option">Add to playlist</p>
                             <p data-value="addToQueue" data-track-id="${track.id}" class="song-card-option">Add to queue</p>
                             <p data-value="playNow" data-track-id="${track.id}" class="song-card-option">Play now</p>
                         </div>
         <p class="track-title">${track.name}</p>
      
         </div>
         `
         container.insertAdjacentHTML('beforeend', element);

      })
      renderArtists();
         function renderArtists(){
            const container = document.querySelector('.search-container-artists');
         while(container.firstChild){
            container.firstChild.remove();
         }
         atrists.forEach(artist => {
            // const {id, name ,links: { genres : {href}}, bios : {0 : {bio}} = artist;
            let {id,name, blurbs,links : {topTracks : {href}}} = artist;
            console.log(blurbs)
            if(blurbs.length === 0){
               blurbs = "no infor available on artist";
            }
            const element = `
            <div data-songs-link="${href}" class="artist-container">
            <img src="https://api.napster.com/imageserver/v2/artists/${id}/images/356x237.jpg" onerror="this.onerror = null; this.src = 'https://w0.peakpx.com/wallpaper/203/1009/HD-wallpaper-music-note-music-note-rainbow-love-musical-smoke.jpg'"/>
                     <h2>${name}</h2>
                     <p>
                     ${blurbs}
                     </p>
               </div>
                  `
                  // ${name}
                  // ${href}
                  container.insertAdjacentHTML('beforeend', element);

         })
      }
      renderAlbum();
         function renderAlbum(){
            const container = document.querySelector('.search-container-albums');
         while(container.firstChild){
            container.firstChild.remove();
         }
         albums.forEach(album => {
            // const {id, name ,links: { genres : {href}}, bios : {0 : {bio}} = artist;
            let {id,name, links : {tracks : {href}}} = album;
            const element = `
            <div data-songs-link="${href}" class="album-container">
               <img src="https://api.napster.com/imageserver/v2/albums/${id}/images/500x500.jpg"/>
               <p>${name}</p>
            </div>
            `
                  // ${name}
                  // ${href}
                  container.insertAdjacentHTML('beforeend', element);

         })
      }

      renderPlaylist();
         function renderPlaylist(){
            const container = document.querySelector('.search-container-playlists');
         while(container.firstChild){
            container.firstChild.remove();
         }
         playlists.forEach(playlist => {
            // const {id, name ,links: { genres : {href}}, bios : {0 : {bio}} = artist;
            let {id,name, links : {tracks : {href}}} = playlist;
            const element = `
            <div data-songs-link="${href}" class="playlist-container">
               <img src="https://api.napster.com/imageserver/v2/playlists/${id}/artists/images/230x153.jpg?order=frequency&montage=3x2"/>
               <p>${name}</p>
            </div>
            `
                  // ${name}
                  // ${href}
                  container.insertAdjacentHTML('beforeend', element);

         })
      }


   })
})

function goToSearchPage(){
   document.querySelector('.search-page').classList.remove("hide-page")  
   document.querySelector('.topTracks').classList.add("hide-page")
   document.querySelector('.top-playlist').classList.add("hide-page")
   document.querySelector('.playlist-page').classList.add("hide-page")
}

document.querySelector('.queue-toggler').addEventListener('click', (e) => {
   e.currentTarget.parentNode.classList.toggle('show')
})
document.querySelector('#previous').addEventListener('click', (e) => {
   const player = document.querySelector('#audio-player');
   player.currentTime = 0;
})
document.querySelector('#fastForward').addEventListener('click', (e) => {
   const player = document.querySelector('#audio-player');
   player.currentTime += 5;
})
document.querySelector('#fastBackward').addEventListener('click', (e) => {
   const player = document.querySelector('#audio-player');
   player.currentTime -= 5;
})
document.querySelector('#next').addEventListener('click', (e) => {
   const player = document.querySelector('#audio-player');
   if(songQueueList.length === 0) return;
   let song = songQueueList.pop();
   renderqueue();
   console.log("song to be played", song);
   playTheSong(song);
})


function playTheSong(song) {
   let {songUrl, songName, imgUrl} = song;
   const player = document.querySelector('#audio-player');
   const songNameElm = document.querySelector('#masterSongName');
   const songImgElm = document.querySelector('#gif');
   songImgElm.src = imgUrl;
   songNameElm.textContent = songName;
   player.src = songUrl;
   // player.play();
}

let menu = document.querySelector('.hamburger')
menu.addEventListener('click', (e) => {
   document.querySelector('.nav-links').classList.toggle('open')
})

async function renderSearchOutput(url) {
   let data = await fetch(url + "?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4");
   data= await data.json();
   return data;
}

async function renderTracksForSearch(tracks,classRef) {
   const container = document.querySelector(classRef);
   container.innerHTML = "";
   tracks.forEach(track => {
      const element = `
         <div data-track-url="${track.previewURL}" data-track-id="${track.id}" class="track-card">
            <img class="track-image" src="https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/200x200.jpg" />
            <i data-song-option-toggle="${track.id}" class="fa-solid fa-ellipsis"></i>
                  <div data-track-id="${track.id}" class="song-card-options">
                     <p data-value="addToPlaylist" data-track-id="${track.id}" class="song-card-option">Add to playlist</p>
                     <p data-value="addToQueue" data-track-id="${track.id}" class="song-card-option">Add to queue</p>
                     <p data-value="playNow" data-track-id="${track.id}" class="song-card-option">Play now</p>
                  </div>
            <p class="track-title">${track.name}</p>
         
            </div>
      `
      container.insertAdjacentHTML('beforeend', element);
   });
}

function showOnly(item){
   // let options = ["All","Artist","Album","Playlist"];
   let options = ["tracks-and-output","artists-and-output","albums-and-output","playlists-and-output"];
}