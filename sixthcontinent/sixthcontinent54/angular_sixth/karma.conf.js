// Karma configuration
// Generated on Fri Mar 27 2015 14:32:57 GMT+0530 (IST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        "app/js/lib/jquery1.10.2-min.js",
        "https://ajax.googleapis.com/ajax/libs/angularjs/1.2.7/angular.min.js",
        "https://ajax.googleapis.com/ajax/libs/angularjs/1.2.7/angular-mocks.js",
        "https://ajax.googleapis.com/ajax/libs/angularjs/1.2.7/angular-route.min.js",
        "app/js/lib/angular-file-upload.js",
        "https://ajax.googleapis.com/ajax/libs/angularjs/1.2.7/angular-cookies.min.js",
        "app/js/lib/angular-cookie.min.js",
        "app/js/lib/ng-infinite-scroll.min.js",
        "app/js/lib/angular-socialshare.js",
        "app/js/lib/angular-translate.min.js",
        "app/js/lib/ng-infinite-scroll.min.js",
        "app/js/lib/jquery.base64.js",
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDeqRWFvUUQRWS13INCtVVqOxrKWzNQOus&v=3.exp&libraries=places,geometry",
        "app/js/lib/lodash.underscore.js",
        "app/js/lib/angular-google-maps.js",
        "app/js/lib/ui-bootstrap-tpls-0.9.0.js",
        "app/js/lib/scroll/angular-perfect-scrollbar.js",
        "app/js/lib/ngDialog.min.js",  
        "config_dev.js",
        "app.js",
        "app/js/controllers/*.js",
        "app/js/lib/*.js",
        "app/js/conf/*.js",
        "app/js/controllers/profile.js",
        "app/js/controllers/shop_wallet.js",
        "app/js/controllers/verify.js",
        "app/js/controllers/offer.js",
        'app/js/services/*.js',
        'app/js/directives/*.js',
        'app/js/factories/*.js',
        'test/js/controllers/*.*.js',
        'test/mock/*.json'
    ],

    // list of files to exclude
    exclude: [
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        "app/js/controllers/*.js": ['coverage'],
        "app/js/services/*.js" : ['coverage'],
        "app.js" : ['coverage']
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    coverageReporter: {
        // specify a common output directory
        dir: 'build/reports/coverage',
        reporters: [
        // reporters not supporting the `file` property
        { type: 'html', subdir: 'report-html' },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: 'text', subdir: '.', file: 'text.txt' },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
        ]
   }
  });
};
