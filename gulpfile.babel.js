import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';
import image from 'gulp-image';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import miniCSS from 'gulp-csso';
import bro from 'gulp-bro';
import babelify from 'babelify';
import ghPages from 'gulp-gh-pages';

sass.compiler = require('node-sass');

const routes = {
    pug: {
        watch: 'src/**/*.pug',
        src: 'src/*.pug',
        dest: 'build',
    },
    img: {
        src: 'src/img/*',
        dest: 'build/img',
    },
    scss: {
        watch: 'src/scss/**/*.scss',
        src: 'src/scss/style.scss',
        dest: 'build/css',
    },
    js: {
        watch: 'src/js/**/*.js',
        src: 'src/js/main.js',
        dest: 'build/js',
    },
};

// src => pipe => dest
const pug = () => gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(['build/', '.publish']);

const devServer = () => gulp.src('build').pipe(ws({ livereload: true, open: true }));

const img = () => gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
    gulp
        .src(routes.scss.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 2 versions'],
            }),
        )
        .pipe(miniCSS())
        .pipe(gulp.dest(routes.scss.dest));

const js = () =>
    gulp
        .src(routes.js.src)
        .pipe(
            bro({
                transform: [
                    babelify.configure({ presets: ['@babel/preset-env'] }, [
                        'uglifyify',
                        { global: true },
                    ]),
                ],
            }),
        )
        .pipe(gulp.dest(routes.js.dest));

const gh = () => gulp.src('build/**/*').pipe(ghPages());

// 파일의 변동사항을 watch
const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    // 이미지는 최적화에 시간이 소요되므로 watch에 포함할지는 신중히 결정
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.scss.watch, styles);
    gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, styles, js]);
// parallel => 작업을 동시에
const live = gulp.parallel([devServer, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, gh, clean]);
