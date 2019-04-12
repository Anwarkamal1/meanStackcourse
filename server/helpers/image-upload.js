const multer = require('multer');
const fileFilter = (req, file, cb) => {
  // console.log(file);
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets');
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(
      null,
      new Date()
        .toISOString()
        .split(':')
        .join() +
        Math.random(1000000) +
        '-' +
        file.originalname
    );
  }
});
app.use('/assets', express.static(path.join(rootDir, 'assets')));
console.log(path.join(rootDir, 'assets'));
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter
  }).single('image')
);
