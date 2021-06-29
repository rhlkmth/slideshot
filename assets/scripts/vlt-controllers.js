/***********************************************
 * INIT THIRD PARTY SCRIPTS
 ***********************************************/
(function ($) {

	'use strict';

	/**
	 * Onapage navigation
	 */
	var onepageNav = $('.sf-menu-onepage'),
		onepageNavLinks = onepageNav.find('a'),
		onepageSections = $('section');

	VLTJS.window.on('load scroll', function () {
		var fromTop = VLTJS.window.scrollTop();

		onepageNavLinks.each(function () {
			var $this = $(this);

			var section = onepageSections.filter($this.attr('href'));

			if (
				section.offset().top <= fromTop + 90 &&
				section.offset().top + section.outerHeight() > fromTop + 90
			) {
				$this.parent('li').addClass('current-menu-item');
			} else {
				$this.parent('li').removeClass('sfHover current-menu-item');
			}
		});

	});

	/**
	 * Equal height for demo feature
	 */
	$('section').each(function () {

		// Cache the highest
		var highestBox = 0;

		// Select and loop the elements you want to equalise
		$('.vlt-demo-feature--style-2', this).each(function () {

			// If this box is higher than the cached highest then store it
			if ($(this).height() > highestBox) {
				highestBox = $(this).height();
			}

		});

		// Set the height of all those children to whichever was highest
		$('.vlt-demo-feature--style-2', this).height(highestBox);

	});

	/**
	 * Add active class to parent menu
	 */
	$('ul.sf-menu li.current-menu-item').parents('li').addClass('current-menu-item');

	/**
	 * Sticky sidebar
	 */
	if (typeof $.fn.stickySidebar !== 'undefined') {
		VLTJS.document.imagesLoaded(function () {
			$('.vlt-sticky-sidebar').stickySidebar({
				topSpacing: 60,
				bottomSpacing: 60
			});
		});
	}

	/**
	 * Jarallax
	 */
	if (typeof $.fn.jarallax !== 'undefined') {
		$('.jarallax').jarallax({
			speed: 0.8
		});
	}

	/**
	 * Lax
	 */
	if (typeof lax !== 'undefined') {

		lax.setup();

		const updateLax = function () {
			lax.update(window.scrollY);
			window.requestAnimationFrame(updateLax);
		}

		window.requestAnimationFrame(updateLax);

		VLTJS.debounceResize(function () {
			lax.updateElements();
		});

	}

	/**
	 * Fast click
	 */
	if (typeof FastClick === 'function') {
		FastClick.attach(document.body);
	}

	/**
	 * AOS animation
	 */
	if (typeof AOS !== 'undefined') {

		function aos() {

			AOS.init({
				disable: 'mobile',
				offset: 120,
				once: true,
				duration: 1000,
				easing: 'ease',
			});

			function aos_refresh() {
				AOS.refresh();
			}

			aos_refresh();
			VLTJS.debounceResize(aos_refresh);

		}
		VLTJS.window.on('vlt.site-loaded', aos);
	}

	/**
	 * Fancybox
	 */
	if (typeof $.fn.fancybox !== 'undefined') {
		$.fancybox.defaults.btnTpl = {
			close: '<button data-fancybox-close class="fancybox-button fancybox-button--close">' +
				'<i class="icon-cross"></i>' +
				'</button>',
			arrowLeft: '<a data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" href="javascript:;">' +
				'<i class="icon-arrow-left"></i>' +
				'</a>',
			arrowRight: '<a data-fancybox-next class="fancybox-button fancybox-button--arrow_right" href="javascript:;">' +
				'<i class="icon-arrow-right"></i>' +
				'</a>',
			smallBtn: '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small">' +
				'<i class="icon-cross"></i>' +
				'</button>'
		};
		$.fancybox.defaults.buttons = [
			'close'
		];
		$.fancybox.defaults.infobar = false;
		$.fancybox.defaults.transitionEffect = 'slide';
	}

})(jQuery);
/***********************************************
 * HEDAER: MENU DEFAULT
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.submenuEffectStyle1 = {
		config: {
			easing: 'power2.out'
		},
		init: function () {

			var effect = $('[data-submenu-effect="style-1"]'),
				$navbars = effect.find('ul.sf-menu');

			// prepend back button
			$navbars.find('ul.sub-menu').prepend('<li class="sub-menu-back"><a href="#">' + $navbars.data('back-text') + '</a></li>');

			function _update_submenu_height($item) {

				var $nav = $item.closest(effect);
				var $sfMenu = $nav.find('ul.sf-menu');
				var $submenu = $sfMenu.find('li.menu-item-has-children.open > ul.sub-menu:not(.closed)');

				var submenuHeight = '';
				if ($submenu.length) {
					submenuHeight = $submenu.innerHeight();
				}

				$sfMenu.css({
					height: submenuHeight,
					minHeight: submenuHeight,
				});

			}

			// open / close submenu
			function _toggle_submenu(open, $submenu) {
				var $newItems = $submenu.find('> ul.sub-menu > li > a');
				var $oldItems = $submenu.parent().find('> li > a');

				if (open) {
					$submenu.addClass('open').parent().addClass('closed');
				} else {
					$submenu.removeClass('open').parent().removeClass('closed');

					var tmp = $newItems;
					$newItems = $oldItems;
					$oldItems = tmp;
				}

				gsap.set($newItems, {
					x: open ? '15%' : '-15%',
					opacity: 0,
					display: 'block'
				});

				gsap.timeline({
						defaults: {
							ease: VLTJS.submenuEffectStyle1.config.easing
						}
					})
					.to($newItems, .2, {
						x: '0%',
						opacity: 1,
						stagger: {
							amount: .2
						},
					})
					.to($oldItems, .2, {
						x: open ? '-15%' : '15%',
						opacity: 0,
						stagger: {
							amount: .2
						},
						onComplete: function () {
							$oldItems.css('display', 'none');
						}
					}, -.15);
			}

			$navbars.on('click', 'li.menu-item-has-children > a', function (e) {
				_toggle_submenu(true, $(this).parent());
				_update_submenu_height($(this));
				e.preventDefault();
			});

			$navbars.on('click', 'li.sub-menu-back > a', function (e) {
				_toggle_submenu(false, $(this).parent().parent().parent());
				_update_submenu_height($(this));
				e.preventDefault();
			});

		}

	}
	VLTJS.submenuEffectStyle1.init();

	VLTJS.submenuEffectStyle2 = {
		config: {
			easing: 'power2.out'
		},
		init: function () {

			var effect = $('[data-submenu-effect="style-2"]'),
				$navbars = effect.find('ul.sf-menu');

			// prepend back button
			$navbars.find('ul.sub-menu').prepend('<li class="sub-menu-back"><a href="#">' + $navbars.data('back-text') + '</a></li>');

			function _update_submenu_height($item) {

				var $nav = $item.closest(effect);
				var $sfMenu = $nav.find('ul.sf-menu');
				var $submenu = $sfMenu.find('li.menu-item-has-children.open > ul.sub-menu:not(.closed)');

				var submenuHeight = '';
				if ($submenu.length) {
					submenuHeight = $submenu.innerHeight();
				}

				$sfMenu.css({
					height: submenuHeight,
					minHeight: submenuHeight,
				});

			}

			// open / close submenu
			function _toggle_submenu(open, $submenu) {
				var $newItems = $submenu.find('> ul.sub-menu > li > a');
				var $oldItems = $submenu.parent().find('> li > a');

				if (open) {
					$submenu.addClass('open').parent().addClass('closed');
				} else {
					$submenu.removeClass('open').parent().removeClass('closed');

					var tmp = $newItems;
					$newItems = $oldItems;
					$oldItems = tmp;
				}

				gsap.set($newItems, {
					opacity: 0,
					display: 'block'
				});

				gsap.timeline({
						defaults: {
							ease: VLTJS.submenuEffectStyle2.config.easing
						}
					})
					.to($oldItems, .2, {
						opacity: 0,
						stagger: {
							amount: .2
						},
						onComplete: function () {
							$oldItems.css('display', 'none');
						}
					})
					.to($newItems, .2, {
						opacity: 1,
						stagger: {
							amount: .2
						},
					});
			}

			$navbars.on('click', 'li.menu-item-has-children > a', function (e) {
				_toggle_submenu(true, $(this).parent());
				_update_submenu_height($(this));
				e.preventDefault();
			});

			$navbars.on('click', 'li.sub-menu-back > a', function (e) {
				_toggle_submenu(false, $(this).parent().parent().parent());
				_update_submenu_height($(this));
				e.preventDefault();
			});

		}

	}
	VLTJS.submenuEffectStyle2.init();

	VLTJS.submenuEffectStyle3 = {
		config: {
			easing: 'power2.out'
		},
		init: function () {

			var effect = $('[data-submenu-effect="style-3"]'),
				$navbars = effect.find('ul.sf-menu');

			if (typeof $.fn.superclick !== 'undefined') {
				$navbars.superclick({
					delay: 300,
					cssArrows: false,
					animation: {
						opacity: 'show',
						height: 'show'
					},
					animationOut: {
						opacity: 'hide',
						height: 'hide'
					},
				});
			}


		}

	}
	VLTJS.submenuEffectStyle3.init();

})(jQuery);
/***********************************************
 * HEADER: MENU CREATIVE
 ***********************************************/

