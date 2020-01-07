import Input from '@/components/input';

const initInput = () => {
  const inputs = [];

  $.each('.input', el => {
    inputs.push(new Input(el));
  });
};

window.addEventListener('DOMContentLoaded', initInput);
