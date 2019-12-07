/* eslint-disable */

const gulp = require('gulp');
const browserSync = require('browser-sync');
const devip = require('dev-ip');
const fileinclude = require('gulp-file-include');
const notify = require('gulp-notify');

const del = require('del');
const named = require('vinyl-named');
const rename = require('gulp-rename');

const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('autoprefixer');
const mmq = require('gulp-merge-media-queries');
const postcss = require('gulp-postcss');
const plumber = require('gulp-plumber');

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');

const svgstore = require('gulp-svgstore');
const svgo = require('gulp-svgo');

const context = require('./context');

const src = {
  js: 'src/js',
  html: 'src/html',
  sass: 'src/sass',
  css: 'src/css',
  sprite: 'src/sprite'
};

const jsSubfolders = [
  'components',
  'helpers',
  'init',
  'observer',
  'pages',
  'polyfill'
];

// Server
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      host: devip(),
      baseDir: 'src'
    },
    notify: false
  });
});

// HTML
gulp.task('html', () =>
  gulp
    .src([`${src.html}/pages/*.html`])
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: '@',
        basepath: '@file',
        context
      })
    )
    .pipe(gulp.dest('./src/'))
);

// JS
gulp.task('js', () =>
  gulp
    .src(`./${src.js}/pages/*.js`)
    .pipe(plumber())
    .pipe(named())
    .pipe(webpackStream(webpackConfig.dev, webpack))
    .pipe(gulp.dest(`./${src.js}`))
    .pipe(browserSync.reload({ stream: true }))
);

// JS Minify
gulp.task('js-min', () =>
  gulp
    .src(`./${src.js}/pages/*.js`)
    .pipe(plumber())
    .pipe(named())
    .pipe(webpackStream(webpackConfig.prod, webpack))
    .pipe(gulp.dest(`./${src.js}`))
    .pipe(browserSync.reload({ stream: true }))
);

// SASS
gulp.task('sass', () =>
  gulp
    .src(`${src.sass}/**/*.sass`)
    .pipe(
      sass({ outputStyle: 'expand', precision: 5 }).on(
        'error',
        notify.onError()
      )
    )
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(
      postcss([
        autoprefixer({
          browsers: ['last 3 versions'],
          cascade: false
        })
      ])
    )
    .pipe(
      mmq({
        log: true
      })
    )
    .pipe(cleanCSS())
    .pipe(gulp.dest(src.css))
    .pipe(browserSync.reload({ stream: true }))
);

// SVG Sprite
gulp.task('sprite', () => {
  return gulp
    .src(`${src.sprite}/i-*.svg`)
    .pipe(plumber())
    .pipe(
      svgo({
        plugins: [
          {
            removeAttrs: {
              attrs: ['width', 'height', 'fill', 'fill-rule', 'stroke', 'style']
            }
          }
        ]
      })
    )
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest(`${src.sprite}/`));
});

gulp.task('removedist', () => del.sync('dist'));

// Watcher
gulp.task('watch', ['html', 'js', 'sass', 'sprite', 'browser-sync'], () => {
  // Styles
  gulp.watch(`${src.sass}/**/*.sass`, ['sass']);

  // SVG
  gulp.watch(`${src.sprite}/i-*.svg`, ['sprite']);

  // JS
  jsSubfolders.forEach(subfolder => {
    gulp.watch([`${src.js}/${subfolder}/**/*.js`], ['js']);
  });

  // HTML
  gulp.watch(`${src.html}/**/*.html`, ['html']);
  gulp.watch('src/*.html', browserSync.reload);
});

// Build
gulp.task('build', ['removedist', 'html', 'sass', 'sprite', 'js-min'], () => {
  const buildFiles = gulp.src(['src/*.html']).pipe(gulp.dest('dist'));

  const buildFonts = gulp.src(['src/fonts/**/*']).pipe(gulp.dest('dist/fonts'));

  const buildCss = gulp
    .src([`${src.css}/main.min.css`])
    .pipe(gulp.dest('dist/css'));

  const buildJs = gulp.src([`${src.js}/*.js`]).pipe(gulp.dest('dist/js'));

  const buildImg = gulp.src(['src/img/**/*']).pipe(gulp.dest('dist/img'));
});

// Default task
gulp.task('default', ['watch']);
