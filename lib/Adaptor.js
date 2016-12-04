'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastReferenceValue = exports.dataValue = exports.dataPath = exports.each = exports.merge = exports.sourceValue = exports.fields = exports.field = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.execute = execute;
exports.submitSite = submitSite;

var _languageCommon = require('language-common');

Object.defineProperty(exports, 'field', {
  enumerable: true,
  get: function get() {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, 'fields', {
  enumerable: true,
  get: function get() {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, 'sourceValue', {
  enumerable: true,
  get: function get() {
    return _languageCommon.sourceValue;
  }
});
Object.defineProperty(exports, 'merge', {
  enumerable: true,
  get: function get() {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, 'each', {
  enumerable: true,
  get: function get() {
    return _languageCommon.each;
  }
});
Object.defineProperty(exports, 'dataPath', {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, 'dataValue', {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, 'lastReferenceValue', {
  enumerable: true,
  get: function get() {
    return _languageCommon.lastReferenceValue;
  }
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _url = require('url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @module Adaptor */

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for resourcemap.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @constructor
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */
function execute() {
  for (var _len = arguments.length, operations = Array(_len), _key = 0; _key < _len; _key++) {
    operations[_key] = arguments[_key];
  }

  var initialState = {
    references: [],
    data: null
  };

  return function (state) {
    return _languageCommon.execute.apply(undefined, operations)(_extends({}, initialState, state));
  };
}

/**
 * Create an event
 * @example
 * execute(
 *   event(eventData)
 * )(state)
 * @constructor
 * @param {object} eventData - Payload data for the event
 * @returns {Operation}
 */
function submitSite(collection_id, submissionData) {

  function assembleError(_ref) {
    var response = _ref.response;
    var error = _ref.error;

    if ([200, 201, 202].indexOf(response.statusCode) > -1) return false;
    if (error) return error;
    return new Error('Server responded with ' + response.statusCode + ' \n ' + response.body);
  }

  return function (state) {

    var body = (0, _languageCommon.expandReferences)(submissionData)(state);
    console.log("Submitting site to collection " + collection_id + ":" + "\n" + JSON.stringify(body, null, 4));

    var _state$configuration = state.configuration;
    var username = _state$configuration.username;
    var password = _state$configuration.password;
    var baseUrl = _state$configuration.baseUrl;

    // /api/collections/:collection_id/sites.json

    var url = (0, _url.resolve)(baseUrl + '/', 'api/collections/' + collection_id + "/sites.json");

    return new Promise(function (resolve, reject) {
      _request2.default.post({
        url: url,
        json: body,
        auth: {
          'user': username,
          'pass': password,
          'sendImmediately': true
        }
      }, function (error, response, body) {
        error = assembleError({ error: error, response: response });
        if (error) {
          reject(error);
        } else {
          console.log("Printing response...\n");
          console.log(JSON.stringify(response, null, 4) + "\n");
          console.log("Site submission succeeded.");
          resolve(body);
        }
      });
    });

    return _request2.default.post({
      username: username,
      password: password,
      body: body,
      url: url
    });
  };
}