(function ($) {

	'use strict';

	var menuIsOpen = false;

	VLTJS.menuCreative = {
		init: function () {

			var menu = $('.vlt-nav--creative'),
				menuToggle = $('.js-creative-menu-toggle'),
				navItem = menu.find('ul.sf-menu > li');

			menuToggle.on('click', function (e) {
				e.preventDefault();
				if (!menuIsOpen) {
					menuToggle.addClass('vlt-menu-burger--opened');
					VLTJS.menuCreative.open_menu(menu, navItem);
				} else {
					menuToggle.removeClass('vlt-menu-burger--opened');
					VLTJS.menuCreative.close_menu(menu);
				}
			});

			VLTJS.document.keyup(function (e) {
				if (e.keyCode === 27 && menuIsOpen) {
					e.preventDefault();
					VLTJS.menuCreative.close_menu(menu);
				}
			});

		},
		open_menu: function (menu, navItem) {
			menuIsOpen = true;
			menu.addClass('is-open');
			if (typeof gsap !== 'undefined') {
				gsap.fromTo(navItem, {
					autoAlpha: 0,
				}, {
					autoAlpha: 1,
					duration: .3,
					delay: .3,
					stagger: {
						amount: .2
					}
				});
			}
		},
		close_menu: function (menu) {
			menuIsOpen = false;
			menu.removeClass('is-open');
		}
	};

	VLTJS.menuCreative.init();

})(jQuery);
/***********************************************
 * HEDAER: MENU DEFAULT
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.menuDefault = {
		init: function () {

			var menu = $('.vlt-nav--default'),
				navigation = menu.find('ul.sf-menu');

			if (typeof $.fn.superfish !== 'undefined') {
				navigation.superfish({
					popUpSelector: 'ul.sub-menu',
					delay: 0,
					speed: 300,
					speedOut: 300,
					cssArrows: false,
					animation: {
						opacity: 'show',
						marginTop: '0',
						visibility: 'visible'
					},
					animationOut: {
						opacity: 'hide',
						marginTop: '10px',
						visibility: 'hidden'
					}
				});
			}
		}
	}
	VLTJS.menuDefault.init();

})(jQuery);
/***********************************************
 * HEADER: MENU FULLSCREEN
 ***********************************************/

(function ($) {

	'use strict';

	var menuIsOpen = false;

	VLTJS.menuFullscreen = {
		init: function () {

			var menu = $('.vlt-nav--fullscreen'),
				menuToggle = $('.js-fullscreen-menu-toggle'),
				navItem = menu.find('ul.sf-menu > li');

			menuToggle.on('click', function (e) {
				e.preventDefault();
				if (!menuIsOpen) {
					menuToggle.addClass('vlt-menu-burger--opened');
					VLTJS.menuFullscreen.open_menu(menu, navItem);
				} else {
					menuToggle.removeClass('vlt-menu-burger--opened');
					VLTJS.menuFullscreen.close_menu(menu);
				}
			});

			VLTJS.document.keyup(function (e) {
				if (e.keyCode === 27 && menuIsOpen) {
					e.preventDefault();
					VLTJS.menuFullscreen.close_menu(menu);
				}
			});

		},
		open_menu: function (menu, navItem) {
			menuIsOpen = true;
			menu.addClass('is-open');
			if (typeof gsap !== 'undefined') {
				gsap.fromTo(navItem, {
					autoAlpha: 0,
					translateY: -30
				}, {
					autoAlpha: 1,
					translateY: 0,
					duration: .3,
					delay: .3,
					stagger: {
						amount: .2
					}
				});
			}
		},
		close_menu: function (menu) {
			menuIsOpen = false;
			menu.removeClass('is-open');
		}
	};

	VLTJS.menuFullscreen.init();

})(jQuery);
/***********************************************
 * HEADER: MENU MOBILE
 ***********************************************/
(function ($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.superclick == 'undefined') {
		return;
	}

	var menuIsOpen = false;

	VLTJS.menuMobile = {
		init: function () {

			// navigation
			var menu = $('.vlt-nav--mobile'),
				menuToggle = $('.js-mobile-menu-toggle');

			menuToggle.on('click', function (e) {
				e.preventDefault();
				if (!menuIsOpen) {
					VLTJS.menuMobile.open_menu(menu, menuToggle);
				} else {
					VLTJS.menuMobile.close_menu(menu, menuToggle);
				}
			});

			// click on ESC
			VLTJS.document.keyup(function (e) {
				if (e.keyCode === 27) {
					e.preventDefault();
					VLTJS.menuMobile.close_menu(menu, menuToggle);
				}
			});

		},
		open_menu: function (menu, menuToggle) {
			menu.slideDown();
			menuToggle.addClass('vlt-menu-burger--opened');
			VLTJS.html.css(overflow, 'hidden');
			menuIsOpen = true;
		},
		close_menu: function (menu, menuToggle) {
			menu.slideUp();
			menuToggle.removeClass('vlt-menu-burger--opened');
			VLTJS.html.css(overflow, 'inherit');
			menuIsOpen = false;
		}
	};

	VLTJS.menuMobile.init();

})(jQuery);
/***********************************************
 * HEADER: MENU OFFCANVAS
 ***********************************************/

(function ($) {

	'use strict';

	var menuIsOpen = false;

	VLTJS.menuOffcanvas = {
		config: {
			easing: 'power2.out'
		},
		init: function () {

			var menu = $('.vlt-nav--offcanvas'),
				menuToggle = $('.js-offcanvas-menu-toggle'),
				navItem = menu.find('ul.sf-menu > li'),
				siteOverlay = $('.vlt-site-overlay');

			menuToggle.on('click', function (e) {
				e.preventDefault();
				if (!menuIsOpen) {
					VLTJS.menuOffcanvas.open_menu(menuToggle, menu, navItem, siteOverlay);
				} else {
					VLTJS.menuOffcanvas.close_menu(menuToggle, menu, siteOverlay);
				}
			});

			VLTJS.document.keyup(function (e) {
				if (e.keyCode === 27 && menuIsOpen) {
					e.preventDefault();
					VLTJS.menuOffcanvas.close_menu(menuToggle, menu, siteOverlay);
				}
			});

			siteOverlay.on('click', function () {
				if (menuIsOpen) {
					VLTJS.menuOffcanvas.close_menu(menuToggle, menu, siteOverlay);
				}
			});

		},
		open_menu: function (menuToggle, menu, navItem, siteOverlay) {
			menuIsOpen = true;
			menuToggle.addClass('vlt-menu-burger--opened');
			menu.addClass('is-open');
			if (typeof gsap !== 'undefined') {
				gsap.timeline({
						defaults: {
							ease: this.config.easing
						}
					})
					// set overflow for html
					.set(VLTJS.html, {
						overflow: 'hidden'
					})
					// overlay animation
					.to(siteOverlay, .3, {
						autoAlpha: 1
					})
					.fromTo(navItem, {
						autoAlpha: 0,
						translateY: -30,
					}, {
						autoAlpha: 1,
						translateY: 0,
						duration: .3,
						delay: .5,
						stagger: {
							amount: .2
						}
					}, '-.3');
			}
		},
		close_menu: function (menuToggle, menu, siteOverlay) {
			menuIsOpen = false;
			menuToggle.removeClass('vlt-menu-burger--opened');
			menu.removeClass('is-open');
			gsap.timeline({
					defaults: {
						ease: this.config.easing
					}
				})
				// set overflow for html
				.set(VLTJS.html, {
					overflow: 'inherit'
				})
				.to(siteOverlay, .3, {
					autoAlpha: 0,
				});
		}
	};

	VLTJS.menuOffcanvas.init();

})(jQuery);
/***********************************************
 * HEADER: MENU SLIDE
 ***********************************************/

