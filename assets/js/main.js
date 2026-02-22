// Filter portfolio by category
document.querySelectorAll('.filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var filter = this.getAttribute('data-filter');
    document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
    this.classList.add('active');
    document.querySelectorAll('.project-card').forEach(function (card) {
      var cat = card.getAttribute('data-category');
      card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
    });
  });
});
