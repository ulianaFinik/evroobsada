// Partners slider (.partners__slider) — отвечает за слайдер партнёров
const partnersSlider = document.querySelector(".partners__slider");

if (partnersSlider && window.Swiper) {
  // Пагинация внутри блока партнёров
  const paginationEl = partnersSlider.querySelector(".partners__pagination");

  // Инициализация Swiper для партнёров
  new Swiper(partnersSlider, {
    slidesPerView: "auto",
    spaceBetween: 50,
    loop: true,
    speed: 600,
    observer: true,
    observeParents: true,
    breakpointsBase: "container",
    pagination: {
      el: paginationEl,
      type: "progressbar",
    },
  });
}

// News slider (.news__slider) — отвечает за слайдер новостей
const newsSlider = document.querySelector(".news__slider");

if (newsSlider && window.Swiper) {
  // Пагинация внутри блока новостей
  const paginationEl = newsSlider.querySelector(".news__pagination");

  // Инициализация Swiper для новостей
  new Swiper(newsSlider, {
    slidesPerView: "auto",
    spaceBetween: 24,
    loop: true,
    speed: 600,
    observer: true,
    observeParents: true,
    breakpointsBase: "container",
    pagination: {
      el: paginationEl,
      type: "progressbar",
    },
  });
}

// Бургер-меню (header .header + кнопка .header__burger)
const header = document.querySelector(".header");
const burger = document.querySelector(".header__burger");

if (header && burger) {
  // Закрытие мобильного меню
  const closeMenu = () => {
    header.classList.remove("header--open");
    burger.setAttribute("aria-expanded", "false");
  };

  // Открытие/закрытие меню по клику
  burger.addEventListener("click", () => {
    const isOpen = header.classList.toggle("header--open");
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  // Закрывать меню после клика по ссылке в меню (на мобиле)
  header.querySelectorAll(".header__menu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 1200) {
        closeMenu();
      }
    });
  });

  // Сбрасывать состояние меню при возвращении на десктоп
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1200) {
      closeMenu();
    }
  });
}

// Модалка «Обратный звонок» (.callback)
const callbackModal = document.querySelector(".callback");