(function ($) {

	'use strict';

	var menuIsOpen = false;

	VLTJS.menuSlide = {
		config: {
			easing: 'power2.out'
		},
		init: function () {

			var menu = $('.vlt-nav--slide'),
				menuToggle = $('.js-slide-menu-toggle'),
				navItem = menu.find('ul.sf-menu > li'),
				siteOverlay = $('.vlt-site-overlay');

			menuToggle.on('click', function (e) {
				e.preventDefault();
				if (!menuIsOpen) {
					VLTJS.menuSlide.open_menu(menuToggle, menu, navItem, siteOverlay);
				} else {
					VLTJS.menuSlide.close_menu(menuToggle, menu, siteOverlay);
				}
			});

			VLTJS.document.keyup(function (e) {
				if (e.keyCode === 27 && menuIsOpen) {
					e.preventDefault();
					VLTJS.menuSlide.close_menu(menuToggle, menu, siteOverlay);
				}
			});

			siteOverlay.on('click', function () {
				if (menuIsOpen) {
					VLTJS.menuSlide.close_menu(menuToggle, menu, siteOverlay);
				}
			});

		},
		open_menu: function (menuToggle, menu, navItem, siteOverlay) {
			menuIsOpen = true;
			menuToggle.addClass('vlt-menu-burger--opened');
			menu.addClass('is-open');
			if (typeof gsap !== 'undefined') {
				gsap.timeline({
						defaults: {
							ease: this.config.easing
						}
					})
					// set overflow for html
					.set(VLTJS.html, {
						overflow: 'hidden'
					})
					// overlay animation
					.to(siteOverlay, .3, {
						autoAlpha: 1
					})
					.fromTo(navItem, {
						autoAlpha: 0,
						translateY: -30,
					}, {
						autoAlpha: 1,
						translateY: 0,
						duration: .3,
						delay: .5,
						stagger: {
							amount: .2
						}
					}, '-.3');
			}
		},
		close_menu: function (menuToggle, menu, siteOverlay) {
			menuIsOpen = false;
			menuToggle.removeClass('vlt-menu-burger--opened');
			menu.removeClass('is-open');
			gsap.timeline({
					defaults: {
						ease: this.config.easing
					}
				})
				// set overflow for html
				.set(VLTJS.html, {
					overflow: 'inherit'
				})
				.to(siteOverlay, .3, {
					autoAlpha: 0,
				});
		}
	};

	VLTJS.menuSlide.init();

})(jQuery);
/***********************************************
 * TEMPLATE: CONTACT FORM
 ***********************************************/
(function ($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.validate == 'undefined') {
		return;
	}

	VLTJS.contactForm = {
		init: function () {

			$('.vlt-contact-form, .vlt-apply-position-form').each(function () {

				var thisForm = $(this),
					successMessage = thisForm.find('.message.success'),
					errorMessage = thisForm.find('.message.danger');

				thisForm.validate({
					errorClass: 'error',
					errorPlacement: function () {
						return false;
					},
					submitHandler: function (form) {
						$.ajax({
							type: 'POST',
							url: 'handler.php',
							data: new FormData(form),
							cache: false,
							contentType: false,
							processData: false,
							success: function () {
								successMessage.fadeIn();
								setTimeout(function () {
									successMessage.fadeOut();
								}, 5000);
							},
							error: function () {
								errorMessage.fadeIn();
								setTimeout(function () {
									errorMessage.fadeOut();
								}, 5000);
							}
						});
					}
				});

			});

		}

	}

	VLTJS.contactForm.init();

})(jQuery);
/***********************************************
 * TEMPLATE: CURSOR
 ***********************************************/
(function ($) {

	'use strict';

	// check if plugin defined
	if (typeof gsap == 'undefined') {
		return;
	}

	if (VLTJS.isMobile.any()) {
		return;
	}

	VLTJS.cursor = {
		init: function () {

			var cursor = $('.vlt-cursor'),
				circle = cursor.find('.outer, .inner'),
				startPosition = {
					x: 0,
					y: 0
				},
				endPosition = {
					x: 0,
					y: 0
				},
				delta = .25;

			if (!cursor.length) {
				return;
			}

			gsap.set(circle, {
				xPercent: -50,
				yPercent: -50
			});

			VLTJS.document.on('mousemove', function (e) {
				var offsetTop = window.pageYOffset || document.documentElement.scrollTop;
				startPosition.x = e.pageX;
				startPosition.y = e.pageY - offsetTop;
			});

			gsap.ticker.add(function () {
				endPosition.x += (startPosition.x - endPosition.x) * delta;
				endPosition.y += (startPosition.y - endPosition.y) * delta;
				gsap.set(circle, {
					x: endPosition.x,
					y: endPosition.y
				})
			});

			VLTJS.document.on('mouseenter', '.has-cursor', function () {
				cursor.addClass('is-active is-visible');
			}).on('mouseleave', '.has-cursor', function () {
				cursor.removeClass('is-active is-visible');
			});

		}
	};

	VLTJS.cursor.init();

})(jQuery);
/***********************************************
 * TEMPLATE: DEVIDE SECTION
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.devideSection = {
		init: function () {
			$('.vlt-devide-section').each(function () {
				var $this = $(this),
					elHeight = $this.outerHeight() / 2;

				$this.find('>div').css('margin-top', -elHeight);
				$this.closest('section').css('margin-top', elHeight);

			});
		}
	}

	VLTJS.devideSection.init();

	VLTJS.debounceResize(function () {
		VLTJS.devideSection.init();
	});

})(jQuery);

/***********************************************
 * TEMPLATE: DEVIDE ELEMENT
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.devideElement = {
		init: function () {
			$('.vlt-devide-element').each(function () {
				var $this = $(this),
					elHeight = $this.outerHeight() / 2;

				$this.find('>div').css('margin-top', -elHeight);

				if ($this.hasClass('reset-mobile') && VLTJS.window.outerWidth() <= 768) {
					$this.find('>div').css('margin-top', '');
				}

			});
		}
	}

	VLTJS.devideElement.init();

	VLTJS.debounceResize(function () {
		VLTJS.devideElement.init();
	});

})(jQuery);

/***********************************************
 * TEMPLATE: COLUMN SPACE TO CONTAINER
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.columnSpaceToContainer = {
		init: function () {
			var wndW = VLTJS.window.width();
			$('.vlt-column-space-to-container').each(function () {
				var $this = $(this),
					container = $('.container'),
					containerWidth = container.outerWidth(),
					containerOffset = container.offset(),
					left = containerOffset.left + (parseFloat(container.css('padding-left')) || 0),
					right = wndW - containerWidth + (parseFloat(container.css('padding-right')) || 0);
				if ($this.hasClass('to-left')) {
					$this.css({
						'padding-left': left
					});
				} else {
					$this.css({
						'padding-right': right / 2
					});
				}

			});
		}
	}

	VLTJS.columnSpaceToContainer.init();

	VLTJS.debounceResize(function () {
		VLTJS.columnSpaceToContainer.init();
	});

})(jQuery);
/***********************************************
 * TEMPLATE: FIXED FOOTER
 ***********************************************/
