"use strict";

	if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
		document.documentElement.classList.add("is-ios");
	}
	/**
		 active menu point
	**/
	function setActiveMenuItem() {
		let current = location.pathname.split('/').reverse()[0];
		if (current === "") {current = 'index.html';}
		else {
			current = current.split('-')[0];
		}

		let menuItems = document.querySelectorAll('.menu__link');
		for (let i = 0, len = menuItems.length; i < len; i++) {
			if (menuItems[i].getAttribute("href").split('-')[0].indexOf(current) !== -1 && current.length > 3) {
				menuItems[i].className += " active";
				return
			}
		};
	};

	const menuTrigger = document.querySelector(".btn--menu");
	const subMenus = document.querySelectorAll(".sub-menu");
	const header = menuTrigger.closest(".header");



	document.addEventListener('DOMContentLoaded', function(){
		setActiveMenuItem();
		//user menu

		menuTrigger?.addEventListener("click", function () {
			header.classList.toggle("header--open");
			header.querySelector(".menu").classList.toggle("menu--open");
			[...subMenus].forEach(function (el) {
				el.classList.remove("open");
			});
		});

		if (subMenus) {
			[...subMenus].forEach(function (el) {
				el.addEventListener("click", function () {
					this.classList.add("open");
				});
				const closerSubMenu = el.querySelector(".sub-menu__trigger");
				closerSubMenu.addEventListener("click", function (e) {
					e.stopPropagation();
					this.closest(".sub-menu").classList.remove("open");
				});
			});
		}

		//close dialogs
		window.addEventListener("click", function (e) {
			if (!e.target.closest(".header")) {
				header.classList.remove("header--open");
				header.querySelector(".menu").classList.remove("menu--open");
			}
		});

		document.querySelectorAll(".sub-menu").forEach((item) => {
			item.addEventListener("mouseenter", (e) => {
				item.closest(".header").classList.add("header--hovered");
			});
			item.addEventListener("mouseleave", (e) => {
				item.closest(".header").classList.remove("header--hovered");
			});
		});

		/**
			accordions - collapse
		**/
		const accordionOpen = function () {
			const triggers = document.querySelectorAll("[data-collapse-trigger]");

			triggers.forEach(function (el) {
				el.addEventListener("click", function (e) {
					e.preventDefault();

					const currentItem = this.closest("[data-collapser]");
					if (!currentItem) return;

					if (currentItem.getAttribute("data-collapser") !== "all") {
						const siblings = currentItem.parentElement.children;
						[...siblings].forEach((sibling) => {
							if (sibling !== currentItem) {
								sibling.classList.remove("uncollapsed");
							}
						});
					}

					currentItem.classList.toggle("uncollapsed");
				});
			});
		};

		accordionOpen();


		// custom select
		let select = function () {
			let selectHeader = document.querySelectorAll(".select__header");
			let selectItem = document.querySelectorAll(".select__item");

			selectHeader.forEach((item) => {
				item.addEventListener("click", selectToggle);
			});
			selectItem.forEach((item) => {
				item.addEventListener("click", selectChoose);
			});
			function selectToggle() {
				this.parentElement.classList.toggle("is-active");
			}
			function selectChoose() {
				let text = this.innerHTML,
					value = this.getAttribute("data-value"),
					select = this.closest(".select"),
					input = select.querySelector("input[type=hidden]"),
					currentText = select.querySelector(".select__current");
				currentText.innerHTML = text;
				input.value = value;
				select.classList.remove("is-active");
			}
		};
		select();

		//leave mouse
		const allSelects = document.querySelectorAll(".select");
		if (allSelects) {
			[].forEach.call(allSelects, function (el) {
				el.addEventListener("mouseleave", function (s) {
					setTimeout(() => s.target.classList.remove("is-active"), 300);
				});
			});
		}

		// sliders
		const mobileSlider = document.querySelector("[data-slider]");
		if (mobileSlider) {
			const customSpaceBetween = Number(mobileSlider.dataset.spaceBetween) || 0;
			new Swiper(mobileSlider, {
				draggable: true,
				grabCursor: true,
				centeredSlides: false,
				loop: false,
				autoHeight: false,
				scrollbar: {
					el: ".swiper-scrollbar",
					draggable: true,
					hide: false,
					snapOnRelease: true,
				},
				breakpoints: {
					320: {
						slidesPerView: 1.16,
						spaceBetween: customSpaceBetween
					},
					700: {
						slidesPerView: 2.3,
						spaceBetween: customSpaceBetween
					},
					1100: {
						slidesPerView: 3.5,
						spaceBetween: customSpaceBetween
					},
					1300: {
						slidesPerView: 4,
					},
				},
			});
		};

		const sheetSlider = document.querySelector(".sheet__slider");
		if (sheetSlider) {
			new Swiper(sheetSlider, {
				draggable: true,
				grabCursor: true,
				centeredSlides: false,
				loop: false,
				autoHeight: false,
				scrollbar: {
					el: ".swiper-scrollbar",
					draggable: true,
					hide: false,
					snapOnRelease: true,
				},
				breakpoints: {
					320: {
						slidesPerView: 1.16,
					},
					660: {
						slidesPerView: 2.3,
					},
					760: {
						slidesPerView: 2.7,
					},
					1200: {
						slidesPerView: 3,
						grid: {
							rows: 2,
							fill: "row",
						},
						spaceBetween: 16,
					},
				},
			});
		};

		let sliderInstance = document.querySelector(".slider-or-grid__box");
		let swiperOrGridInstance = null;

		function initSwiper() {
			const screenWidth = window.innerWidth;

			if (screenWidth < 1024 && !swiperOrGridInstance) {
				swiperOrGridInstance = new Swiper(sliderInstance, {
					observer: true,
					observeParents: true,
					spaceBetween: 16,
					draggable: true,
					navigation: {
						nextEl: ".swiper-button-next",
						prevEl: ".swiper-button-prev",
					},
					pagination: {
						el: ".swiper-pagination-fraction",
						type: "fraction",
						renderFraction: function (currentClass, totalClass) {
							return '<span class="' + currentClass + '"></span>' + " / " + '<span class="' + totalClass + '"></span>';
						},
					},
					breakpoints: {
						320: {
							slidesPerView: 1.2,
							spaceBetween: 16,
						},
						700: {
							slidesPerView: 2.2,
							spaceBetween: 16,
						},
					},
				});
			}
			// destroy =1024
			else if (screenWidth >= 1024 && swiperOrGridInstance) {
				swiperOrGridInstance.destroy(true, true);
				swiperOrGridInstance = null;
			}
		}
		if (sliderInstance) {
			initSwiper();
			window.addEventListener("resize", initSwiper);
		}

		/**
			tabs
		**/
		const tabSwitcher = function () {
			[].forEach.call(
				document.querySelectorAll("[data-trigger-tab]"),
				function (el) {
					el.addEventListener("click", function (e) {
						let id = this.getAttribute("data-trigger-tab"),
							comingTab = document.getElementById(id),
							parent = comingTab.closest('.tabs-content'),
							currentTab = parent.querySelector('[data-tab="active"]');

						currentTab?.setAttribute("data-tab", "hidden");
						comingTab.setAttribute("data-tab", "active");

						let tabsBlock = this.closest('.tabs');
						if (tabsBlock) {
							let allTabs = tabsBlock.querySelectorAll('[data-trigger-tab]');
							[...allTabs].forEach(item => {
								item.closest('.tab').classList.remove('active');
							});
							this.closest(".tab").classList.add("active");
						};
					});
				}
			);
		};
		tabSwitcher();

		// modals
		const openButtons = document.querySelectorAll("[data-modal-open]");
		const closeButtons = document.querySelectorAll("[data-modal-close]");

		openButtons.forEach((button) => {
			button.addEventListener("click", () => {
				const modal = document.getElementById(button.getAttribute("data-modal-open"));
				modal?.showModal();
			});
		});

		closeButtons.forEach((button) => {
			button.addEventListener("click", () => {
				const modal = button.closest("dialog");
				modal?.close();
			});
		});

		document.querySelectorAll("dialog").forEach((modal) => {
			modal.addEventListener("click", (event) => {
				// click backdrop close-modal
				if (event.target === modal) {
					modal.close();
				}
			});
		});


		// copyright - year
		const year = document.getElementById("year");
		if (year) {
			year.innerHTML = new Date().getFullYear();
		}
	});