/* eslint no-param-reassign: "off" */

/**
 * Copyright 2019 OIH
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

const Q = require('q');
const { transform } = require('@openintegrationhub/ferryman');
// const { resolve } = require('../utils/resolver');
const { getEntry, upsertObject } = require('../utils/helpers');
const { getToken } = require('../utils/authentication');
const { employeeFromOih } = require('../transformations/EmployeeFromOih');

/**
 * This method will be called from OIH platform providing following data
 *
 * @param {Object} msg - incoming message object that contains ``body`` with payload
 * @param {Object} cfg - configuration that is account information and configuration field values
 */
async function processAction(msg, cfg, snapshot = {}) {
  // const token = cfg.API_KEY;

  let token;
  if (snapshot && snapshot.authToken) {
    token = snapshot.authToken;
  } else {
    token = await getToken(cfg);
    snapshot = {};
  }

  const self = this;
  const transformedMessage = transform(msg, cfg, employeeFromOih);

  async function emitData() {
    /** Create an OIH meta object which is required
     * to make the Hub and Spoke architecture work properly
     */

    let objectExists = false;
    const employeeObject = transformedMessage.data;

    if (msg.metadata.recordUid) {
      const entry = getEntry(token, msg.metadata.recordUid, 'employees');
      if (entry && entry.data) objectExists = true;
    }

    if (cfg.devMode) {
      console.log('About to upsert');
      console.log(objectExists);
      console.log(JSON.stringify(employeeObject));
    }

    // Upsert the object depending on 'objectExists' property
    const reply = await upsertObject(
      employeeObject,
      token,
      objectExists,
      'employees',
      msg.metadata,
      cfg,
    );

    if (reply.body.success) {
      const record = {
        metadata: {
          recordUid: reply.body.data.id,
          oihUid: msg.metadata ? msg.metadata.oihUid : null,
        },
      };
      self.emit('data', record);

      if (reply.headers.authorization) {
        snapshot.authToken = reply.headers.authorization.replace('Bearer').trim();
        console.log(`Received token:${snapshot.authToken}`);
      }
    } else if (cfg.devMode) {
      console.log('Upsert failed!');
      console.log(reply.statusCode);
      console.log(JSON.stringify(reply.body));
      if (snapshot.authToken) delete snapshot.authToken;
    }

    console.error(`New token snapshot: ${JSON.stringify(snapshot, undefined, 2)}`);
    self.emit('snapshot', snapshot);
  }

  /**
   * This method will be called from OIH platform if an error occured
   *
   * @param e - object containg the error
   */
  function emitError(e) {
    console.error('ERROR: ', e);
    console.log('Oops! Error occurred');
    self.emit('error', e);
  }

  /**
   * This method will be called from OIH platform
   * when the execution is finished successfully
   *
   */
  function emitEnd() {
    console.log('Finished execution');
    self.emit('end');
  }

  Q().then(emitData).fail(emitError).done(emitEnd);
}

module.exports = {
  process: processAction,
};