(function ($) {

	'use strict';

	// check if plugin defined
	if (typeof gsap == 'undefined') {
		return;
	}

	if (VLTJS.isMobile.any()) {
		return;
	}

	VLTJS.fixedFooterEffect = {
		init: function () {

			var footer = $('.vlt-footer').filter('.vlt-footer--fixed'),
				delta = .75,
				translateY = 0;

			if (footer.length) {
				if (VLTJS.window.outerWidth() >= 768) {

					VLTJS.window.on('load scroll', function () {
						var footerHeight = footer.outerHeight(),
							windowHeight = VLTJS.window.outerHeight(),
							documentHeight = VLTJS.document.outerHeight();
						translateY = delta * (Math.max(0, $(this).scrollTop() + windowHeight - (documentHeight - footerHeight)) - footerHeight);
					});

					gsap.ticker.add(function () {
						gsap.set(footer, {
							translateY: translateY,
							translateZ: 0,
						});
					});

				}
			}

		}
	};

	VLTJS.fixedFooterEffect.init();

	VLTJS.debounceResize(function () {
		VLTJS.fixedFooterEffect.init();
	});

})(jQuery);
/***********************************************
 * TEMPLATE: ISOTOPE
 ***********************************************/
(function ($) {

	'use strict';

	function vlthemes_marquee_effect() {

		$('[data-marquee]').each(function () {
			var $this = $(this),
				speed = $this.data('marquee') || 0.5,
				marqueeText = $this.find('[data-marquee-text]').first(),
				elWidth = marqueeText.outerWidth(),
				elheight = marqueeText.outerHeight(),
				duration = elWidth / elheight * speed + 's';

			if (typeof gsap !== 'undefined') {

				gsap.set($this.find('[data-marquee-text]'), {
					animationDuration: duration
				});

			}

		});

	}

	function vlthemes_tilt_portfolio_item() {

		var items = $('.vlt-work--style-4');

		if (items.length) {

			items.each(function () {
				var $this = $(this),
					meta = $this.find('.vlt-work__meta');

				if (meta.length) {
					$this.on('change', function (e, transforms) {
						var x = 1.5 * parseFloat(transforms.tiltX),
							y = 1.5 * -parseFloat(transforms.tiltY);
						meta.css('transform', 'translateY(' + y + 'px) translateX(' + x + 'px)');
					}).on('tilt.mouseLeave', function () {
						meta.css('transform', '');
					});
				}

				$this.addClass('vlt-work--tilt').tilt({
					maxTilt: 15,
					perspective: 1000,
					easing: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
					speed: 600,
					transition: 600
				});

			});

		}

	}

	function vlthemes_image_tooltip() {

		$('.vlt-hover-reveal').remove();

		$('[data-tooltip-image]').each(function (index) {

			var $this = $(this),
				size = $this.data('tooltip-size') ? $this.data('tooltip-size').split('x') : false;

			VLTJS.body.append('<div class="vlt-hover-reveal"><div class="vlt-hover-reveal__inner"><div class="vlt-hover-reveal__img" style="background-image: url(' + $this.data('tooltip-image') + ');"></div></div></div>');

			if (size) {
				VLTJS.body.find('.vlt-hover-reveal').css({
					'width': size[0] + 'px',
					'height': size[1] + 'px'
				});
			}

			var reveal = VLTJS.body.find('.vlt-hover-reveal').eq(index),
				revealInner = reveal.find('.vlt-hover-reveal__inner'),
				revealImg = reveal.find('.vlt-hover-reveal__img'),
				revealImgWidth = revealImg.outerWidth(),
				revealImgHeight = revealImg.outerHeight();

			function position_element(ev) {

				var mousePos = VLTJS.getMousePos(ev),
					docScrolls = {
						left: VLTJS.body.scrollLeft() + VLTJS.document.scrollLeft(),
						top: VLTJS.body.scrollTop() + VLTJS.document.scrollTop()
					};

				gsap.set(reveal, {
					top: mousePos.y - revealImgHeight * 0.5 - docScrolls.top + 'px',
					left: mousePos.x - revealImgWidth * 0.25 - docScrolls.left + 'px'
				});

			}

			function mouse_enter(ev) {
				position_element(ev)
				show_image();
			}

			function mouse_move(ev) {
				requestAnimationFrame(function () {
					position_element(ev);
				});
			}

			function mouse_leave() {
				hide_image();
			}

			$this.on('mouseenter', mouse_enter);
			$this.on('mousemove', mouse_move);
			$this.on('mouseleave', mouse_leave);

			function show_image() {
				gsap.killTweensOf(revealInner);
				gsap.killTweensOf(revealImg);

				gsap.timeline({
						onStart: function () {
							gsap.set(reveal, {
								opacity: 1
							});
							gsap.set($this, {
								zIndex: 1000
							});
						}
					})
					.fromTo(revealInner, 1, {
						x: '-100%',
					}, {
						x: '0%',
						ease: Quint.easeOut,
					})
					.fromTo(revealImg, 1, {
							x: '100%',
						}, {
							x: '0%',
							ease: Quint.easeOut,
						},
						'-=1');

			}

			function hide_image() {
				gsap.killTweensOf(revealInner);
				gsap.killTweensOf(revealImg);
				gsap.timeline({
						onStart: function () {
							gsap.set($this, {
								zIndex: 999
							});
						},
						onComplete: function () {
							gsap.set($this, {
								zIndex: ''
							});
							gsap.set(reveal, {
								opacity: 0
							});
						}
					})
					.to(revealInner, 0.5, {
						x: '100%',
						ease: Quint.easeOut,
					})
					.to(revealImg, 0.5, {
						x: '-100%',
						ease: Quint.easeOut,
					}, '-=0.5');
			}

		});
	}

	vlthemes_tilt_portfolio_item();
	vlthemes_marquee_effect();
	vlthemes_image_tooltip();

	VLTJS.initPluginIsotope = {
		init: function () {

			if (typeof Isotope == 'undefined') {
				return;
			}

			$('.vlt-isotope-grid').each(function () {

				var $this = $(this),
					setControls = $this.data('controls'),
					setLayout = $this.data('layout'),
					setXGap = $this.data('x-gap').split('|'),
					setYGap = $this.data('y-gap').split('|'),
					setLoadMoreSelector = $this.data('load-more-selector');

				function vlthemes_set_gaps(el, xGap, yGap) {

					if (VLTJS.window.width() >= 992) {

						el.css({
							'margin-top': -yGap[0] / 2 + 'px',
							'margin-right': -xGap[0] / 2 + 'px',
							'margin-bottom': -yGap[0] / 2 + 'px',
							'margin-left': -xGap[0] / 2 + 'px'
						});

						el.find('.grid-item').css({
							'padding-top': yGap[0] / 2 + 'px',
							'padding-right': xGap[0] / 2 + 'px',
							'padding-bottom': yGap[0] / 2 + 'px',
							'padding-left': xGap[0] / 2 + 'px'
						});

					} else {

						el.css({
							'margin-top': -yGap[1] / 2 + 'px',
							'margin-right': -xGap[1] / 2 + 'px',
							'margin-bottom': -yGap[1] / 2 + 'px',
							'margin-left': -xGap[1] / 2 + 'px'
						});

						el.find('.grid-item').css({
							'padding-top': yGap[1] / 2 + 'px',
							'padding-right': xGap[1] / 2 + 'px',
							'padding-bottom': yGap[1] / 2 + 'px',
							'padding-left': xGap[1] / 2 + 'px'
						});

					}

				}

				vlthemes_set_gaps($this, setXGap, setYGap);

				VLTJS.debounceResize(function () {
					vlthemes_set_gaps($this, setXGap, setYGap);
				});

				// filter
				var $filter = [];

				$filter = $(setControls);

				var $grid = $this.isotope({
					itemSelector: '.grid-item',
					layoutMode: setLayout,
					filter: '.filter-blog',
					filter: $filter ? $filter.find('[data-filter]').data('filter') : '*',
					masonry: {
						columnWidth: '.grid-sizer'
					},
					cellsByRow: {
						columnWidth: '.grid-sizer'
					}
				});

				$grid.imagesLoaded().progress(function () {
					$grid.isotope('layout');
				});

				$grid.on('layoutComplete', function () {
					vlthemes_set_gaps($this, setXGap, setYGap);
				});


				if ($filter.length) {

					$filter.on('click', '[data-filter]', function (e) {

						e.preventDefault();

						var $this = $(this),
							filter = $this.data('filter');

						$this.addClass('active').siblings().removeClass('active');

						$grid.isotope({
							filter: filter
						});

					});

				}

				var isClicked = false;

				$(setLoadMoreSelector).on('click', 'a', function (e) {
					e.preventDefault();

					if (isClicked) {
						return;
					}

					var $this = $(this),
						link = $this.attr('href');

					$.ajax({
						type: 'POST',
						url: link,
						dataType: 'html',
						success: function (data) {
							var items = $(data); // HTML response

							$grid.append(items).isotope('appended', items);

							$grid.imagesLoaded().progress(function () {
								$grid.isotope('layout');
							});

							$grid.isotope('layout');

							VLTJS.document.trigger('vlt-ajax-load-more');

						}
					});

					$this.addClass('disabled');

					isClicked = true;

				});

			});

		}
	}

	VLTJS.initPluginIsotope.init();

	VLTJS.document.on('vlt-ajax-load-more', function (event) {
		vlthemes_tilt_portfolio_item();
		vlthemes_marquee_effect();
		vlthemes_image_tooltip();
	});

})(jQuery);
/***********************************************
 * TEMPLATE: MASK CIRCLE
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.maskCircle = {
		init: function () {

			var maskCircle = $('.vlt-project-showcase--style-4 .vlt-project-showcase__background'),
				startPosition = {
					x: 0,
					y: 0
				},
				endPosition = {
					x: 0,
					y: 0
				};

			maskCircle.css({
				'--x': '50%',
				'--y': '50%',
			});

			VLTJS.document.on('mousemove', function (e) {
				var offsetTop = window.pageYOffset || document.documentElement.scrollTop;
				startPosition.x = e.pageX;
				startPosition.y = e.pageY - offsetTop;
				endPosition.x += (startPosition.x - endPosition.x);
				endPosition.y += (startPosition.y - endPosition.y);

				maskCircle.css({
					'--x': endPosition.x + 'px',
					'--y': endPosition.y + 'px'
				});

			});

		}
	};

	VLTJS.maskCircle.init();

})(jQuery);
/***********************************************
 * TEMPLATE: SCROLL TO SECTION
 ***********************************************/
