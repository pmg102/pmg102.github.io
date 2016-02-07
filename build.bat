browserify -t babelify src\\js\\index.js -o dist\\js\\index.js
start /b watchify -t babelify src\\js\\index.js -o dist\\js\\index.js
cd dist
python -m http.server