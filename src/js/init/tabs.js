const close = tab => {
  // type должен содержать 2 слова, разделенное дефисом:
  // общее_имя_таба-конкретный_таб
  const type = tab.split('-')[0];

  $.each(`[data-tab^=${type}]`, el => {
    el.classList.remove('active');
  });

  $.each(`[data-tab-content^=${type}]`, el => {
    el.classList.remove('active');
  });
};

const initTabs = () => {
  // Инициализация табов
  $.delegate('[data-tab]', (e, el) => {
    const { tab } = el.dataset;

    if (el.classList.contains('active')) {
      return false;
    }

    close(tab);

    const content = $.qs(`[data-tab-content=${tab}]`);
    el.classList.add('active');
    content.classList.add('active');

    window.loco.update();
  });
};

window.addEventListener('DOMContentLoaded', initTabs);
