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

// Email de-obfuscation: the address is stored base64-encoded in the page
// source (data-mail) rather than as a plain mailto: link, so basic
// scraper bots that regex-match rendered HTML for email addresses don't
// pick it up. Real visitors get a normal, clickable mailto: link the
// instant the page loads. Elements marked data-mail-text also get the
// decoded address as their visible text, for spots that display the
// address itself rather than a label like "Email me".
document.querySelectorAll('[data-mail]').forEach(function (el) {
  try {
    var email = atob(el.getAttribute('data-mail'));
    if (el.tagName === 'A') el.href = 'mailto:' + email;
    if (el.hasAttribute('data-mail-text')) el.textContent = email;
    el.removeAttribute('data-mail');
  } catch (e) { /* malformed data-mail, leave element untouched */ }
});
