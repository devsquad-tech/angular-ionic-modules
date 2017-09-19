#!/usr/bin/env node

const { spawn } = require('child_process');

const Run = {
  build: () => {
    let buildParams = ['exec'];
    if (packagesNpm) {
      buildParams.push('--scope');
      buildParams = buildParams.concat(packagesNpm);
    }

    buildParams.push('--');
    buildParams.push('ngc');

    const build = spawn('lerna', buildParams, { stdio: 'inherit' });

    return new Promise((resolve, reject) => {
      build.on('close', (code) => {
        if (code) {
          console.log('Error');
          reject();
        }
        resolve();
      });
    });
  },

  canary: () => {
    Run.build().then(() => {
      let argvsCanary = [
        'publish',
        '--canary',
        '--exact',
        '--yes',
        '--npm-tag=canary',
        '--skip-git'
      ];

      if (packagesNpm) {
        argvsCanary.push('--scope');
        argvsCanary = argvsCanary.concat(packagesNpm);
      }

      const canary = spawn('lerna', argvsCanary, { stdio: 'inherit' });

      canary.stdout.on('data', (data) => {
        console.log(`${data}`);
      });

      canary.on('close', (code) => {
        if (code) {
          console.log('Error');
        }
      });
    });
  },

  publish: () => {
    Run.build().then(() => {
      let argvsPublish = [
        'publish',
        '--exact',
        '--conventional-commits',
        '-m',
        'chore(*): Publish'
      ];

      if (packagesNpm) {
        argvsPublish.push('--scope');
        argvsPublish = argvsPublish.concat(packagesNpm);
      }

      const publish = spawn('lerna', argvsPublish, { stdio: 'inherit' });

      publish.stdout.on('data', (data) => {
        console.log(`${data}`);
      });

      publish.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      publish.on('close', (code) => {
        if (code) {
          console.log('Error');
        }
      });
    });
  },

  buildTest: () => {
    let argvsTest = ['exec'];

    if (packagesNpm) {
      argvsTest.push('--scope');
      argvsTest = argvsTest.concat(packagesNpm);
    }

    argvsTest = argvsTest.concat(['--', 'ngc', '-p', 'tsconfig-test.json']);

    return new Promise((resolve, reject) => {
      const test = spawn('lerna', argvsTest, { stdio: 'inherit' });
      test.on('close', (code) => {

        if (code) {
          console.log('Error');
          reject();
        }
        resolve();
      });

    });
  },

  test: () => {
    Run.buildTest().then(() => {
      const args = ['start', './scripts/karma/karma.conf.js'];
      // assign packages karma test runner
      if (packages) {
        args.push('--packages');
        args.push(packages);
      }

      const karma = spawn('karma', args, { stdio: 'inherit' });
    });
  }
};

const argvJson = JSON.parse(process.env.npm_config_argv);
let packages = argvJson.original[2];
let packagesNpm;
let packagesBasename;

if (packages) {
  packagesBasename = packages.split(',');
  packagesNpm = packagesBasename.map((value) => {
    return `@devsquad/${value}`;
  });
}

if (argvJson.original) {
  const method = process.argv[2].replace(/-/g, '');
  Run[method]();
}
