import Upload from '@/components/upload';

$.each('.js-upload', el => {
  const u = new Upload(el);
});
