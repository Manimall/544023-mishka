var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.toggle');

navMain.classList.remove('main-nav--no-js');

navToggle.addEventListener('click', function() {

  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('toggle--opened');
  }

  this.classList.toggle('toggle--opened');
});
