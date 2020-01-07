import Inputmask from 'inputmask';

export default class Input {
  constructor(el) {
    this.el = el;
    this.input = $.qs('.input__field', this.el);
    this.isFile = this.input.type === 'file';
    this.isPhone = this.input.type === 'tel';

    this.setup();
  }

  setup() {
    if (this.isPhone) {
      this.im = new Inputmask('+9(999)999-99-99', { showMaskOnHover: false });
      this.im.mask(this.input);
    }

    this.handleKeyup();
    this.handleFocus();
  }

  handleKeyup() {
    const check = () => {
      if (this.input.value.length > 0) {
        this.el.classList.add('input--filled');
      } else {
        this.el.classList.remove('input--filled');
      }
    };

    check();
    this.input.addEventListener('keyup', () => {
      check();
    });
  }

  handleFocus() {
    if (this.input.readOnly || this.isFile) return false;

    this.input.addEventListener('focus', () => {
      this.el.classList.add('input--focused');
    });
    this.input.addEventListener('focusout', () => {
      this.el.classList.remove('input--focused');
    });
  }
}
