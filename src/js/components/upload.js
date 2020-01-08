export default class Upload {
  constructor(el) {
    this.DOM = { el };

    // Инпут
    this.DOM.input = $.qs('.js-upload-input', this.DOM.el);

    // Превью
    this.DOM.previewText = $.qs('.js-upload-text', this.DOM.el);
    this.DOM.previewImg = $.qs('.js-upload-img', this.DOM.el);

    this.DOM.click = $.qs('.js-upload-click', this.DOM.el);
    this.DOM.clear = $.qs('.js-upload-clear', this.DOM.el);

    if (this.DOM.previewText)
      this.originalText = this.DOM.previewText.textContent;

    this.TYPES = ['doc', 'docx', 'pdf'];

    this.initEvents();
  }

  initEvents() {
    this.DOM.input.addEventListener('change', () => {
      this.onFileInputChange();
    });
    if (this.DOM.click)
      this.DOM.click.addEventListener('click', () => {
        this.DOM.input.click();
      });

    if (this.DOM.clear)
      this.DOM.clear.addEventListener('click', () => {
        this.clear();
      });
  }

  onFileInputChange() {
    // Выбираем загруженный файл
    const file = this.DOM.input.files[0];
    // const fileName = file.name.toLowerCase();
    // const isValidExtension = this.TYPES.some(
    //   type =>
    //     fileName.endsWith(type) ||
    //     fileName.endsWith(type.toLowerCase()) ||
    //     fileName.endsWith(type.toUpperCase())
    // );

    // if (file && isValidExtension) {
    if (file) {
      this.showPreview(file);
    } else {
      this.clear();
    }
  }

  clear() {
    this.hidePreview();
    this.clearInput();
  }

  clearInput = () => {
    this.DOM.input.value = '';
  };

  hidePreview = () => {
    if (this.DOM.previewText)
      this.DOM.previewText.textContent = this.originalText;

    if (this.DOM.previewImg) {
      this.DOM.previewImg.classList.add('u-hidden');
      this.DOM.previewImg.src = '';
    }
  };

  showPreview = file => {
    const reader = new FileReader();

    // Показываем загруженную картинку после загрузки
    reader.addEventListener('load', () => {
      if (this.DOM.previewText) this.DOM.previewText.textContent = file.name;

      if (this.DOM.previewImg) {
        this.DOM.previewImg.src = reader.result;
        this.DOM.previewImg.classList.remove('u-hidden');
      }
    });

    // base64
    reader.readAsDataURL(file);
  };
}
