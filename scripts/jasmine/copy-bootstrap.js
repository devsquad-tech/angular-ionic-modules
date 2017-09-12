var fs = require('fs');
var path = require('path');

fs.createReadStream(path.resolve('scripts/karma/karma-test-shim.ts'))
  .pipe(fs.createWriteStream(path.resolve('packages/config/test/bootstrap.ts')));
