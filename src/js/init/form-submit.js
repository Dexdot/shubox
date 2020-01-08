import axios from 'axios';
import Inputmask from 'inputmask';

class Form {
  constructor(form) {
    this.form = form;

    this.init();
  }

  init() {
    this.im = new Inputmask('+9(999)999-99-99');

    this.form.addEventListener('submit', e => {
      e.preventDefault();

      if (this.isValid()) {
        this.submit();
      } else {
        window.alert('Пожалуйста, заполните все поля');
      }
    });
  }

  submit() {
    const data = $.serialize(this.form);

    axios
      .post(this.form.action, data)
      .then(() => {
        this.onSuccess();
        this.reset();
      })
      .catch(() => {
        window.alert(
          'Произошла ошибка. Пожалуйста, попробуйте еще раз или позвоните нам.'
        );
      });
  }

  reset() {
    this.form.reset();
  }

  onSuccess = () => {
    $.qs('[data-modal-open="success"]').click();
  };

  isValid() {
    return $.qsa('input', this.form).every(input => {
      switch (input.type) {
        case 'checkbox':
          return input.checked;

        case 'tel':
          return this.im.unmaskedvalue(input.value).length > 10;

        default:
          return input.validity.valid;
      }
    });
  }
}

// Mask
window.addEventListener('DOMContentLoaded', () => {
  $.each('.js-form', form => {
    new Form(form);
  });
});
