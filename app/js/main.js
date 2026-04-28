"use strict";

// ─── Utilities ───────────────────────────────────────────────────────────────

/**
 * Debounce: delays function execution until after a burst of events has ended.
 * @param {Function} fn
 * @param {number} ms
 */
const debounce = (fn, ms) => {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), ms);
	};
};

// ─── iOS class ───────────────────────────────────────────────────────────────

if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
	document.documentElement.classList.add("is-ios");
}

// ─── Init after DOM is ready ──────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
	// ── Active menu item ─────────────────────────────────────────────────────

	const setActiveMenuItem = () => {
		const parts = location.pathname.split("/").filter(Boolean);
		let current = parts[parts.length - 1] || "index.html";
		current = current.split("-")[0];

		// Skip matching for very short path segments (e.g. index, /)
		if (current.length <= 3) return;

		document.querySelectorAll(".menu__link").forEach((link) => {
			const hrefBase = link.getAttribute("href")?.split("-")[0] ?? "";
			if (hrefBase.includes(current)) {
				link.classList.add("active");
			}
		});
	};

	setActiveMenuItem();

	// ── Mobile menu ──────────────────────────────────────────────────────────

	const menuTrigger = document.querySelector(".btn--menu");

	// If the menu button is absent on this page, bail out early
	if (!menuTrigger) return;

	const header = menuTrigger.closest(".header");
	const menu = header?.querySelector(".menu");
	const subMenus = header?.querySelectorAll(".sub-menu") ?? [];

	const closeAllSubMenus = () => {
		subMenus.forEach((el) => el.classList.remove("open"));
	};

	menuTrigger.addEventListener("click", () => {
		header.classList.toggle("header--open");
		menu?.classList.toggle("menu--open");
		closeAllSubMenus();
	});

	subMenus.forEach((el) => {
		el.addEventListener("click", () => el.classList.add("open"));

		el.querySelector(".sub-menu__trigger")?.addEventListener("click", (e) => {
			e.stopPropagation();
			el.classList.remove("open");
		});
	});

	// Close menu when clicking outside the header
	window.addEventListener("click", (e) => {
		if (!e.target.closest(".header")) {
			header.classList.remove("header--open");
			menu?.classList.remove("menu--open");
		}
	});

	// Add hover class to header when a sub-menu is hovered
	document.querySelectorAll(".sub-menu").forEach((el) => {
		el.addEventListener("mouseenter", () => el.closest(".header")?.classList.add("header--hovered"));
		el.addEventListener("mouseleave", () => el.closest(".header")?.classList.remove("header--hovered"));
	});

	// ── Accordions ───────────────────────────────────────────────────────────

	const initAccordions = () => {
		document.querySelectorAll("[data-collapse-trigger]").forEach((trigger) => {
			trigger.addEventListener("click", (e) => {
				e.preventDefault();

				const currentItem = trigger.closest("[data-collapser]");
				if (!currentItem) return;

				// If not "all" mode — collapse sibling items
				if (currentItem.getAttribute("data-collapser") !== "all") {
					[...currentItem.parentElement.children].forEach((sibling) => {
						if (sibling !== currentItem) {
							sibling.classList.remove("uncollapsed");
						}
					});
				}

				currentItem.classList.toggle("uncollapsed");
			});
		});
	};

	initAccordions();

	// ── Custom select ────────────────────────────────────────────────────────

	const initSelects = () => {
		document.querySelectorAll(".select__header").forEach((header) => {
			header.addEventListener("click", function () {
				this.parentElement.classList.toggle("is-active");
			});
		});

		document.querySelectorAll(".select__item").forEach((item) => {
			item.addEventListener("click", function () {
				const select = this.closest(".select");
				const input = select?.querySelector("input[type=hidden]");
				const currentText = select?.querySelector(".select__current");

				if (currentText) currentText.innerHTML = this.innerHTML;
				if (input) input.value = this.getAttribute("data-value") ?? "";

				select?.classList.remove("is-active");
			});
		});

		// Close on mouse leave
		document.querySelectorAll(".select").forEach((el) => {
			el.addEventListener("mouseleave", () => {
				setTimeout(() => el.classList.remove("is-active"), 300);
			});
		});
	};

	initSelects();

	// ── Sliders ──────────────────────────────────────────────────────────────

	// Shared base config reused across all Swiper instances
	const baseSwiperConfig = {
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
	};

	// Main mobile slider
	const mobileSliderEl = document.querySelector("[data-slider]");
	if (mobileSliderEl) {
		const spaceBetween = Number(mobileSliderEl.dataset.spaceBetween) || 0;
		new Swiper(mobileSliderEl, {
			...baseSwiperConfig,
			breakpoints: {
				320: { slidesPerView: 1.16, spaceBetween },
				700: { slidesPerView: 2.3, spaceBetween },
				1100: { slidesPerView: 3.5, spaceBetween },
				1300: { slidesPerView: 4 },
			},
		});
	}

	// Testimonials sliders (supports multiple instances on the same page)
	document.querySelectorAll(".testimonials__slider").forEach((el) => {
		const spaceBetween = Number(el.dataset.spaceBetween) || 0;
		const rowsMd = Number(el.dataset.rowMd) || 1;

		new Swiper(el, {
			...baseSwiperConfig,
			breakpoints: {
				320: { slidesPerView: 1.16, spaceBetween: 16 },
				768: { slidesPerView: 2.1, spaceBetween: 20 },
				900: { slidesPerView: 3, spaceBetween: 22 },
				1100: {
					slidesPerView: 3,
					spaceBetween,
					// Enable  data-row-md="2"
					...(rowsMd > 1 && {
						autoHeight: false,
						grid: { rows: rowsMd, fill: "row" },
					}),
					...(rowsMd === 1 && { autoHeight: true }),
				},
			},
		});
	});

	// Sheet slider
	const sheetSliderEl = document.querySelector(".sheet__slider");
	if (sheetSliderEl) {
		new Swiper(sheetSliderEl, {
			...baseSwiperConfig,
			breakpoints: {
				320: { slidesPerView: 1.16 },
				660: { slidesPerView: 2.3 },
				760: { slidesPerView: 2.7 },
				1200: {
					slidesPerView: 3,
					spaceBetween: 16,
					grid: { rows: 2, fill: "row" },
				},
			},
		});
	}

	// Adaptive slider / grid (Swiper below 1024px, plain grid above)
	const sliderOrGridEl = document.querySelector(".slider-or-grid__box");
	if (sliderOrGridEl) {
		let swiperOrGridInstance = null;

		const initSwiper = () => {
			const isNarrow = window.innerWidth < 1024;

			if (isNarrow && !swiperOrGridInstance) {
				swiperOrGridInstance = new Swiper(sliderOrGridEl, {
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
						renderFraction: (currentClass, totalClass) => `<span class="${currentClass}"></span> / <span class="${totalClass}"></span>`,
					},
					breakpoints: {
						320: { slidesPerView: 1.2, spaceBetween: 16 },
						700: { slidesPerView: 2.2, spaceBetween: 16 },
					},
				});
			} else if (!isNarrow && swiperOrGridInstance) {
				swiperOrGridInstance.destroy(true, true);
				swiperOrGridInstance = null;
			}
		};

		initSwiper();
		window.addEventListener("resize", debounce(initSwiper, 150));
	}

	// ── Tabs ─────────────────────────────────────────────────────────────────

	const initTabs = () => {
		document.querySelectorAll("[data-trigger-tab]").forEach((trigger) => {
			trigger.addEventListener("click", function () {
				const id = this.getAttribute("data-trigger-tab");
				const comingTab = document.getElementById(id);
				if (!comingTab) return;

				const parent = comingTab.closest(".tabs-content");
				const currentTab = parent?.querySelector('[data-tab="active"]');

				currentTab?.setAttribute("data-tab", "hidden");
				comingTab.setAttribute("data-tab", "active");

				const tabsBlock = this.closest(".tabs");
				if (tabsBlock) {
					tabsBlock.querySelectorAll("[data-trigger-tab]").forEach((t) => {
						t.closest(".tab")?.classList.remove("active");
					});
					this.closest(".tab")?.classList.add("active");
				}
			});
		});
	};

	initTabs();

	// ── Modals ───────────────────────────────────────────────────────────────

	document.querySelectorAll("[data-modal-open]").forEach((btn) => {
		btn.addEventListener("click", () => {
			const modal = document.getElementById(btn.getAttribute("data-modal-open"));
			modal?.showModal();
		});
	});

	document.querySelectorAll("[data-modal-close]").forEach((btn) => {
		btn.addEventListener("click", () => {
			btn.closest("dialog")?.close();
		});
	});

	// Close on backdrop click
	document.querySelectorAll("dialog").forEach((modal) => {
		modal.addEventListener("click", (e) => {
			if (e.target === modal) modal.close();
		});
	});

	// ── Copyright year ───────────────────────────────────────────────────────

	const yearEl = document.getElementById("year");
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
	}
});
