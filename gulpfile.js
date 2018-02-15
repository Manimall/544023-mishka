"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var run = require("run-sequence");
var del = require("del");
var svgSprite = require('gulp-svg-sprites'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace');
var browserSync = require('browser-sync');
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
// var htmlmin = require("gulp-htmlmin");


// Сервер и автообновление страницы Browsersync
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "source"
    },
    notify: false,
    // tunnel: true,
    // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
  });
});

gulp.task("style", function() {
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html", ["html"]).on("change", server.reload);
});

gulp.task("watch", ['browser-sync'], function() {
  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/js/**/*.js", ["js"]);
  gulp.watch("source/*.html", ["html"]).on("change", server.reload);
});

/* Сборка SVG спрайта */
gulp.task("sprite", function() {
  return gulp.src("source/img/inSprite-icons/**/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img"));
});

gulp.task("minsprite", function() {
  return gulp.src("source/img/inSprite-icons/**/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("true-sprite.svg"))
    .pipe(gulp.dest("source/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

/* Проверяет, объединяет, минифицирует JS для build версии */
gulp.task("scripts", function() {
  return gulp.src("source/js/*.js")
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"))
    .pipe(concat("scripts.js"))
    .pipe(uglify())
    .pipe(rename("min.scripts.js"))
    .pipe(gulp.dest("build/js"));
});

gulp.task("build", function (done) {
  run("clean", "copy", "style", "scripts", "images", "webp", "sprite", "html", done);
});

gulp.task("copy", function () {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
      "source/js/**"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task('svgSpriteBuild', function () {
  return gulp.src(assetsDir + 'source/img/**/*.svg')
    // minify svg
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    // remove all fill and style declarations in out shapes
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
    // cheerio plugin create unnecessary string '>', so replace it.
    .pipe(replace('&gt;', '>'))
    // build svg sprite
    .pipe(svgSprite({
        mode: "symbols",
        preview: false,
        selector: "icon-%f",
        svg: {
          symbols: 'symbol_sprite.html'
        }
      }
    ))
    .pipe(gulp.dest(assetsDir + 'build/img'));
});

gulp.task("mysprite", function () {
  return gulp.src("source/img/inSprite-icons/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    // remove all fill and style declarations in out shapes
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
    // cheerio plugin create unnecessary string '>', so replace it.
    .pipe(replace("&gt;", ">"))
    .pipe(rename("newsprite.svg"))
    .pipe(gulp.dest("build/img"));
})

// /* Минифицирует HTML файлы в папке build*/
// gulp.task("minhtml", function() {
//   return gulp.src("build/*.html")
//     .pipe(htmlmin({collapseWhitespace: true}))
//     .pipe(gulp.dest("build"));
// });
