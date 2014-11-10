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

  // transfers script to test site
  var scriptWatcher = gulp.watch('./test/public/javascripts/*.js');
  scriptWatcher.on('change', function(event) {
    gulp.src(event.path)
      .pipe(gulp.dest('./lib'));
  });

  // storage.js is in a separate repo
  var storagejsWatcher = gulp.watch('./lib/storage.js');
  storagejsWatcher.on('change', function(event) {
    gulp.src(event.path)
      .pipe(gulp.dest('../storage.js'));
  });
});
