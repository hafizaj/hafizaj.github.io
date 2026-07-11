// Mobile navigation disclosure
document.querySelectorAll('[data-mobile-nav-toggle]').forEach(function (button) {
  button.addEventListener('click', function () {
    var panel = document.getElementById('mobile-nav');
    if (!panel) return;
    var open = panel.classList.toggle('hidden') === false;
    button.setAttribute('aria-expanded', open);
  });
});

// Close the mobile panel after choosing a destination
document.querySelectorAll('#mobile-nav a').forEach(function (link) {
  link.addEventListener('click', function () {
    document.getElementById('mobile-nav').classList.add('hidden');
  });
});
