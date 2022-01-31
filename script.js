/*jshint esversion: 6 */

const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const backwardBtn = document.getElementById('backward');
const forwardBtn = document.getElementById('forward');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');

const main = document.getElementById('main');
const dragPreview = document.getElementById('drag-preview');
const songInput = document.getElementById('song-input');

// Song titles
const songs = [
  {name: 'Hey', src: 'music/hey.mp3', cover: 'images/hey.jpg'},
  {name: 'Summer', src: 'music/summer.mp3', cover: 'images/summer.jpg'},
  {name: 'Ukulele', src: 'music/ukulele.mp3', cover: 'images/ukulele.jpg'}
];

// Keep track of song
let songIndex = 0;

// Initially load song details into DOM
loadSong(songs[songIndex]);

// Update song details
function loadSong(song) {
  title.innerText = song.name;
  audio.src = song.src;
  cover.src = song.cover;
}

function getCurrentMusic() {
  $('.music-list .item').removeClass('active');
  
  return $('.music-list .item:nth-child('+(songIndex + 1)+')');
}

// Play song
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');

  $('.music-list .item').find('.play i.fas').removeClass('fa-pause');
  $('.music-list .item').find('.play i.fas').addClass('fa-play');

  $('.music-list .item .icon i.fas').removeClass('fa-spin');
  getCurrentMusic().find('.icon i.fas').addClass('fa-spin');
  
  getCurrentMusic().find('.play i.fas').removeClass('fa-play');
  getCurrentMusic().find('.play i.fas').addClass('fa-pause');
  getCurrentMusic().addClass('active');

  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  $('.music-list .item').find('.play i.fas').removeClass('fa-pause');
  $('.music-list .item').find('.play i.fas').addClass('fa-play');

  $('.music-list .item .icon i.fas').removeClass('fa-spin');

  getCurrentMusic().find('.play i.fas').removeClass('fa-pause');
  getCurrentMusic().find('.play i.fas').addClass('fa-play');
  getCurrentMusic().removeClass('active');

  audio.pause();
}

// Previous song
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]);

  playSong();
}

// Next song
function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);

  playSong();
}

function playSongByIndex(i) {
  if (i === songIndex) {
    togglePlay();
  } else {
    songIndex = i;
    loadSong(songs[songIndex]);
    playSong();
  }
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  $('#current-time').text(setTime(currentTime));
  $('#end-time').text(setTime(duration));
  // console.log(e);
}

function setTime(time) {
  let value = time.toString();
  value = value.substring(0, value.indexOf('.'));

  let secondes = parseFloat(value);
  let minutes = parseInt(secondes/60);
  let reste = parseInt(secondes%60);

  if (!reste) {
    return '0:00';
  }
  return `${minutes}:${reste < 10 ? '0'+reste : reste}`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

function togglePlay() {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

// Event listeners
playBtn.addEventListener('click', togglePlay);

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);

songInput.addEventListener('change', (e) => {
  e.preventDefault();

  const files = e.target.files;
  addSongsFiles(files);
  
  songInput.value = null;
});

window.addEventListener('keyup', e => {
  // console.log(e.code);

  if (e.code === 'Space') {
    togglePlay();
  } else if(e.code === 'ArrowRight') {
    nextSong();
  } else if(e.code === 'ArrowLeft') {
    prevSong();
  } else if(e.code === 'Enter') {
    songInput.click();
  }
});



// main.addEventListener('dragenter', e => {
//   dragPreview.classList.add('show');
// });
// main.addEventListener('dragend', e => {
//   dragPreview.classList.remove('show');
// });

// dragPreview.addEventListener('drop', e => {
//   dragPreview.classList.remove('show');
//   e.preventDefault();
//   e.stopPropagation();
//   console.log(e);
// });

// $('.music-list .item .play').click(e => {
//   e.preventDefault();
//   console.log(e);

//   playSongByIndex($(this).attr('data-index'));
// });

showFiles();

function showFiles() {
  let items = "";

  songs.forEach((s, i) => {
    items += `<div class="item">
                <span class="icon"><i class="fas fa-music"></i></span>
                <span class="title">${s.name}</span>
                <span class="play" onclick="playSongByIndex(${i})">
                  <i class="fas fa-play"></i>
                </span>
              </div>`;
  });

  $('#music-list').html(items);
}

function addSongsFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (file.type.startsWith('audio') && !fileExist(file)) {
      const elt = {name: file.name, src: '', cover: 'images/hey.jpg'};
  
      const reader = new FileReader();
      reader.onload = e => {
        elt.src = reader.result;

        const index = songs.push(elt);
        showFiles();

        if (files.length < 2) {
          playSongByIndex(index-1);
        }
      };
  
      reader.readAsDataURL(file);
    }
  }
}

function fileExist(file) {
  const val = songs.find(f => f.name === file.name);
  return val ? true : false;
}

$(() => {
  $("#main").on("dragover", function(event) {
    event.preventDefault();
    event.stopPropagation();
    $('#drag-preview').addClass('show');
  });
  
  $("#drag-preview").on("dragleave", function(event) {
    event.preventDefault();
    event.stopPropagation();
    $('#drag-preview').removeClass('show');
  });
  
  $("#main").on("drop", function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.originalEvent.dataTransfer.files;
    addSongsFiles(files);

    $('#drag-preview').removeClass('show');
  });
});


if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}