import init from 'autosize';

const initAutosize = () => {
  $.each('.input--textarea .input__field', el => {
    init(el);
  });
};

window.addEventListener('DOMContentLoaded', initAutosize);
