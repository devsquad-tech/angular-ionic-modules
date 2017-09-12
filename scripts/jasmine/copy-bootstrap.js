const fs = require('fs');
const path = require('path');

let dirs = fs.readdirSync(path.resolve('packages'));

dirs = dirs.filter((value) => value !== '.DS_Store');

for (const dir of dirs) {
  fs.createReadStream(path.resolve('scripts/karma/karma-test-shim.ts'))
   .pipe(fs.createWriteStream(path.resolve(`packages/${dir}/test/bootstrap.ts`)));
}
