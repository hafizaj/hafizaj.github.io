const WORDS = ['Data.', 'Science.', 'Results.'];

// Filter portfolio by category
document.querySelectorAll('.filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var filter = this.getAttribute('data-filter');
    document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
    this.classList.add('active');
    document.querySelectorAll('.featured-card').forEach(function (card) {
      var cat = card.getAttribute('data-category');
      card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
    });
  });
});

// About page: mobile nav toggle
var navToggle = document.querySelector('.nav__toggle');
var navLinks = document.querySelector('.nav--about .nav__links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('is-open');
  });
}

// About page: expandable experience/education cards
document.querySelectorAll('[data-exp-toggle]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var card = this.closest('[data-exp-card]');
    if (!card) return;
    var isOpen = card.classList.toggle('exp-card--open');
    this.setAttribute('aria-expanded', isOpen);
  });
});


