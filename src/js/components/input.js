import Inputmask from 'inputmask';

const maskPhone = '+9(999)999-99-99';
const maskOptions = { showMaskOnHover: false };

export default class Input {
  constructor(el) {
    this.el = el;
    this.input = $.qs('.input__field', this.el);
    this.isFile = this.input.type === 'file';
    this.isPhone = this.input.type === 'tel';

    this.setup();
  }

  setup() {
    if (this.isPhone) this.handlePhone();
    this.handleKeyup();
    this.handleFocus();
  }

  handlePhone() {
    const initMask = () => {
      const im = new Inputmask(maskPhone, maskOptions);
      im.mask(this.input);
    };
    initMask();

    this.input.addEventListener('keydown', ({ keyCode }) => {
      if (typeof keyCode === 'undefined') {
        this.input.inputmask.remove();
      }
    });

    this.input.addEventListener('keyup', ({ keyCode }) => {
      if (keyCode === 'undefined') {
        initMask();
      }
    });
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