(function ($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.scrollTo == 'undefined') {
		return;
	}

	$('a[href^="#"]').not('[href="#"]').on('click', function (e) {
		e.preventDefault();
		VLTJS.html.scrollTo($(this).attr('href'), 500);
	});

})(jQuery);
/***********************************************
 * TEMPLATE: SEARCH POPUP
 ***********************************************/
(function ($) {

	'use strict';

	var searchIsOpen = false;

	VLTJS.searchPopup = {
		config: {
			easing: 'power2.out'
		},
		init: function () {
			var search = $('.vlt-search-popup'),
				searchOpen = $('.js-search-form-open'),
				searchClose = $('.js-search-form-close'),
				siteOverlay = $('.vlt-site-overlay');

			searchOpen.on('click', function (e) {
				e.preventDefault();
				if (!searchIsOpen) {
					VLTJS.searchPopup.open_search(search, siteOverlay);
				}
			});

			searchClose.on('click', function (e) {
				e.preventDefault();
				if (searchIsOpen) {
					VLTJS.searchPopup.close_search(search, siteOverlay);
				}
			});

			siteOverlay.on('click', function (e) {
				e.preventDefault();
				if (searchIsOpen) {
					VLTJS.searchPopup.close_search(search, siteOverlay);
				}
			});

			VLTJS.document.keyup(function (e) {
				if (e.keyCode === 27 && searchIsOpen) {
					e.preventDefault();
					VLTJS.searchPopup.close_search(search, siteOverlay);
				}
			});

		},
		open_search: function (search, siteOverlay) {
			searchIsOpen = true;
			if (typeof gsap !== 'undefined') {
				gsap.timeline({
						defaults: {
							ease: this.config.easing
						}
					})
					// set overflow for html
					.set(VLTJS.html, {
						overflow: 'hidden'
					})
					// overlay animation
					.to(siteOverlay, .3, {
						autoAlpha: 1
					})
					// search animation
					.fromTo(search, .6, {
						y: '-100%'
					}, {
						y: 0,
						visibility: 'visible'
					}, '-=.3');
			}
		},
		close_search: function (search, siteOverlay) {
			searchIsOpen = false;
			if (typeof gsap !== 'undefined') {
				gsap.timeline({
						defaults: {
							ease: this.config.easing
						}
					})
					// set overflow for html
					.set(VLTJS.html, {
						overflow: 'inherit'
					})
					// search animation
					.to(search, .6, {
						y: '-100%'
					})
					// set search visiblity after hide
					.set(search, {
						visibility: 'hidden'
					})
					// overlay animation
					.to(siteOverlay, .3, {
						autoAlpha: 0,
					}, '-=.6');
			}
		}
	}
	VLTJS.searchPopup.init();

})(jQuery);
/***********************************************
 * TEMPLATE: PRELOADER
 ***********************************************/
