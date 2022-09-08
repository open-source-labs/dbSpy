//before button gets pressed, what maintains dark theme on refresh
const currentTheme = localStorage.getItem('theme');
const theme1 = document.querySelectorAll('html, head, body, div, nav, header, footer');

document.addEventListener('DOMContentLoaded', () => {
  if (currentTheme === 'dark') {
    for (const each of theme1) {
      each.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  if (!currentTheme || currentTheme === 'light') {
    for (const each of theme1) {
      each.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }
});

//when button gets pressed
export default function darkMode() {
  const currentTheme = localStorage.getItem('theme');
  const theme1 = document.querySelectorAll(
    'html, head, body, div, nav, header, footer'
  );
  if (!currentTheme || currentTheme === 'light') {
    for (const each of theme1) {
      each.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  } else {
    for (const each of theme1) {
      each.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  // Two Dark Mode swtching buttons: one in HomeNavbar.tsx and one DisplayHeader.tsx
  const buttonModeSwitch = document.querySelectorAll('.darkMode');

  currentTheme === 'dark' ? buttonModeSwitch[0].innerHTML = 'Dark Mode' : buttonModeSwitch[0].innerHTML = 'Light Mode';
  currentTheme === 'dark' ? buttonModeSwitch[1].innerHTML = 'Dark Mode' : buttonModeSwitch[1].innerHTML = 'Light Mode';
}
