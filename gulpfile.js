var gulp = require('gulp');
var server = require('gulp-express');

var paths = {
  jade: './demo/views/*.jade',
  js: './demo/**/*.js',
  inscribe: './demo/public/javascripts/inscribe.js'
};

gulp.task('server', function() {
  // start the server at beginning of task
  function runServer() {
    server.run({
      file: './demo/bin/www',
    });
  }
  runServer();

  // server.notify reloads at browser
  // server.run restarts server
  gulp.watch(paths.jade, server.notify);
  gulp.watch(paths.js, runServer);
});

gulp.task('move inscribe', function() {
  gulp.src(paths.inscribe)
    .pipe(gulp.dest('./lib'));
});

gulp.task('default', ['server'], function() {
  gulp.watch(paths.inscribe, ['move inscribe']);
});

