#!/usr/bin/env node

const { spawn } = require('child_process');

const Run = {
  build: () => {
    let buildParams = ['exec'];
    if (packages) {
      buildParams.push('--scope');
      buildParams = buildParams.concat(packages);
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

      if (packages) {
        argvsCanary.push('--scope');
        argvsCanary = argvsCanary.concat(packages);
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

      if (packages) {
        argvsPublish.push('--scope');
        argvsPublish = argvsPublish.concat(packages);
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

  test: () => {
    let argvsTest = ['exec'];

    if (packages) {
      argvsTest.push('--scope');
      argvsTest = argvsPublish.concat(packages);
    }

    argvsTest = argvsTest.concat(['--', 'ngc', '-p', 'tsconfig-test.json']);

    const test = spawn('lerna', argvsTest, { stdio: 'inherit' });

    test.on('close', (code) => {
      if (code) {
        console.log('Error');
      }
    });
  }
};

const argvJson = JSON.parse(process.env.npm_config_argv);
let packages = argvJson.original[2];

if (packages) {
  packages = packages.split(',');
  packages = packages.map((value) => {
    return `@devsquad/${value}`;
  });
}

if (argvJson.original) {
  const method = process.argv[2].replace(/-/g, '');
  Run[method]();
}
