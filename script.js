'use strict'

document.addEventListener('DOMContentLoaded', () => {
	const accordions = document.querySelectorAll('.user-menu');

	accordions.forEach(element => {
		element.addEventListener('click', (el) => {
      let tgEl = el.currentTarget;
      const control = tgEl.querySelector('.btn');
      const content = tgEl.querySelector('.sidebar-item');
      if(el.target.closest('.btn')){
        control.classList.toggle('active');

        // is open
        if (control.classList.contains('active')) {
          let accordionTimeAnimate = content.scrollHeight;
          if(accordionTimeAnimate <= 300 && accordionTimeAnimate <= 600){
            accordionTimeAnimate = (300 + 'ms');
          } else if (accordionTimeAnimate <= 650){
            accordionTimeAnimate = content.scrollHeight * 1.5 + 'ms';
          } else if (accordionTimeAnimate <= 1000) {
            accordionTimeAnimate = (900 + 'ms');
          }
          else{
            accordionTimeAnimate = (1000 + 'ms');
          }
          content.style.setProperty('--accordion-height', content.scrollHeight + 'px'); //Height menu
          content.style.setProperty('--accordion-time', accordionTimeAnimate); //Time animate
          content.dataset.ariaExpanded = 'true'
        } else {
          content.dataset.ariaExpanded = 'false'
        }
      }
		});
	});
});



// modal window
class Modal {
	constructor(options) {
		let defaultOptions = {
			isOpen: () => { },
			isClose: () => { },
		}
		this.options = Object.assign(defaultOptions, options);
		this.modal = document.querySelector('.modal');
		this.speed = false;
		this.animation = false;
		this.isOpen = false;
		this.modalContainer = false;
		this.previousActiveElement = false;
		this.fixBlocks = document.querySelectorAll('.fix-block');
		this.events();
	}

	events() {
		if (this.modal) {
			document.addEventListener('click', function (e) {
				const clickedElement = e.target.closest('[data-path]');
				if (clickedElement) {
					let target = clickedElement.dataset.path;
					let animation = clickedElement.dataset.animation;
					let speed = clickedElement.dataset.speed;
					this.animation = animation ? animation : 'fade';
					this.speed = speed ? parseInt(speed) : 300;
					this.modalContainer = document.querySelector(`[data-target="${target}"]`);
					this.open();
					return;
				}

				if (e.target.closest('.modal-close')) {
					this.close();
					return;
				}
			}.bind(this));

			window.addEventListener('keydown', function (e) {
				if (e.keyCode == 27) {
					if (this.isOpen) {
						this.close();
					}
				}

				if (e.keyCode == 9 && this.isOpen) {
					this.focusCatch(e);
					return;
				}

			}.bind(this));

			this.modal.addEventListener('click', function (e) {
				if (!e.target.classList.contains('modal__container') && !e.target.closest('.modal__container') && this.isOpen) {
					this.close();
				}
			}.bind(this));
		}
	}

	open() {
		this.previousActiveElement = document.activeElement;

		this.modal.style.setProperty('--transition-time', `${this.speed / 1000}s`);
		this.modal.classList.add('is-open');
		this.disableScroll();

		this.modalContainer.classList.add('modal-open');
		this.modalContainer.classList.add(this.animation);

		setTimeout(() => {
			this.options.isOpen(this);
			this.modalContainer.classList.add('animate-open');
			this.isOpen = true;
		}, this.speed);
	}

	close() {
		if (this.modalContainer) {
			this.modalContainer.classList.remove('animate-open');
			this.modalContainer.classList.remove(this.animation);
			this.modal.classList.remove('is-open');
			this.modalContainer.classList.remove('modal-open');

			this.enableScroll();
			this.options.isClose(this);
			this.isOpen = false;
		}
	}

	disableScroll() {
		let pagePosition = window.scrollY;
		this.lockPadding();
		document.body.classList.add('disable-scroll');
		document.body.dataset.position = pagePosition;
		document.body.style.top = -pagePosition + 'px';
	}

	enableScroll() {
		let pagePosition = parseInt(document.body.dataset.position, 10);
		this.unlockPadding();
		document.body.style.top = 'auto';
		document.body.classList.remove('disable-scroll');
		window.scroll({ top: pagePosition, left: 0 });
		document.body.removeAttribute('data-position');
	}

	lockPadding() {
		let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
		this.fixBlocks.forEach((el) => {
			el.style.paddingRight = paddingOffset;
		});
		document.body.style.paddingRight = paddingOffset;
	}

	unlockPadding() {
		this.fixBlocks.forEach((el) => {
			el.style.paddingRight = '0px';
		});
		document.body.style.paddingRight = '0px';
	}
}

const modal = new Modal({
	isOpen: (modal) => {
		console.log(modal);
		console.log('opened');
	},
	isClose: () => {
		console.log('closed');
	},
});