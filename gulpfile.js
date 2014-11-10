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

  // restart server on file changes
  gulp.watch('./test/views/*.jade', runServer);
  gulp.watch('./test/routes/*.js', runServer);
  gulp.watch('./test/app.js', runServer);

  // transfers script to test site
  var scriptWatcher = gulp.watch('./lib/*.js');
  scriptWatcher.on('change', function(event) {
    gulp.src(event.path)
      .pipe(gulp.dest('./test/public/javascripts'));
  });
});