(function ($) {
	'use strict';

	// check if plugin defined
	if (typeof gsap == 'undefined') {
		return;
	}

	var el = $('.vlt-site-preloader'),
		animateTo = el.data('animate-to');

	gsap.to(el.find('#vlt-site-preloader-path'), 1, {
		attr: {
			d: animateTo
		}
	});

	VLTJS.document.imagesLoaded(function () {
		setTimeout(function () {
			el.addClass('is-loaded');
		}, 1000);
	});

	if (el.length) {

		el.on(VLTJS.transitionEnd, function () {
			VLTJS.window.trigger('vlt.site-loaded');
		});

	} else {

		VLTJS.window.on('load', function () {
			VLTJS.window.trigger('vlt.site-loaded');
		});

	}

})(jQuery);
/***********************************************
 * TEMPLATE: STICKY NAVBAR
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.stickyNavbar = {
		init: function () {

			var navbarMain = $('.vlt-header:not(.vlt-header--slide) .vlt-navbar--main');

			// sticky navbar
			var navbarHeight = navbarMain.length ? navbarMain.outerHeight() : 0;
			var navbarMainOffset = navbarMain.hasClass('vlt-navbar--offset') ? VLTJS.window.outerHeight() : navbarHeight;

			// fake navbar
			var navbarFake = $('<div class="vlt-fake-navbar">').hide();

			function _fixed_navbar() {
				navbarMain.addClass('vlt-navbar--fixed');
				navbarFake.show();
			}

			function _unfixed_navbar() {
				navbarMain.removeClass('vlt-navbar--fixed');
				navbarFake.hide();
			}

			function _on_scroll_navbar() {
				if (VLTJS.window.scrollTop() >= navbarMainOffset) {
					_fixed_navbar();
				} else {
					_unfixed_navbar();
				}
			}

			if (navbarMain.hasClass('vlt-navbar--sticky')) {

				VLTJS.window.on('scroll resize', _on_scroll_navbar);

				_on_scroll_navbar();

				// append fake navbar
				navbarMain.after(navbarFake);

				// fake navbar height after resize
				navbarFake.height(navbarMain.innerHeight());

				VLTJS.debounceResize(function () {
					navbarFake.height(navbarMain.innerHeight());
				});

			}

			// hide navbar on scroll
			var navbarHideOnScroll = navbarMain.filter('.vlt-navbar--hide-on-scroll');

			VLTJS.throttleScroll(function (type, scroll) {
				var start = 450;

				function _show_navbar() {
					navbarHideOnScroll.removeClass('vlt-on-scroll-hide').addClass('vlt-on-scroll-show');
				}

				function _hide_navbar() {
					navbarHideOnScroll.removeClass('vlt-on-scroll-show').addClass('vlt-on-scroll-hide');
				}

				// hide or show
				if (type === 'down' && scroll > start) {
					_hide_navbar();
				} else if (type === 'up' || type === 'end' || type === 'start') {
					_show_navbar();
				}

				// add solid color
				if (navbarMain.hasClass('vlt-navbar--transparent') && navbarMain.hasClass('vlt-navbar--sticky')) {
					scroll > navbarHeight ? navbarMain.addClass('vlt-navbar--solid') : navbarMain.removeClass('vlt-navbar--solid');
				}
			});
		}
	};

	VLTJS.stickyNavbar.init();

})(jQuery);
/***********************************************
 * TEMPLATE: STRETCH ELEMENT
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.stretchElement = {
		init: function () {
			var winW = VLTJS.window.outerWidth();

			$('.vlt-stretch-block').each(function () {
				var $this = $(this),
					offsetLeft = $this.offset().left,
					elWidth = $this.outerWidth();

				if ($this.hasClass('to-left')) {
					$this.find('>*').css('margin-left', -offsetLeft);
				}
				if ($this.hasClass('to-right')) {
					$this.find('>*').css('margin-right', (offsetLeft + elWidth) - winW);
				}
				if ($this.hasClass('reset-mobile') && VLTJS.window.outerWidth() <= 768) {
					$this.find('>*').css({
						'margin-left': '',
						'margin-right': ''
					});
				}
			});

		}
	}

	VLTJS.stretchElement.init();

	VLTJS.debounceResize(function () {
		VLTJS.stretchElement.init();
	});

})(jQuery);
/***********************************************
 * WIDGET: BUTTON
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.button = {
		init: function () {

			if (!$('.vlt-btn').find('span').length) {
				$('.vlt-btn').append('<span>');
			}

			$('.vlt-btn').on('mouseenter', function (e) {
				var $this = $(this),
					parentOffset = $this.offset(),
					relX = e.pageX - parentOffset.left,
					relY = e.pageY - parentOffset.top;
				$this.find('span').css({
					top: relY,
					left: relX
				});
			}).on('mouseout', function (e) {
				var $this = $(this),
					parentOffset = $this.offset(),
					relX = e.pageX - parentOffset.left,
					relY = e.pageY - parentOffset.top;
				$this.find('span').css({
					top: relY,
					left: relX
				});
			});
		}
	};

	VLTJS.button.init();

})(jQuery);
/***********************************************
 * WIDGET: CASES SLIDER
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.casesSlider = {
		init: function () {

			var showcase = $('.vlt-cases-slider'),
				anchor = showcase.data('navigation-anchor');

			if (!showcase.length) {
				return;
			}

			var swiper = new Swiper(showcase.find('.swiper-container'), {
				init: false,
				speed: 1000,
				loop: true,
				grabCursor: true,
				spaceBetween: 100,
				slidesPerView: 1,
			});

			swiper.on('init slideChange', function () {

				var el = $(anchor),
					current = swiper.realIndex,
					total = showcase.find('.swiper-slide').not('.swiper-slide-duplicate').length,
					scale = (current + 1) / total;

				if (el.data('direction') == 'vertical') {
					el.find('.current').text(VLTJS.addLedingZero(current + 1));
					el.find('.total').text(VLTJS.addLedingZero(total));
				} else {
					el.find('.current').text(current + 1);
					el.find('.total').text(total);
				}

				el.find('.bar > span').css({
					'--scaleX': scale,
					'--speed': swiper.params.speed + 'ms'
				});

			});

			swiper.init();

		}
	}
	VLTJS.casesSlider.init();

})(jQuery);
/***********************************************
 * WIDGET: CONTENT SLIDER
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.contentSlider = {
		init: function () {

			// check if plugin defined
			if (typeof Swiper === 'undefined') {
				return;
			}

			$('.vlt-content-slider').each(function () {

				var $this = $(this),
					container = $this.find('.swiper-container'),
					anchor = $this.data('navigation-anchor'),
					gap = $this.data('gap') || 0,
					loop = $this.data('loop') || false,
					speed = $this.data('speed') || 1000,
					autoplay = $this.data('autoplay') ? true : false,
					centered = $this.data('slides-centered') ? true : false,
					freemode = $this.data('free-mode') ? true : false,
					slider_offset = $this.data('slider-offset') ? true : false,
					mousewheel = $this.data('mousewheel') ? true : false,
					autoplay_speed = $this.data('autoplay-speed'),
					settings = $this.data('slide-settings');

				var swiper = new Swiper(container, {
					init: false,
					spaceBetween: gap,
					grabCursor: true,
					initialSlide: settings.initial_slide ? settings.initial_slide : 0,
					loop: loop,
					speed: speed,
					centeredSlides: centered,
					freeMode: freemode,
					mousewheel: mousewheel,
					autoplay: autoplay ? {
						delay: autoplay_speed,
						disableOnInteraction: false
					} : false,
					autoHeight: true,
					slidesOffsetBefore: 100,
					slidesOffsetBefore: slider_offset ? $('.container').get(0).getBoundingClientRect().left + 15 : false,
					slidesOffsetAfter: slider_offset ? $('.container').get(0).getBoundingClientRect().left + 15 : false,
					navigation: {
						nextEl: $(anchor).find('.vlt-swiper-button-next'),
						prevEl: $(anchor).find('.vlt-swiper-button-prev'),
					},
					pagination: {
						el: $(anchor).find('.vlt-swiper-pagination'),
						clickable: false,
						type: 'fraction',
						renderFraction: function (currentClass, totalClass) {
							return '<span class="' + currentClass + '"></span>' +
								'<span class="sep">/</span>' +
								'<span class="' + totalClass + '"></span>';
						}
					},
					breakpoints: {
						// when window width is >= 576px
						576: {
							slidesPerView: settings.slides_to_show_mobile || settings.slides_to_show_tablet || settings.slides_to_show || 1,
							slidesPerGroup: settings.slides_to_scroll_mobile || settings.slides_to_scroll_tablet || settings.slides_to_scroll || 1,
						},
						// when window width is >= 768px
						768: {
							slidesPerView: settings.slides_to_show_tablet || settings.slides_to_show || 1,
							slidesPerGroup: settings.slides_to_scroll_tablet || settings.slides_to_scroll || 1,
						},
						// when window width is >= 992px
						992: {
							slidesPerView: settings.slides_to_show || 1,
							slidesPerGroup: settings.slides_to_scroll || 1,
						}
					}
				});

				swiper.on('init slideChange', function () {

					var el = $(anchor),
						current = swiper.realIndex,
						total = $this.find('.swiper-slide').not('.swiper-slide-duplicate').length,
						scale = (current + 1) / total;

					if (el.data('direction') == 'vertical') {
						el.find('.current').text(VLTJS.addLedingZero(current + 1));
						el.find('.total').text(VLTJS.addLedingZero(total));
					} else {
						el.find('.current').text(current + 1);
						el.find('.total').text(total);
					}

					el.find('.bar > span').css({
						'--scaleX': scale,
						'--speed': swiper.params.speed + 'ms'
					});

				});

				swiper.init();

			});
		}
	}

	VLTJS.contentSlider.init();

})(jQuery);
/***********************************************
 * WIDGET: COUNTDOWN
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.countdown = {
		init: function ($scope) {

			// check if plugin defined
			if (typeof $.fn.countdown === 'undefined') {
				return;
			}

			$('.vlt-countdown').each(function () {
				var $this = $(this),
					due_date = $this.data('due-date') || false;
				$this.countdown(due_date, function (event) {
					$this.find('[data-days]').html(event.strftime('%D'));
					$this.find('[data-hours]').html(event.strftime('%H'));
					$this.find('[data-minutes]').html(event.strftime('%M'));
					$this.find('[data-seconds]').html(event.strftime('%S'));
				});
			});
		}
	}

	VLTJS.countdown.init();

})(jQuery);
/***********************************************
 * WIDGET: COUNTER UP
 ***********************************************/
