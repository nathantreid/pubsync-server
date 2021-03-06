var gulp = require('gulp'),
    clean = require('gulp-clean'),
    rimraf = require('rimraf'),
    rjs = require('requirejs');

var srcPath = '../src';
var destPath = '../dist';
gulp.task('default', ['compile', 'copy_modules', 'copy_package'], function () {

});

gulp.task('clean', function () {
    return gulp.src(destPath + '/*', {
        read: false
    })
        .pipe(clean({force: true}));
});

gulp.task('copy_modules', ['clean'], function () {
    gulp.src(srcPath + '/node_modules/**/*')
        .pipe(gulp.dest(destPath + '/node_modules'));
});

gulp.task('copy_package', ['clean'], function () {
    gulp.src([
                srcPath + '/package.json',
                srcPath + '/install-service.js',
                srcPath + '/install-service.cmd',
                srcPath + '/uninstall-service.js',
                srcPath + '/uninstall-service.cmd'
        ],
        {base: srcPath + '/' })
        .pipe(gulp.dest(destPath + '/'));
});

gulp.task('compile', ['clean'], function (cb) {
    rjs.optimize({
        baseUrl: srcPath + "/app",
        name: "main",
        out: destPath + "/pubsync-server.js",
        mainConfigFile: srcPath + '/app/main.js',
        fileExclusionRegExp: /(^\.)|(node_modules)/,
        paths: {
            'when': 'empty:',
            'fs': 'empty:',
            'path': 'empty:',
            'express': 'empty:',
            'body-parser': 'empty:',
            'fs-extra': 'empty:',
            'mkdirp': 'empty:',
            'util': 'empty:',
            'crypto': 'empty:',
            'zlib': 'empty:',
            'uuid-lib': 'empty:'
        },
        wrap: {
            start: '(function() {'
                + '\nvar requirejs = require(\'requirejs\');'
                + '\nvar define = requirejs.define;\n\n',
            end: '}());'
        },
        optimize: 'none'
    }, function () {
        cb();
    }, cb);
});
