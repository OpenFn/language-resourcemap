'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastReferenceValue = exports.dataValue = exports.dataPath = exports.each = exports.merge = exports.sourceValue = exports.fields = exports.field = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.execute = execute;
exports.event = event;
exports.dataValueSet = dataValueSet;
exports.dataElement = dataElement;
exports.createTEI = createTEI;
exports.updateTEI = updateTEI;
exports.enroll = enroll;

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

var _Client = require('./Client');

var _url = require('url');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/** @module Adaptor */

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for DHIS2.
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
function event(eventData) {

  return function (state) {
    var body = (0, _languageCommon.expandReferences)(eventData)(state);

    var _state$configuration = state.configuration;
    var username = _state$configuration.username;
    var password = _state$configuration.password;
    var apiUrl = _state$configuration.apiUrl;


    var url = (0, _url.resolve)(apiUrl + '/', 'api/events');

    console.log("Posting event:");
    console.log(body);

    return (0, _Client.post)({
      username: username,
      password: password,
      body: body,
      url: url
    }).then(function (result) {
      console.log("Success:", result);
      return _extends({}, state, {
        references: [result].concat(_toConsumableArray(state.references))
      });
    });
  };
}

/**
 * Send data values using the dataValueSets resource
 * @example
 * execute(
 *   dataValueSet(data)
 * )(state)
 * @constructor
 * @param {object} data - Payload data for the data value set
 * @returns {Operation}
 */
function dataValueSet(data) {

  return function (state) {
    var body = (0, _languageCommon.expandReferences)(data)(state);

    var _state$configuration2 = state.configuration;
    var username = _state$configuration2.username;
    var password = _state$configuration2.password;
    var apiUrl = _state$configuration2.apiUrl;


    var url = (0, _url.resolve)(apiUrl + '/', 'api/dataValueSets');

    console.log("Posting data value set:");
    console.log(body);

    return (0, _Client.post)({
      username: username,
      password: password,
      body: body,
      url: url
    }).then(function (result) {
      console.log("Success:", result);
      return _extends({}, state, {
        references: [result].concat(_toConsumableArray(state.references))
      });
    });
  };
}

/**
 * Create a "dataElement" pairing for DHIS2.
 * @example
 * execute(
 *   dataElement(key, value)
 * )(state)
 * @constructor
 * @param {object} key - Payload data for the Data Element key
 * @param {object} value - Payload data for the Data Element value
 * @returns {Operation}
 */
function dataElement(key, value) {
  return {
    "dataElement": key,
    "value": value
  };
}

/**
 * Create one or many new Tracked Entity Instances
 * @example
 * execute(
 *   createTEI(data)
 * )(state)
 * @constructor
 * @param {object} data - Payload data for new tracked entity instance(s)
 * @returns {Operation}
 */
function createTEI(data) {

  return function (state) {

    var body = (0, _languageCommon.expandReferences)(data)(state);

    var _state$configuration3 = state.configuration;
    var username = _state$configuration3.username;
    var password = _state$configuration3.password;
    var apiUrl = _state$configuration3.apiUrl;


    var url = (0, _url.resolve)(apiUrl + '/', 'api/trackedEntityInstances');

    console.log("Posting tracked entity instance data:");
    console.log(body);

    return (0, _Client.post)({
      username: username,
      password: password,
      body: body,
      url: url
    }).then(function (result) {
      console.log("Success:", result);
      return _extends({}, state, {
        references: [result].concat(_toConsumableArray(state.references))
      });
    });
  };
}

/**
 * Update existing Tracked Entity Instances
 * @example
 * execute(
 *   updateTEI(tei, data)
 * )(state)
 * @constructor
 * @param {object} tei - Payload data for the TEI to be updated
 * @param {object} data - Payload data for updating a TEI
 * @returns {Operation}
 */
function updateTEI(tei, data) {

  return function (state) {
    var body = (0, _languageCommon.expandReferences)(data)(state);

    var _state$configuration4 = state.configuration;
    var username = _state$configuration4.username;
    var password = _state$configuration4.password;
    var apiUrl = _state$configuration4.apiUrl;


    var url = apiUrl.concat('/api/trackedEntityInstances/' + tei);

    console.log('Updating tracked entity instance ' + tei + ' with data:');
    console.log(body);

    return (0, _Client.put)({
      username: username,
      password: password,
      body: body,
      url: url
    }).then(function (result) {
      console.log("Success:", result);
      return _extends({}, state, {
        references: [result].concat(_toConsumableArray(state.references))
      });
    });
  };
}

// /**
//  * Create and enroll TrackedEntityInstances
//  * @example
//  * execute(
//  *   createEnrollTEI(te, orgUnit, attributes, enrollments)
//  * )(state)
//  * @constructor
//  * @param {object} enrollmentData - Payload data for new enrollment
//  * @returns {Operation}
//  */
// export function upsertEnroll(upsertData) {
//
//   return state => {
//     const body = expandReferences(trackedEntityInstanceData)(state);
//
//     const { username, password, apiUrl } = state.configuration;
//
//     const url = resolveUrl(apiUrl + '/', 'api/trackedEntityInstances')
//
//     console.log("Posting tracked entity instance data:");
//     console.log(body)
//
//     return post({ username, password, body, url })
//     .then((result) => {
//       console.log("Success:", result);
//       return { ...state, references: [ result, ...state.references ] }
//     })
//
//   }
// }

/**
 * Enroll a tracked entity instance in a program
 * @example
 * execute(
 *   enroll(enrollmentData)
 * )(state)
 * @constructor
 * @param {object} enrollmentData - Payload data for new enrollment
 * @returns {Operation}
 */
function enroll(tei, enrollmentData) {

  return function (state) {
    var body = (0, _languageCommon.expandReferences)(enrollmentData)(state);
    body["trackedEntityInstance"] = tei;

    var _state$configuration5 = state.configuration;
    var username = _state$configuration5.username;
    var password = _state$configuration5.password;
    var apiUrl = _state$configuration5.apiUrl;


    var url = (0, _url.resolve)(apiUrl + '/', 'api/enrollments');

    console.log("Enrolling tracked entity instance with data:");
    console.log(body);

    return (0, _Client.post)({
      username: username,
      password: password,
      body: body,
      url: url
    }).then(function (result) {
      console.log("Success:", result);
      return _extends({}, state, {
        references: [result].concat(_toConsumableArray(state.references))
      });
    });
  };
}