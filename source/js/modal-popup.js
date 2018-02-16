/* JS для модального окна */

var modal = document.getElementById('popup');
var modalBtnShow = document.querySelector('.offer__order');
var modalBtnHide = document.querySelector('.modal__btn');
var background = document.querySelector('.modal__background');
var basket = document.querySelectorAll('.product__cart');

function creatOverlay() {
  var docHeight = document.body.offsetHeight;
  background.style.height = docHeight + 'px';
}

function showModal(event) {
  event.preventDefault();
  creatOverlay();
  modal.classList.add('modal--visible');
}

function hideModal(event) {
  event.preventDefault();
  modal.classList.remove('modal--visible');
  background.style.height = 0;
}

if (modalBtnShow && background) {
  modalBtnShow.addEventListener('click', showModal, false);
  background.addEventListener('click', hideModal, false);
  modalBtnHide.addEventListener('click', hideModal, false);
}

if (basket && background) {
  for (var i = 0; i < basket.length; i++) {
    basket[i].addEventListener('click', showModal, false);
  }
  background.addEventListener('click', hideModal, false);
}
