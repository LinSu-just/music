const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
const header = document.querySelector('header');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 28);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menu.addEventListener('click', () => {
  nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', nav.classList.contains('open'));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const revealTargets = document.querySelectorAll('.content-section, .stats');
revealTargets.forEach(section => section.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -45px' });
  revealTargets.forEach(section => observer.observe(section));
} else {
  revealTargets.forEach(section => section.classList.add('visible'));
}

document.querySelectorAll('.play-subgenre').forEach(button => {
  button.addEventListener('click', event => {
    event.stopPropagation();
    const card = button.closest('.subgenre-card');
    const wasPlaying = card.classList.contains('playing');
    document.querySelectorAll('.subgenre-card.playing').forEach(item => {
      item.classList.remove('playing');
      item.querySelector('.play-subgenre span').textContent = '▶';
    });
    if (!wasPlaying) {
      card.classList.add('playing');
      button.querySelector('span').textContent = 'Ⅱ';
    }
  });
});

const storageKey = 'tochka-ritma-favorites';
let favorites = JSON.parse(localStorage.getItem(storageKey) || '[]');
const favoriteToggle = document.querySelector('.favorites-toggle');
const favoriteCount = document.querySelector('.favorite-count');
const favoritesPanel = document.createElement('aside');
favoritesPanel.className = 'favorites-panel';
document.body.appendChild(favoritesPanel);

const renderFavorites = () => {
  localStorage.setItem(storageKey, JSON.stringify(favorites));
  if (favoriteToggle) favoriteToggle.classList.toggle('has-favorites', favorites.length > 0);
  if (favoriteCount) {
    favoriteCount.textContent = favorites.length;
    favoriteCount.classList.toggle('visible', favorites.length > 0);
  }
  favoritesPanel.innerHTML = `<h3>Избранные жанры</h3>${favorites.length
    ? `<ul>${favorites.map(item => `<li>${item}<span>♥</span></li>`).join('')}</ul>`
    : '<p>Здесь появятся жанры, которые вам понравились.</p>'}`;
  document.querySelectorAll('.genre-grid [data-genre]').forEach(card => {
    card.querySelector('.genre-favorite')?.classList.toggle('active', favorites.includes(card.dataset.genre));
  });
};

document.querySelectorAll('.genre-favorite').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    const genre = button.closest('[data-genre]').dataset.genre;
    favorites = favorites.includes(genre) ? favorites.filter(item => item !== genre) : [...favorites, genre];
    renderFavorites();
  });
});

favoriteToggle?.addEventListener('click', () => favoritesPanel.classList.toggle('open'));
document.addEventListener('click', event => {
  if (!favoritesPanel.contains(event.target) && !favoriteToggle?.contains(event.target)) favoritesPanel.classList.remove('open');
});
renderFavorites();
