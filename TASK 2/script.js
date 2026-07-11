const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const filterButtons = document.querySelectorAll('.filter-btn');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeBtn = document.getElementById('lightboxClose');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
let visibleItems = galleryItems; 

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const matches = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !matches);
    });

    visibleItems = galleryItems.filter(item => !item.classList.contains('hidden'));
  });
});

function openLightbox(item) {
  visibleItems = galleryItems.filter(i => !i.classList.contains('hidden'));
  currentIndex = visibleItems.indexOf(item);
  showImage(currentIndex);
  lightbox.classList.add('open');
}

function showImage(index) {
  const item = visibleItems[index];
  const img = item.querySelector('img');
  const caption = item.querySelector('figcaption').textContent;

  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = caption;
}

function closeLightbox() {
  lightbox.classList.remove('open');
}

function showNext() {
  currentIndex = (currentIndex + 1) % visibleItems.length;
  showImage(currentIndex);
}

function showPrev() {
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  showImage(currentIndex);
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => openLightbox(item));
});

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

window.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});
