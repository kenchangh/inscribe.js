var gulp = require('gulp');
var server = require('gulp-express');

gulp.task('default', function() {});

gulp.task('server', function() {
  // start the server at beginning of task
  function runServer() {
    server.run({
      file: './test/bin/www',
    });
  }
  runServer();

  // server.notify reloads at browser
  // server.run restarts server
  gulp.watch('./test/views/*.jade', server.notify);
  gulp.watch('./test/routes/*.js', runServer);
  gulp.watch('./test/public/javascripts/*.js', runServer);
  gulp.watch('./test/app.js', runServer);
});