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
    const data = new FormData();

    Array.from(this.form.elements).forEach(field => {
      if (
        field.name &&
        !field.disabled &&
        !['radio', 'checkbox', 'reset', 'submit', 'button'].includes(field.type)
      ) {
        if (field.type === 'file') {
          data.append(field.name, field.files[0]);
        } else {
          data.set(field.name, field.value);
        }
      }
    });

    const success = () => {
      this.onSuccess();
      this.reset();
    };

    const error = () => {
      window.alert(
        'Произошла ошибка. Пожалуйста, попробуйте еще раз или позвоните нам.'
      );
    };

    axios({
      method: 'post',
      url: this.form.action,
      data,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        success();
      })
      .catch(() => {
        error();
      });
  }

  reset() {
    this.form.reset();
    this.form.dispatchEvent(new Event('reset'));
  }

  onSuccess = () => {
    window.location = this.form.dataset.success;
    // const name = this.form.closest('[data-modal]').dataset.modal;
    // $.qs(`[data-modal-close="${name}"]`).click();
    // $.qs('[data-modal-open="success"]').click();
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
