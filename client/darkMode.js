const currentTheme = localStorage.getItem('theme');
const theme1 = document.querySelectorAll('div, nav, header, footer');

document.addEventListener('DOMContentLoaded', () => {
  if (currentTheme === 'dark') {
    for (const each of theme1) {
      // console.log(each)
      each.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  if (!currentTheme || currentTheme === 'light') {
    for (const each of theme1) {
      // console.log(each)
      each.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }
});

export default function darkMode() {
  const currentTheme = localStorage.getItem('theme');
  const theme1 = document.querySelectorAll(
    'html, head, body, div, nav, header, footer'
  );
  // console.log('INSIDE BUTTON BEFORE LOOP: THEME1 ',theme1);
  if (!currentTheme || currentTheme === 'light') {
    for (const each of theme1) {
      // console.log("INSIDE For Loop In Button",each)
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
  // console.log('DARKBUTTONSWITCH0', buttonModeSwitch[0]);
  currentTheme === 'dark' ? buttonModeSwitch[0].innerHTML = 'Dark Mode' : buttonModeSwitch[0].innerHTML = 'Light Mode';
  // console.log('DARKBUTTONSWITCH1', buttonModeSwitch[1]);
  currentTheme === 'dark' ? buttonModeSwitch[1].innerHTML = 'Dark Mode' : buttonModeSwitch[1].innerHTML = 'Light Mode';
}
