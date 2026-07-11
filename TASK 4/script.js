const songs = [
  {
    title: 'I Really Do',
    artist: 'Karan Aujla',
    src: 'https://cdnsongs.com/music/data/Punjabi/202508/P_POP_CULTURE/128/I_Really_Do_1.mp3',
    cover: 'https://musicalsatans.com/wp-content/uploads/2025/09/Add-a-heading_20250917_121443_0002-1.png'
  },
  {
    title: '0008',
    artist: 'Sidhu Moose Wala',
    src: 'https://cdnsongs.com/music/data/Punjabi/202506/Moose_Print/128/0008_1.mp3',
    cover: 'https://i.scdn.co/image/ab67616d00001e02d39dc5dc97bdd4619adcb17c'
  },
  {
    title: 'Millionaire',
    artist: 'Yo Yo Honey Singh',
    src: 'https://cdnsongs.com/music/data/Punjabi/202408/Glory/128/Millionaire.mp3',
    cover: 'https://cover.mr-jatt.im/thumb/510968/Millionaire-1.jpg'
  },
  {
    title: 'Superstar',
    artist: 'Dox',
    src: 'https://cdnsongs.com/music/data/Single_Track/202506/Superstar/128/Superstar_1.mp3',
    cover: 'https://cover.mr-jatt.im/thumb/513234/Superstar-1.jpg',
  }
];

const audio = document.getElementById('audio');
const artWrapper = document.querySelector('.art-wrapper');
const cover = document.getElementById('cover');
const titleEl = document.getElementById('songTitle');
const artistEl = document.getElementById('songArtist');
const seekBar = document.getElementById('seekBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volumeBar');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const playlistEl = document.getElementById('playlist');

let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  cover.src = song.cover;
  highlightActivePlaylistItem();
}

function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.textContent = '⏸';
  artWrapper.classList.add('playing');
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.textContent = '▶';
  artWrapper.classList.remove('playing');
}

function togglePlay() {
  isPlaying ? pauseSong() : playSong();
}

function playNext() {
  if (isShuffle) {
    let next;
    do {
      next = Math.floor(Math.random() * songs.length);
    } while (next === currentIndex && songs.length > 1);
    currentIndex = next;
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }
  loadSong(currentIndex);
  playSong();
}

function playPrev() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

audio.addEventListener('loadedmetadata', () => {
  seekBar.max = audio.duration;
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  seekBar.value = audio.currentTime;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

seekBar.addEventListener('input', () => {
  audio.currentTime = seekBar.value;
});

volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value / 100;
});
audio.volume = volumeBar.value / 100;

audio.addEventListener('ended', () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else {
    playNext();
  }
});

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle('active', isRepeat);
});

function buildPlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const item = document.createElement('div');
    item.classList.add('playlist-item');
    item.dataset.index = index;
    item.innerHTML = `<span>${song.title} — ${song.artist}</span>`;
    item.addEventListener('click', () => {
      currentIndex = index;
      loadSong(currentIndex);
      playSong();
    });
    playlistEl.appendChild(item);
  });
}

function highlightActivePlaylistItem() {
  document.querySelectorAll('.playlist-item').forEach((item, index) => {
    item.classList.toggle('active', index === currentIndex);
  });
}

buildPlaylist();
loadSong(currentIndex);
