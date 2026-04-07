"use strict";
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
			[].forEach.call(document.querySelectorAll("[data-collapse-trigger]"), function (el) {
				el.addEventListener("click", function (e) {
					e.preventDefault();
					let currentItem = this.closest("[data-collapser]");
					let siblings = currentItem.parentElement.children;
					[...siblings].forEach((sibling) => {
						if (sibling !== currentItem) {
							sibling.classList.remove("uncollapsed");
						}
					});
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


		// copyright - year
		const year = document.getElementById("year");
		if (year) {
			year.innerHTML = new Date().getFullYear();
		}
	});