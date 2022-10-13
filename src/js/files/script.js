/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper, { Navigation } from 'swiper';
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Базовые стили
import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
// import 'swiper/css';


document.addEventListener('DOMContentLoaded', () => {
	
	const slidersLoad = () => {

		// const urlServer = 'server-slides.json';
		// const urlServerlikes = 'server-like.json';

		const urlServer = 'https://private-anon-80b7e623ab-grchhtml.apiary-mock.com/slides';
		// const urlServerlikes = 'https://private-anon-80b7e623ab-grchhtml.apiary-mock.com/slides/2/like';

		// Инициализация слайдеров
		function initSliders() {
			// Перечень слайдеров
			// Проверяем, есть ли слайдер на стронице
			if (document.querySelector('.top__slider')) {
				new Swiper('.top__slider', { // Указываем скласс нужного слайдера
					// Подключаем модули слайдера
					// для конкретного случая
					modules: [Navigation],
					observer: true,
					observeParents: true,
					slidesPerView: 1,
					spaceBetween: 0,
					autoHeight: true,
					speed: 800,
					allowTouchMove: false,
	
					//touchRatio: 0,
					//simulateTouch: false,
					//loop: true,
					//preloadImages: false,
					//lazy: true,
	
					/*
					// Эффекты
					effect: 'coverflow',
					autoplay: {
						delay: 3000,
						disableOnInteraction: false,
					},
					*/
					// Пагинация
					/*
					pagination: {
						el: '.swiper-pagination',
						clickable: true,
					},
					*/
	
					// Скроллбар
					/*
					scrollbar: {
						el: '.swiper-scrollbar',
						draggable: true,
					},
					*/
	
					// Кнопки "влево/вправо"
					navigation: {
						prevEl: '.swiper-button-prev',
						nextEl: '.swiper-button-next',
					},
	
					// Брейкпоинты
					/*
					breakpoints: {
						320: {
							slidesPerView: 1,
							spaceBetween: 0,
							autoHeight: true,
						},
						768: {
							slidesPerView: 2,
							spaceBetween: 20,
						},
						992: {
							slidesPerView: 3,
							spaceBetween: 20,
						},
						1268: {
							slidesPerView: 4,
							spaceBetween: 30,
						},
					},
					*/
					// События
					on: {
	
					}
				});
			}
		}

		const getSliders = (url, length) => fetch(url, {
			method: "GET",
			// mode: "no-cors",
			headers: {
				"Content-Type": "application/json",
			 },
		})
			.then(response => {
				if (response.status !== 200) {
					const swiperWrapper = document.querySelector('.top__wrapper.swiper-wrapper');
					const newSlide = `
							<div class="top__slide swiper-slide slide-top">
								<div class="slide-top__bg">
									<img src="img/error.jpg" alt="Error">
								</div>
								<div class="slide-top__container">
									<a href="" class="slide-top__logo">
										<img src="img/logo-bmw.svg" alt="Logo BMW">
									</a>
								</div>
							</div>
					`;
					swiperWrapper.insertAdjacentHTML('beforeend', newSlide);
					initSliders();
					throw new Error('Status network not 200');
				}
				return response.json();
			})
			.then(data => setSliders(data, length))
		getSliders(urlServer, 0);

		const countingLikes = () => {
			const topSection = document.querySelector('.top');

			const openPopupAfterClick = (data) => {
				if (data !== null) {
					location.hash = '#popup-like'; //openpopup
					const thisPopup = document.querySelector('.popup');
					thisPopup.querySelector('.popup__title').textContent = data.title;
					thisPopup.querySelector('.popup__text').textContent = data.desc;
				} else {
					location.hash = '#popup-error'; //openpopup
				}
			};

			const updateLikes = (id, write) => {
				if (id && write) {
					localStorage.setItem(id, true);
				} else {
					setTimeout(() => {
						if (document.querySelector('.reaction-block')) {
							let keys = Object.keys(localStorage);
							for(let key of keys) {
								// console.log(`${key}: ${localStorage.getItem(key)}`);
								// console.log(document.querySelector(`#${key}`));
								if (document.querySelector(`#${key}`)) {
									if (!document.querySelector(`#${key}`).classList.contains('_active')) {
										document.querySelector(`#${key}`).classList.add('_active');
										const thisLikeNumber = document.querySelector(`#${key}`).closest('.reaction-block').querySelector('.reaction-block__number');
										thisLikeNumber.textContent = +thisLikeNumber.textContent + 1;
									}
								}
							}
						}
					}, 1000);
				}
			};
			updateLikes();

			setTimeout(() => {
				const topSlider = document.querySelector('.top__slider').swiper;
				topSlider.on('slideChange', function () {
					if (topSlider.activeIndex === topSlider.slides.length - 1) {
						updateLikes();
					}
				});
			}, 1500);

			topSection.addEventListener('click', e => {
				const target = e.target;

				if (target.closest('.reaction-block__btn')) {
					const getLikesResponse = (url) => fetch(url, {
						method: "POST",
						// mode: "no-cors",
						headers: {
							"Content-Type": "application/json",
						 },
					})
					.then(response => {
						if (response.status !== 200) {
							openPopupAfterClick(null);
							throw new Error('Status network not 200');
						}
						return response.json();
					})
					.then(data => {
						const thisTargetNumberLikes = target.closest('.reaction-block').querySelector('.reaction-block__number');
						thisTargetNumberLikes.textContent = +thisTargetNumberLikes.textContent + 1;
						thisTargetNumberLikes.closest('.reaction-block').querySelector('.reaction-block__btn').classList.add('_active');
						updateLikes(thisTargetNumberLikes.closest('.reaction-block').querySelector('.reaction-block__btn').id, true);
						openPopupAfterClick(data);
					})


					const urlServerlikes = `https://private-anon-80b7e623ab-grchhtml.apiary-mock.com/slides/${target.closest('.reaction-block__btn').id.replace('slide-', '')}/like`;
					getLikesResponse(urlServerlikes);
				}
			});
		};

		const setSliders = (data, lengthSlider) => {
			const swiperWrapper = document.querySelector('.top__wrapper.swiper-wrapper');
			const allSlides = data.data;
			if (data.countAll !== lengthSlider) {
				for (let i = 0; i < allSlides.length; i++) {
					if (i <= 2 && lengthSlider === 0) {
						const newSlide = `
							<div class="top__slide swiper-slide slide-top">
								<div class="slide-top__bg">
									<img src="${allSlides[i].imgUrl}" alt="${allSlides[i].title}">
								</div>
								<div class="slide-top__container">
									<h2 class="slide-top__title">${allSlides[i].title}</h2>
									<div class="slide-top__subtitle">
									${allSlides[i].desc}
									</div>
									<a href="" class="slide-top__logo">
										<img src="img/logo-bmw.svg" alt="Logo BMW">
									</a>
									<div class="slide-top__reaction reaction-block">
										<button class="reaction-block__btn" id="slide-${allSlides[i].id}">
											<svg width="39" height="37" viewBox="0 0 39 37" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M0 18.2426H7.21056V35.548H0V18.2426ZM35.4541 13.556H25.2367L25.3594 9.5182L26.4408 4.3266L24.8761 0H21.3936L20.6723 6.36706L17.067 11.8977L15.7477 18.9855H12.0197V35.548L20.795 36.0529H31.0702L34.8555 33.349L38.1001 19.721L35.4541 13.556Z" fill="#727272"/>
											</svg>
										</button>
										<div class="reaction-block__title">
											like:
											<div class="reaction-block__number">${allSlides[i].likeCnt}</div>
										</div>
									</div>
								</div>
							</div>
						`;
						swiperWrapper.insertAdjacentHTML('beforeend', newSlide);
					}
					if (i > lengthSlider - 1 && lengthSlider !== 0) {
						const newSlide = `
							<div class="top__slide swiper-slide slide-top">
								<div class="slide-top__bg">
									<img src="${allSlides[i].imgUrl}" alt="${allSlides[i].title}">
								</div>
								<div class="slide-top__container">
									<h2 class="slide-top__title">${allSlides[i].title}</h2>
									<div class="slide-top__subtitle">
									${allSlides[i].desc}
									</div>
									<a href="" class="slide-top__logo">
										<img src="img/logo-bmw.svg" alt="Logo BMW">
									</a>
									<div class="slide-top__reaction reaction-block">
										<button class="reaction-block__btn" id="slide-${allSlides[i].id}">
											<svg width="39" height="37" viewBox="0 0 39 37" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M0 18.2426H7.21056V35.548H0V18.2426ZM35.4541 13.556H25.2367L25.3594 9.5182L26.4408 4.3266L24.8761 0H21.3936L20.6723 6.36706L17.067 11.8977L15.7477 18.9855H12.0197V35.548L20.795 36.0529H31.0702L34.8555 33.349L38.1001 19.721L35.4541 13.556Z" fill="#727272"/>
											</svg>
										</button>
										<div class="reaction-block__title">
											like:
											<div class="reaction-block__number">${allSlides[i].likeCnt}</div>
										</div>
									</div>
								</div>
							</div>
						`;
						swiperWrapper.insertAdjacentHTML('beforeend', newSlide);
					}
				};
				if (lengthSlider === 0) {
					initSliders();
					const topSlider = document.querySelector('.top__slider').swiper;
					topSlider.on('slideChange', function () {
						if (topSlider.activeIndex === topSlider.slides.length - 1) {
							// console.log(topSlider.slides.length);
							getSliders(urlServer, topSlider.slides.length);
						}
					});
				} else {
					const topSlider = document.querySelector('.top__slider').swiper;
					topSlider.update();
				}
			} else {
				const newSlide = `
							<div class="top__slide swiper-slide slide-top">
								<div class="slide-top__bg">
									<img src="img/error.jpg" alt="Error">
								</div>
								<div class="slide-top__container">
									<a href="" class="slide-top__logo">
										<img src="img/logo-bmw.svg" alt="Logo BMW">
									</a>
								</div>
							</div>
				`;
				swiperWrapper.insertAdjacentHTML('beforeend', newSlide);
				const topSlider = document.querySelector('.top__slider').swiper;
				topSlider.update();
			}

		};
		setTimeout(() => {
			countingLikes();
		}, 1000);
		// countingLikes();

	};
	slidersLoad();

});
