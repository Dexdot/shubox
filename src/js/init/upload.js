import Upload from '@/components/upload';

$.each('.js-upload', el => {
  const u = new Upload(el);

  if (el.closest('[data-modal="vacancy"]')) {
    el.closest('form').addEventListener('reset', () => {
      u.clear();
    });
  }
});