(function ($) {

	'use strict';

	// check if plugin defined
	if (typeof $.fn.numerator == 'undefined') {
		return;
	}

	VLTJS.counterUp = {
		init: function () {

			var el = $('.vlt-counter-up');

			el.each(function () {
				var $this = $(this),
					animation_duration = $this.data('animation-speed') || 1000,
					ending_number = $this.find('.vlt-counter-up__counter'),
					ending_number_value = ending_number.text(),
					delimiter = $this.data('delimiter') || false;

				if (el.hasClass('vlt-counter-up--style-2')) {

					ending_number.css({
						'min-width': ending_number.outerWidth() + 'px'
					});

				}

				$this.one('inview', function () {
					ending_number.text('0');
					ending_number.numerator({
						easing: 'linear',
						duration: animation_duration,
						delimiter: delimiter,
						toValue: ending_number_value,
					});
				});
			});
		}
	}

	VLTJS.counterUp.init();

})(jQuery);
/***********************************************
 * WIDGET: JUSTIFIED GALLERY
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.justifiedGallery = {
		init: function () {
			// check if plugin defined
			if (typeof $.fn.justifiedGallery == 'undefined') {
				return;
			}
			var el = $('.vlt-justified-gallery');
			el.each(function () {
				var $this = $(this),
					row_height = $this.data('row-height') || 360,
					margins = $this.data('margins') || 0;
				$this.imagesLoaded(function () {
					$this.justifiedGallery({
						rowHeight: row_height,
						margins: margins,
						border: 0
					});
				});
			});
		}
	}
	VLTJS.justifiedGallery.init();

})(jQuery);
/***********************************************
 * WIDGET: PARTICLE
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.particleImage = {
		init: function () {

			var el = $('.vlt-particle'),
				prefix = 'animate__';

			VLTJS.window.on('vlt.site-loaded', function () {
				el.each(function () {
					var $this = $(this);
					$this.one('inview', function () {
						var animationName = $this.data('animation-name');
						$this.addClass(prefix + 'animated').addClass(prefix + animationName);
					});
				});
			});

		}
	};

	VLTJS.particleImage.init();

})(jQuery);
/***********************************************
 * WIDGET: PROGRESS BAR
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.progressBar = {
		init: function () {
			// check if plugin defined
			if (typeof gsap == 'undefined') {
				return;
			}
			var el = $('.vlt-progress-bar');
			el.each(function () {
				var $this = $(this),
					final_value = $this.data('final-value') || 0,
					animation_duration = $this.data('animation-speed') || 0,
					delay = 500,
					obj = {
						count: 0
					};

				$this.one('inview', function () {

					gsap.to(obj, (animation_duration / 1000) / 2, {
						count: final_value,
						delay: delay / 1000,
						onUpdate: function () {
							$this.find('.vlt-progress-bar__title > .counter').text(Math.round(obj.count));
						}
					});

					gsap.to($this.find('.vlt-progress-bar__bar > span'), animation_duration / 1000, {
						width: final_value + '%',
						delay: delay / 1000
					});

				});

			});
		}
	}
	VLTJS.progressBar.init();

})(jQuery);
/***********************************************
 * WIDGET: PROJECT SHOWCASE
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.projectShowcase2 = {
		init: function () {

			var showcase = $('.vlt-project-showcase--style-2'),
				anchor = showcase.data('navigation-anchor');

			if (!showcase.length) {
				return;
			}

			var swiper = new Swiper(showcase.find('.swiper-container'), {
				init: false,
				initialSlide: 1,
				speed: 1000,
				loop: true,
				grabCursor: true,
				spaceBetween: 0,
				direction: 'vertical',
				centeredSlides: true,
				slidesPerView: 'auto',
				mousewheel: true
			});

			swiper.on('init slideChange', function () {

				var el = $(anchor),
					current = swiper.realIndex,
					total = showcase.find('.swiper-slide').not('.swiper-slide-duplicate').length,
					scale = (current + 1) / total;

				if (el.data('direction') == 'vertical') {
					el.find('.current').text(VLTJS.addLedingZero(current + 1));
					el.find('.total').text(VLTJS.addLedingZero(total));
				} else {
					el.find('.current').text(current + 1);
					el.find('.total').text(total);
				}

				el.find('.bar > span').css({
					'--scaleX': scale,
					'--speed': swiper.params.speed + 'ms'
				});

			});

			swiper.init();

		}
	}
	VLTJS.projectShowcase2.init();

	VLTJS.projectShowcase3 = {
		init: function () {

			var showcase = $('.vlt-project-showcase--style-3'),
				anchor = showcase.data('navigation-anchor');

			if (!showcase.length) {
				return;
			}

			var swiper = new Swiper(showcase.find('.swiper-container'), {
				init: false,
				speed: 1000,
				spaceBetween: 0,
				grabCursor: true,
				direction: 'vertical',
				slidesPerView: 1,
				mousewheel: true,
				loop: true,
				parallax: true
			});

			swiper.on('init slideChange', function () {

				var el = $(anchor),
					current = swiper.realIndex,
					total = showcase.find('.swiper-slide').not('.swiper-slide-duplicate').length,
					scale = (current + 1) / total;

				if (el.data('direction') == 'vertical') {
					el.find('.current').text(VLTJS.addLedingZero(current + 1));
					el.find('.total').text(VLTJS.addLedingZero(total));
				} else {
					el.find('.current').text(current + 1);
					el.find('.total').text(total);
				}

				el.find('.bar > span').css({
					'--scaleX': scale,
					'--speed': swiper.params.speed + 'ms'
				});

			});

			swiper.init();

			showcase.on('click', '.vlt-project-showcase__next-slide a', function (e) {
				e.preventDefault();
				swiper.slideNext();
			});

		}
	}

	VLTJS.projectShowcase3.init();

	VLTJS.projectShowcase4 = {
		init: function () {

			var showcase = $('.vlt-project-showcase--style-4'),
				anchor = showcase.data('navigation-anchor');

			if (!showcase.length) {
				return;
			}

			var swiper = new Swiper(showcase.find('.swiper-container'), {
				init: false,
				speed: 1000,
				direction: 'vertical',
				slidesPerView: 1,
				mousewheel: true,
				parallax: true
			});

			swiper.on('init slideChange', function () {
				var brightness = showcase.find('.swiper-slide').eq(swiper.realIndex).find('.vlt-project-showcase__item').data('brightness');
				switch (brightness) {
					case 'light':
						if ($('.vlt-navbar').hasClass('vlt-navbar--white-text-on-top')) {
							$('.vlt-navbar').removeClass('vlt-navbar--white-text-on-top');
						}
						if ($('.vlt-site-fixed-bar').hasClass('has-white-color')) {
							$('.vlt-site-fixed-bar').removeClass('has-white-color');
						}
						break;
					case 'dark':
						if (!$('.vlt-navbar').hasClass('vlt-navbar--white-text-on-top')) {
							$('.vlt-navbar').addClass('vlt-navbar--white-text-on-top');
						}
						if (!$('.vlt-site-fixed-bar').hasClass('has-white-color')) {
							$('.vlt-site-fixed-bar').addClass('has-white-color');
						}
						break;
				}
			});

			swiper.on('init slideChange', function () {

				var el = $(anchor),
					current = swiper.realIndex,
					total = showcase.find('.swiper-slide').not('.swiper-slide-duplicate').length,
					scale = (current + 1) / total;

				if (el.data('direction') == 'vertical') {
					el.find('.current').text(VLTJS.addLedingZero(current + 1));
					el.find('.total').text(VLTJS.addLedingZero(total));
				} else {
					el.find('.current').text(current + 1);
					el.find('.total').text(total);
				}

				el.find('.bar > span').css({
					'--scaleX': scale,
					'--speed': swiper.params.speed + 'ms'
				});

			});

			swiper.init();

			showcase.on('click', '.vlt-project-showcase__next-slide a', function (e) {
				e.preventDefault();
				swiper.slideNext();
			});

		}
	}

	VLTJS.projectShowcase4.init();

	VLTJS.projectShowcase5 = {
		init: function () {

			var showcase = $('.vlt-project-showcase--style-5'),
				anchor = showcase.data('navigation-anchor');

			if (!showcase.length) {
				return;
			}

			var swiper = new Swiper(showcase.find('.swiper-container'), {
				init: false,
				speed: 1000,
				grabCursor: true,
				slidesPerView: 1,
				parallax: true,
				navigation: {
					nextEl: $(anchor).find('.vlt-swiper-button-next'),
					prevEl: $(anchor).find('.vlt-swiper-button-prev'),
				},
			});

			swiper.on('init slideChange', function () {

				var el = $(anchor),
					current = swiper.realIndex,
					total = showcase.find('.swiper-slide').not('.swiper-slide-duplicate').length,
					scale = (current + 1) / total;

				if (el.data('direction') == 'vertical') {
					el.find('.current').text(VLTJS.addLedingZero(current + 1));
					el.find('.total').text(VLTJS.addLedingZero(total));
				} else {
					el.find('.current').text(current + 1);
					el.find('.total').text(total);
				}

				el.find('.bar > span').css({
					'--scaleX': scale,
					'--speed': swiper.params.speed + 'ms'
				});

			});

			swiper.init();

		}
	}

	VLTJS.projectShowcase5.init();

	VLTJS.projectShowcase6 = {
		init: function () {

			var showcase = $('.vlt-project-showcase--style-6'),
				anchor = showcase.data('navigation-anchor');

			if (!showcase.length) {
				return;
			}

			function mask_title() {

				showcase.find('.vlt-project-showcase__item').each(function () {

					var $this = $(this),
						imageOffsetLeft = $this.find('.vlt-project-showcase__image').offset().left,
						titleWidth = $this.find('.vlt-project-showcase__title.original').outerWidth(),
						titleOffsetLeft = $this.find('.vlt-project-showcase__title.original').offset().left,
						calcClipPath = (titleWidth + titleOffsetLeft) - imageOffsetLeft;

					$this.find('.vlt-project-showcase__title.mask').css({
						'clip-path': 'inset(0 ' + calcClipPath + 'px 0 0)'
					});

				});

			}

			var swiper = new Swiper(showcase.find('.swiper-container'), {
				init: false,
				grabCursor: true,
				speed: 1000,
				slidesPerView: 1,
				effect: 'fade',
				touchReleaseOnEdges: true,
				navigation: {
					nextEl: $(anchor).find('.vlt-swiper-button-next'),
					prevEl: $(anchor).find('.vlt-swiper-button-prev'),
				},
			});

			mask_title();
			swiper.on('resize', mask_title);

			swiper.on('init slideChange', function () {

				var el = $(anchor),
					current = swiper.realIndex,
					total = showcase.find('.swiper-slide').not('.swiper-slide-duplicate').length,
					scale = (current + 1) / total;

				if (el.data('direction') == 'vertical') {
					el.find('.current').text(VLTJS.addLedingZero(current + 1));
					el.find('.total').text(VLTJS.addLedingZero(total));
				} else {
					el.find('.current').text(current + 1);
					el.find('.total').text(total);
				}

				el.find('.bar > span').css({
					'--scaleX': scale,
					'--speed': swiper.params.speed + 'ms'
				});

			});

			swiper.init();

		}
	}

	VLTJS.projectShowcase6.init();

	VLTJS.projectShowcase7 = {
		init: function () {

			var showcase = $('.vlt-project-showcase--style-7'),
				anchor = showcase.data('navigation-anchor'),
				navigationItem = showcase.find('.vlt-project-showcase__navigation > li');

			if (!showcase.length) {
				return;
			}

			var swiper = new Swiper(showcase.find('.swiper-container'), {
				init: false,
				grabCursor: true,
				speed: 1000,
				slidesPerView: 1,
				effect: 'fade',
				touchReleaseOnEdges: true,
				navigation: {
					nextEl: $(anchor).find('.vlt-swiper-button-next'),
					prevEl: $(anchor).find('.vlt-swiper-button-prev'),
				},
			});

			swiper.on('init slideChange', function () {
				var brightness = showcase.find('.swiper-slide').eq(swiper.realIndex).find('.vlt-project-showcase__item').data('brightness');
				switch (brightness) {
					case 'light':
						if ($('.vlt-navbar').hasClass('vlt-navbar--white-text-on-top')) {
							$('.vlt-navbar').removeClass('vlt-navbar--white-text-on-top');
						}
						if ($('.vlt-site-fixed-bar').hasClass('has-white-color')) {
							$('.vlt-site-fixed-bar').removeClass('has-white-color');
						}
						break;
					case 'dark':
						if (!$('.vlt-navbar').hasClass('vlt-navbar--white-text-on-top')) {
							$('.vlt-navbar').addClass('vlt-navbar--white-text-on-top');
						}
						if (!$('.vlt-site-fixed-bar').hasClass('has-white-color')) {
							$('.vlt-site-fixed-bar').addClass('has-white-color');
						}
						break;
				}
			});

			swiper.on('init', function () {

				var current = swiper.realIndex;
				navigationItem.eq(current).addClass('is-active');

				navigationItem.on('click', function () {
					var $this = $(this),
						index = $this.index();
					navigationItem.removeClass('is-active');
					$this.addClass('is-active');
					swiper.slideTo(index);
				});

			});

			swiper.on('init slideChange', function () {

				var el = $(anchor),
					current = swiper.realIndex,
					total = showcase.find('.swiper-slide').not('.swiper-slide-duplicate').length,
					scale = (current + 1) / total;

				if (el.data('direction') == 'vertical') {
					el.find('.current').text(VLTJS.addLedingZero(current + 1));
					el.find('.total').text(VLTJS.addLedingZero(total));
				} else {
					el.find('.current').text(current + 1);
					el.find('.total').text(total);
				}

				el.find('.bar > span').css({
					'--scaleX': scale,
					'--speed': swiper.params.speed + 'ms'
				});

			});

			swiper.init();
		}
	}

	VLTJS.projectShowcase7.init();

})(jQuery);
/***********************************************
 * WIDGET: TABS
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.tabs = {
		init: function () {

			var tabs = $('.vlt-tabs'),
				tabsImage = $('.vlt-tabs-image li');

			tabs.on('mouseenter', 'li', function () {

				var $this = $(this),
					index = $this.index();

				tabsImage.removeClass('is-active');
				tabs.find('li').removeClass('is-active');

				$this.addClass('is-active');
				tabsImage.eq(index).addClass('is-active');

			});

		}
	};

	VLTJS.tabs.init();

})(jQuery);
/***********************************************
 * WIDGET: TYPES LIST
 ***********************************************/
