


const currentTheme = localStorage.getItem('theme');
const theme1 = document.querySelectorAll('div, nav, header, footer');
document.addEventListener('DOMContentLoaded', () => {
	if (currentTheme === 'dark'){
		for (const each of theme1){
			// console.log(each)
			each.setAttribute('data-theme', 'dark');
			localStorage.setItem('theme', 'dark');}
	}
	
	if (!currentTheme || currentTheme === 'light'){
		for (const each of theme1){
			// console.log(each)
			each.setAttribute('data-theme', 'light');
			localStorage.setItem('theme', 'light');}
	}

});


export default function darkMode() {
	const currentTheme = localStorage.getItem('theme');
	const theme1 = document.querySelectorAll('div, nav, header, footer');
	// console.log('INSIDE BUTTON BEFORE LOOP: THEME1 ',theme1);
		if (!currentTheme || currentTheme === 'light'){
		for (const each of theme1){
			// console.log("INSIDE For Loop In Button",each)
			each.setAttribute('data-theme', 'dark');
			localStorage.setItem('theme', 'dark');}
		}  else {
		for (const each of theme1){
			each.setAttribute('data-theme', 'light');
			localStorage.setItem('theme', 'light');
			}
		}

}


