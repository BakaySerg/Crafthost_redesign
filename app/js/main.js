"use strict";

const debounce = (fn, ms) => {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), ms);
	};
};

if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
	document.documentElement.classList.add("is-ios");
}

document.addEventListener("DOMContentLoaded", () => {
	// ── Active menu item ─────────────────────────────────────────────────────

	const setActiveMenuItem = () => {
		const parts = location.pathname.split("/").filter(Boolean);
		const raw = (parts.at(-1) || "index.html").replace(/\.html$/, "");
		const current = !raw || raw === "index" ? "index" : raw;

		document.querySelectorAll(".menu__link").forEach((link) => {
			const href = (link.getAttribute("href") ?? link.getAttribute("data-href") ?? "")
				.split("/")
				.pop()
				.replace(/\.html$/, "");

			if (href && (current === href || current.startsWith(href + "-"))) {
				link.classList.add("active");
			}
		});
	};

	setActiveMenuItem();

	// ── Mobile menu ──────────────────────────────────────────────────────────

	const menuTrigger = document.querySelector(".btn--menu");
	if (!menuTrigger) return;

	const header = menuTrigger.closest(".header");
	const menu = header?.querySelector(".menu");
	const subMenus = [...(header?.querySelectorAll(".sub-menu") ?? [])];

	menuTrigger.addEventListener("click", () => {
		header.classList.toggle("header--open");
		menu?.classList.toggle("menu--open");
		subMenus.forEach((el) => el.classList.remove("open"));
	});

	subMenus.forEach((el) => {
		el.addEventListener("click", () => el.classList.add("open"));
		el.querySelector(".sub-menu__trigger")?.addEventListener("click", (e) => {
			e.stopPropagation();
			el.classList.remove("open");
		});
	});

	window.addEventListener("click", (e) => {
		if (!e.target.closest(".header")) {
			header.classList.remove("header--open");
			menu?.classList.remove("menu--open");
		}
	});

	document.querySelectorAll(".sub-menu").forEach((el) => {
		el.addEventListener("mouseenter", () => el.closest(".header")?.classList.add("header--hovered"));
		el.addEventListener("mouseleave", () => el.closest(".header")?.classList.remove("header--hovered"));
	});

	// ── Accordions ───────────────────────────────────────────────────────────

	document.querySelectorAll("[data-collapse-trigger]").forEach((trigger) => {
		trigger.addEventListener("click", (e) => {
			e.preventDefault();

			const item = trigger.closest("[data-collapser]");
			if (!item) return;

			if (item.getAttribute("data-collapser") !== "all") {
				[...item.parentElement.children].forEach((sibling) => {
					if (sibling !== item) sibling.classList.remove("uncollapsed");
				});
			}

			item.classList.toggle("uncollapsed");
		});
	});

	// ── Read more ────────────────────────────────────────────────────────────

	document.querySelectorAll("[data-more-text]").forEach((block) => {
		const content = block.querySelector("[data-content]");
		const btn = block.querySelector("[data-toggle]");
		if (!content || !btn) return;

		const items = [...content.children];
		const visibleCount = parseInt(block.dataset.visible) || 2;

		if (items.length <= visibleCount) {
			btn.hidden = true;
			return;
		}

		const setHeights = () => {
			const collapsed = items.slice(0, visibleCount).reduce((h, el) => h + el.offsetHeight, 0);
			block.style.setProperty("--collapsed-height", collapsed + "px");
			block.style.setProperty("--full-height", content.scrollHeight + "px");
		};

		setHeights();
		block.setAttribute("data-ready", "");

		let isOpen = block.dataset.moreText === "show";
		btn.querySelector("span").textContent = isOpen ? "Read Less" : "Read More";

		btn.addEventListener("click", () => {
			isOpen = !isOpen;
			block.setAttribute("data-more-text", isOpen ? "show" : "hide");
			btn.querySelector("span").textContent = isOpen ? "Read Less" : "Read More";
		});

		window.addEventListener("resize", debounce(setHeights, 150));
	});

	// ── Mini select ──────────────────────────────────────────────────────────

	document.querySelectorAll(".select__header").forEach((el) => {
		el.addEventListener("click", function () {
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

	document.querySelectorAll(".select").forEach((el) => {
		el.addEventListener("mouseleave", () => {
			setTimeout(() => el.classList.remove("is-active"), 300);
		});
	});

	// ── Custom form select ─────────────────────────────────────────

	document.querySelectorAll(".cstm-select").forEach((select) => {
		const trigger = select.querySelector(".cstm-select__trigger");
		const dropdown = select.querySelector(".cstm-select__dropdown");
		const hidden = select.querySelector('input[type="hidden"]');
		const text = select.querySelector(".cstm-select__trigger-text");
		const options = select.querySelectorAll(".cstm-select__option");
		const isFlag = !!select.dataset.flag;

		if (!trigger || !dropdown || !hidden || !text) return;

		trigger.addEventListener("click", (e) => {
			e.stopPropagation();

			const isOpen = select.classList.contains("is-open");

			document.querySelectorAll(".cstm-select.is-open").forEach((s) => {
				s.classList.remove("is-open");
			});

			if (!isOpen) select.classList.add("is-open");

			trigger.setAttribute("aria-expanded", !isOpen);
		});

		options.forEach((option) => {
			option.addEventListener("click", () => {
				const value = option.dataset.value;

				if (isFlag) {
					const flag = option.querySelector(".iti__flag")?.outerHTML ?? "";
					text.innerHTML = flag + option.textContent.trim();
				} else {
					text.textContent = option.textContent.trim();
				}

				text.classList.remove("placeholder");
				hidden.value = value;

				options.forEach((o) => o.setAttribute("aria-selected", String(o === option)));

				select.classList.remove("is-open");
				trigger.setAttribute("aria-expanded", "false");
				hidden.dispatchEvent(new Event("change", { bubbles: true }));
			});
		});
	});

	document.addEventListener("click", () => {
		document.querySelectorAll(".cstm-select.is-open").forEach((select) => {
			select.classList.remove("is-open");
			select.querySelector(".cstm-select__trigger")?.setAttribute("aria-expanded", "false");
		});
	});

	// ── Sliders ──────────────────────────────────────────────────────────────

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

	const mobileSliderEl = document.querySelector("[data-slider]");
	if (mobileSliderEl) {
		const sp = Number(mobileSliderEl.dataset.spaceBetween) || 0;
		new Swiper(mobileSliderEl, {
			...baseSwiperConfig,
			breakpoints: {
				320: { slidesPerView: 1.16, spaceBetween: sp },
				700: { slidesPerView: 2.3, spaceBetween: sp },
				1100: { slidesPerView: 3.5, spaceBetween: sp },
				1300: { slidesPerView: 4 },
			},
		});
	}

	const createSlider = (el) => {
		const sp = Number(el.dataset.spaceBetween) || 0;
		const rowsMd = Number(el.dataset.rowMd) || 1;
		const autoCustomHeight = el.hasAttribute("data-auto-height");

		new Swiper(el, {
			...baseSwiperConfig,
			breakpoints: {
				320: { slidesPerView: 1.068, spaceBetween: 16 },
				768: { slidesPerView: 2.1, spaceBetween: 20 },
				900: { slidesPerView: 3, spaceBetween: 22 },
				1100: {
					slidesPerView: 3,
					spaceBetween: sp,
					...(rowsMd > 1 ? { autoHeight: false, grid: { rows: rowsMd, fill: "row" } } : { autoHeight: autoCustomHeight }),
				},
			},
		});
	};

	document.querySelectorAll(".testimonials__slider, .price-card__slider").forEach(createSlider);

	document.querySelectorAll(".sheet__slider").forEach((el) => {
		new Swiper(el, {
			...baseSwiperConfig,
			breakpoints: {
				320: { slidesPerView: 1.08 },
				660: { slidesPerView: 2.3 },
				760: { slidesPerView: 2.7 },
				1200: { slidesPerView: 3, spaceBetween: 16, grid: { rows: 2, fill: "row" } },
			},
		});
	});

	const institutionSliderEl = document.querySelector(".institution__slider");
	if (institutionSliderEl) {
		new Swiper(institutionSliderEl, {
			...baseSwiperConfig,
			spaceBetween: 16,
			navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
			pagination: {
				el: ".swiper-pagination-fraction",
				type: "fraction",
				renderFraction: (cur, tot) => `<span class="${cur}"></span> / <span class="${tot}"></span>`,
			},
			breakpoints: {
				320: { slidesPerView: 1.06, spaceBetween: 13 },
				700: { slidesPerView: 1.3 },
				900: { slidesPerView: 2 },
			},
		});
	}

	const sliderOrGridEl = document.querySelector(".slider-or-grid__box");
	if (sliderOrGridEl) {
		let instance = null;

		const initSwiper = () => {
			const narrow = window.innerWidth < 1024;

			if (narrow && !instance) {
				instance = new Swiper(sliderOrGridEl, {
					observer: true,
					observeParents: true,
					spaceBetween: 16,
					draggable: true,
					navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
					pagination: {
						el: ".swiper-pagination-fraction",
						type: "fraction",
						renderFraction: (cur, tot) => `<span class="${cur}"></span> / <span class="${tot}"></span>`,
					},
					breakpoints: {
						320: { slidesPerView: 1.2, spaceBetween: 16 },
						700: { slidesPerView: 2.2, spaceBetween: 16 },
					},
				});
			} else if (!narrow && instance) {
				instance.destroy(true, true);
				instance = null;
			}
		};

		initSwiper();
		window.addEventListener("resize", debounce(initSwiper, 150));
	}

	// ── Tabs ─────────────────────────────────────────────────────────────────

	document.addEventListener("click", (e) => {
		const trigger = e.target.closest("[data-trigger-tab]");
		if (!trigger) return;

		const tabId = trigger.dataset.triggerTab;
		const comingTab = document.getElementById(tabId);

		if (!comingTab) return;

		const tabsContent = comingTab.closest(".tabs-content");
		tabsContent?.querySelector('[data-tab="active"]')?.setAttribute("data-tab", "hidden");
		comingTab.setAttribute("data-tab", "active");
		const tabsBlock = document.querySelector(`.tabs [data-trigger-tab="${tabId}"]`)?.closest(".tabs");

		if (!tabsBlock) return;

		tabsBlock.querySelectorAll(".tab").forEach((tab) => {
			tab.classList.remove("active");
		});

		tabsBlock.querySelector(`[data-trigger-tab="${tabId}"]`)?.closest(".tab")?.classList.add("active");
	});

	// ── Modals ───────────────────────────────────────────────────────────────

	document.querySelectorAll("[data-modal-open]").forEach((btn) => {
		btn.addEventListener("click", () => {
			document.getElementById(btn.getAttribute("data-modal-open"))?.showModal();
		});
	});

	document.querySelectorAll("[data-modal-close]").forEach((btn) => {
		btn.addEventListener("click", () => btn.closest("dialog")?.close());
	});

	document.querySelectorAll("dialog").forEach((modal) => {
		modal.addEventListener("click", (e) => {
			if (e.target === modal) modal.close();
		});
	});

	// ── data-link ────────────────────────────────────────────────────────

	const tempLink = function () {
		document.querySelectorAll("[data-link]").forEach((el) => {
			el.addEventListener("click", function (e) {
				e.preventDefault();
				window.location.href = this.getAttribute("data-link");
			});
		});
	};
	tempLink();

	// ── Copyright year ───────────────────────────────────────────────────────

	const yearEl = document.getElementById("year");
	if (yearEl) yearEl.textContent = new Date().getFullYear();
});
