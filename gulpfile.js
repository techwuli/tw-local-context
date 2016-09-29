var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    gulpUglify = require('gulp-uglify'),
    gulpRename = require('gulp-rename'),
    runSequence = require('run-sequence');

gulp.task('js', function() {
    return gulp.src('src/tw-local-context.js')
        .pipe(gulp.dest('dist/'));
});

gulp.task('js_min', function() {
    return gulp.src('src/tw-local-context.js')
        .pipe(gulpUglify())
        .pipe(gulpRename('tw-local-context.min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('serve', function() {
    gulp.watch('src/tw-local-context.js', ['js', 'js_min']);
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: '/example',
        files: [
            'dist/**/*',
            'example/**/*'
        ]
    });
});

gulp.task('serve-sync', ['js', 'js_min', 'serve']);
