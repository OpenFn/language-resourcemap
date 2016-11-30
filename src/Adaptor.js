import { execute as commonExecute, expandReferences } from 'language-common';
import request from 'request'
import { resolve as resolveUrl } from 'url';

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
export function execute(...operations) {
  const initialState = {
    references: [],
    data: null
  }

  return state => {
    return commonExecute(...operations)({...initialState,
      ...state
    })
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
export function submitSite(siteData) {

  return state => {
    const body = expandReferences(siteData)(state);

    const collection_id = body.collection_id

    const {
      username,
      password,
      hostUrl
    } = state.configuration;

    // /api/collections/:collection_id/sites.json
    const url = resolveUrl(hostUrl + '/', 'api/collections/' + collection_id + "/sites.json")

    console.log("Submitting site:");
    console.log(body)

    return request.post({
        username,
        password,
        body,
        url
      })
      .then((result) => {
        console.log("Success:", result);
        return {...state,
          references: [result, ...state.references]
        }
      })

  }
}

export {
  field,
  fields,
  sourceValue,
  merge,
  each,
  dataPath,
  dataValue,
  lastReferenceValue
}
from 'language-common';
