// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
const karmaPort = Math.floor(Math.random() * 30000) + 15000;

module.exports = function(config) {
  config.set({
    autoWatch: false,
    basePath: '',
    browserNoActivityTimeout: 60000,
    browsers: ['Chrome'],
    logLevel: config.LOG_DEBUG,
    singleRun: false,
    client: {
      captureconsole: true,
      clearContext: false
    },
    colors: true,
    concurrency: Infinity,
    files: [],
    frameworks: [
      'jasmine',
      '@angular-devkit/build-angular'
    ],
    logLevel: config.LOG_INFO,
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    mochaReporter: {
      ignoreSkipped: true
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-remap-istanbul'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-mocha-reporter')
    ],
    port: karmaPort,
    preprocessors: {},
    remapIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reports: {
        html: 'coverage',
        lcovonly: './coverage/coverage.lcov'
      }
    },
    reporters: ['mocha'],
    reporters_cli: config.angularCli && config.angularCli.codeCoverage
      ? ['progress', 'karma-remap-istanbul']
      : ['progress']
  });
};
