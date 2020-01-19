import Rail from '@/components/rail';

const initRail = () => {
  $.each('.js-rail', el => {
    const track = $.qs('.rail__track', el);
    const railContainer = $.qs('.rail__container', el);
    const trackContainer = $.qs('.rail__track-container', el);

    trackContainer.append(track.cloneNode(true));
    railContainer.append(trackContainer.cloneNode(true));

    const rail = new Rail(el);

    if (el.classList.contains('reviews-rail')) {
      $.qsa('.js-review', rail.DOM.el).forEach(img => {
        img.addEventListener('click', () => {
          // Set modal img src
          const { src } = img.dataset;
          $.qs('.review-img img').src = src;

          // Open if not dragging
          if (!rail.preventClick) {
            $.qs('[data-modal-open="review"]').click();
          }
        });
      });
    }
  });
};

window.addEventListener('DOMContentLoaded', initRail);