if (callbackModal) {
  // Кнопки открытия модалки (в шапке)
  const openButtons = document.querySelectorAll(".header__callback");
  // Кнопка закрытия внутри модалки
  const closeButton = callbackModal.querySelector(".callback__close");
  // Текущий скролл для корректного возврата
  let scrollY = 0;

  // Открыть модалку и заблокировать скролл
  const openModal = (event) => {
    if (event) {
      event.preventDefault();
    }
    callbackModal.classList.add("is-open");
    scrollY = window.scrollY;
    document.body.style.setProperty("--scroll-lock-top", `-${scrollY}px`);
    document.body.classList.add("no-scroll");
  };

  // Закрыть модалку и вернуть скролл
  const closeModal = () => {
    callbackModal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    document.body.style.removeProperty("--scroll-lock-top");
    window.scrollTo(0, scrollY);
  };

  // Навесить открытие по клику на все кнопки
  openButtons.forEach((btn) => btn.addEventListener("click", openModal));

  // Закрытие по кнопке-крестику
  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  // Закрытие по клику на фон (оверлей)
  callbackModal.addEventListener("click", (event) => {
    if (event.target === callbackModal) {
      closeModal();
    }
  });

  // Закрытие по клавише Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && callbackModal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

// Каталог (.catalog-page) — фильтры, сортировка, пагинация, аккордеон
const catalogPage = document.querySelector(".catalog-page");

if (catalogPage) {
  // Сетка карточек
  const grid = catalogPage.querySelector(".catalog-grid");
  // Все карточки товаров
  const cards = Array.from(grid.querySelectorAll(".catalog-card"));
  // Контейнер пагинации
  const pagination = catalogPage.querySelector(".catalog-pagination");
  // Кнопки «Применить» и «Сбросить»
  const applyBtn = catalogPage.querySelector(".catalog-filter__apply");
  const resetBtn = catalogPage.querySelector(".catalog-filter__reset");
  // Кнопка сортировки по цене
  const sortBtn = catalogPage.querySelector(".catalog-sort__btn");
  // Селект «Показывать»
  const perPageSelect = catalogPage.querySelector(".catalog-sort__show select");
  // Инпуты цены
  const priceMinInput = catalogPage.querySelector('[data-filter="price-min"]');
  const priceMaxInput = catalogPage.querySelector('[data-filter="price-max"]');
  // Чекбоксы фильтров
  const filterInputs = Array.from(
    catalogPage.querySelectorAll('.catalog-filter__option input[type="checkbox"]')
  );
  // Группы фильтров (для аккордеона)
  const filterGroups = Array.from(catalogPage.querySelectorAll(".catalog-filter__group"));

  // Получить цену карточки из data-price
  const getPrice = (card) => parseFloat(card.dataset.price || "0");

  // Значение по умолчанию для селекта «Показывать»
  if (perPageSelect) {
    perPageSelect.value = "6";
  }

  // Сохранение начальных значений фильтров/сортировки
  const defaults = {
    sort: sortBtn ? sortBtn.dataset.sort : "asc",
    perPage: parseInt(perPageSelect.value, 10) || 6,
    checks: filterInputs.map((input) => input.checked),
    priceMin: priceMinInput.value,
    priceMax: priceMaxInput.value,
  };

  // Минимальная/максимальная цена из карточек (для placeholder)
  const prices = cards.map((card) => getPrice(card)).filter((price) => !Number.isNaN(price));
  const catalogMin = prices.length ? Math.min(...prices) : 0;
  const catalogMax = prices.length ? Math.max(...prices) : 0;

  if (priceMinInput && !priceMinInput.value) {
    priceMinInput.placeholder = String(catalogMin);
  }
  if (priceMaxInput && !priceMaxInput.value) {
    priceMaxInput.placeholder = String(catalogMax);
  }

  // Текущее состояние каталога
  const state = {
    page: 1,
    sort: defaults.sort,
    perPage: defaults.perPage,
  };

  // Получить выбранные значения конкретного фильтра
  const getSelected = (key) =>
    filterInputs
      .filter((input) => input.dataset.filter === key && input.checked)
      .map((input) => input.value);

  // Рендер пагинации
  const renderPagination = (totalPages) => {
    pagination.innerHTML = "";

    const makeButton = (label, page, className, disabled) => {
      const btn = document.createElement("button");
      btn.type = "button";
      if (label === "prev" || label === "next") {
        const img = document.createElement("img");
        img.src = label === "prev" ? "assets/img/left.png" : "assets/img/right.png";
        img.alt = label === "prev" ? "Назад" : "Вперёд";
        btn.appendChild(img);
      } else {
        btn.textContent = label;
      }
      if (className) {
        btn.className = className;
      }
      if (page !== null) {
        btn.dataset.page = page;
      }
      if (disabled) {
        btn.disabled = true;
      }
      return btn;
    };

    pagination.appendChild(
      makeButton("prev", Math.max(1, state.page - 1), "catalog-pagination__arrow", state.page === 1)
    );

    for (let i = 1; i <= totalPages; i += 1) {
      const btn = makeButton(i, i, "catalog-pagination__item", false);
      if (i === state.page) {
        btn.classList.add("is-active");
      }
      pagination.appendChild(btn);
    }

    pagination.appendChild(
      makeButton(
        "next",
        Math.min(totalPages, state.page + 1),
        "catalog-pagination__arrow",
        state.page === totalPages
      )
    );
  };

  // Основное обновление каталога: сортировка, фильтры, пагинация
  const update = () => {
    const selectedKind = getSelected("kind");
    const selectedHouse = getSelected("house");
    const selectedType = getSelected("type");

    const minPrice = parseFloat(priceMinInput.value.replace(",", "."));
    const maxPrice = parseFloat(priceMaxInput.value.replace(",", "."));

    const sortedCards = [...cards].sort((a, b) => {
      const diff = getPrice(a) - getPrice(b);
      return state.sort === "desc" ? -diff : diff;
    });

    // Переупорядочить DOM под текущую сортировку
    sortedCards.forEach((card) => grid.appendChild(card));

    let filtered = sortedCards.filter((card) => {
      const price = getPrice(card);
      if (!Number.isNaN(minPrice) && price < minPrice) {
        return false;
      }
      if (!Number.isNaN(maxPrice) && price > maxPrice) {
        return false;
      }
      if (selectedKind.length && !selectedKind.includes(card.dataset.kind)) {
        return false;
      }
      if (selectedHouse.length && !selectedHouse.includes(card.dataset.house)) {
        return false;
      }
      if (selectedType.length && !selectedType.includes(card.dataset.type)) {
        return false;
      }
      return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));
    state.page = Math.min(state.page, totalPages);

    const start = (state.page - 1) * state.perPage;
    const visible = filtered.slice(start, start + state.perPage);

    cards.forEach((card) => {
      card.style.display = "none";
    });

    visible.forEach((card) => {
      card.style.display = "";
    });

    renderPagination(totalPages);
  };

  // Логика аккордеона фильтров на мобилке
  const setupAccordion = () => {
    const isMobile = window.innerWidth <= 992;
    filterGroups.forEach((group, index) => {
      const toggle = group.querySelector(".catalog-filter__toggle");
      if (!toggle) {
        return;
      }
      if (isMobile) {
        if (!group.classList.contains("is-open") && index === 0) {
          group.classList.add("is-open");
        }
      } else {
        group.classList.add("is-open");
      }
    });
  };

  // Клик по заголовку фильтра (только на мобилке)
  filterGroups.forEach((group) => {
    const toggle = group.querySelector(".catalog-filter__toggle");
    if (!toggle) {
      return;
    }
    toggle.addEventListener("click", () => {
      if (window.innerWidth > 992) {
        return;
      }
      group.classList.toggle("is-open");
    });
  });

  // Клики по пагинации
  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page]");
    if (!button) {
      return;
    }
    state.page = Number(button.dataset.page);
    update();
  });

  // Применить фильтры
  applyBtn.addEventListener("click", () => {
    state.page = 1;
    update();
  });

  // Сбросить фильтры к значениям по умолчанию
  resetBtn.addEventListener("click", () => {
    filterInputs.forEach((input, index) => {
      input.checked = defaults.checks[index];
    });
    priceMinInput.value = defaults.priceMin;
    priceMaxInput.value = defaults.priceMax;
    state.sort = defaults.sort;
    state.perPage = defaults.perPage;
    if (sortBtn) {
      sortBtn.dataset.sort = state.sort;
      sortBtn.innerHTML =
        state.sort === "desc"
          ? 'Цена <span class="catalog-sort__icon">v</span>'
          : 'Цена <span class="catalog-sort__icon">^</span>';
    }
    perPageSelect.value = String(state.perPage);
    state.page = 1;
    update();
  });

  // Смена количества карточек на странице
  perPageSelect.addEventListener("change", () => {
    state.perPage = parseInt(perPageSelect.value, 10) || defaults.perPage;
    state.page = 1;
    update();
  });

  // Переключение сортировки
  if (sortBtn) {
    sortBtn.addEventListener("click", () => {
      state.sort = state.sort === "asc" ? "desc" : "asc";
      sortBtn.dataset.sort = state.sort;
      sortBtn.innerHTML =
        state.sort === "desc"
          ? 'Цена <span class="catalog-sort__icon">v</span>'
          : 'Цена <span class="catalog-sort__icon">^</span>';
      state.page = 1;
      update();
    });
  }

  // Инициализация аккордеона + обновление при ресайзе
  setupAccordion();
  window.addEventListener("resize", setupAccordion);

  // Первый рендер каталога
  update();
}
