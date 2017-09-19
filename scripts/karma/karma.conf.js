module.exports = function(config) {

  const preProcessors = {
    'scripts/karma/karma-test-shim.js': [ 'browserify' ],
  };

  const files = [
    { pattern: 'scripts/karma/karma-test-shim.js', watched: true }
  ];

  if (!config.packages) {
    preProcessors['packages/**/dist/test/*spec.js'] = [ 'browserify' ];
    files.push({ pattern: 'packages/**/dist/test/*spec.js', included: true, watched: false });
  } else {
    const packages = config.packages.split(',');
    console.log('Testing packages: ', config.packages);
    for (const package of packages) {
      preProcessors[`packages/${package}/dist/test/*spec.js`] = [ 'browserify' ];
      files.push({ pattern: `packages/${package}/dist/test/*spec.js`, included: true, watched: false });
    }
  }

  const _config = {
    basePath: '../..',

    frameworks: ['browserify', 'jasmine'],

    files: files,

    preprocessors: preProcessors,

    browserify: {
      debug: true,
      extensions: ['.js']
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    reporters: ['spec'],
    singleRun: false,
    browsers: ['Chrome']
  };

  config.set(_config);
};