(function ($) {

	'use strict';

	VLTJS.typesList = {
		init: function () {

			var typesList = $('.vlt-types-list'),
				typesListItem = typesList.find('.vlt-types-list__item'),
				background = $('.vlt-types-background'),
				backgroundImage = background.find('.vlt-types-background__image');

			typesListItem.on('mouseenter', function () {

				var $this = $(this),
					index = $this.index(),
					nearby = $this.siblings('.vlt-types-list__item');

				VLTJS.typesList.add_opacity(nearby);
				VLTJS.typesList.current_background(index, backgroundImage);

			}).on('mouseleave', function () {

				VLTJS.typesList.remove_opacity(typesListItem);

			});

			typesList.on('mouseenter', function () {
				typesList.addClass('is-active');
				background.addClass('is-active');
			}).on('mouseleave', function () {
				typesList.removeClass('is-active');
				backgroundImage.removeClass('is-active');
				background.removeClass('is-active');
			});

		},
		add_opacity: function (nearby) {

			nearby.each(function () {
				$(this).addClass('is-opacity');
			});

		},
		current_background: function (index, backgroundImage) {

			backgroundImage.removeClass('is-active');
			backgroundImage.eq(index).addClass('is-active');

		},
		remove_opacity: function (typesListItem) {

			typesListItem.removeClass('is-opacity');

		}
	};

	VLTJS.typesList.init();

})(jQuery);