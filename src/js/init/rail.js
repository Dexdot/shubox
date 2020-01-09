import Rail from '@/components/rail';

const initRail = () => {
  $.each('.js-rail', el => {
    const track = $.qs('.rail__track', el);
    const railContainer = $.qs('.rail__container', el);
    const trackContainer = $.qs('.rail__track-container', el);

    trackContainer.append(track.cloneNode(true));
    railContainer.append(trackContainer.cloneNode(true));

    const rail = new Rail(el);
  });
};

window.addEventListener('DOMContentLoaded', initRail);
