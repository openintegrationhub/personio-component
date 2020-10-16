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

const Q = require("q");
const { newMessage } = require("../helpers");
const { getEntries } = require("../utils/helpers");
const { getToken } = require("../utils/authentication");
const { employeeToOih } = require("../transformations/EmployeeToOih");
const moment = require("moment");

/**
 * This method will be called from OIH platform providing following data
 *
 * @param msg - incoming message object that contains ``body`` with payload
 * @param cfg - configuration that is account information and configuration field values
 * @param snapshot - saves the current state of integration step for the future reference
 */
async function processTrigger(msg, cfg, snapshot = {}) {
  // Authenticate and get the token from Personio
  const { applicationUid, domainId, schema } = cfg;
  // const token = cfg.API_KEY;
  const token = await getToken(cfg);
  console.log("this is the trigger token!",token)
  const self = this;
  console.log(msg.body);

  // Set the snapshot if it is not provided
  snapshot.lastUpdated = snapshot.lastUpdated || moment(new Date(0));

  async function emitData() {
    /** Create an OIH meta object which is required
     * to make the Hub and Spoke architecture work properly
     */
    const oihMeta = {
      applicationUid:
        applicationUid !== undefined && applicationUid !== null
          ? applicationUid
          : undefined,
      schema: schema !== undefined && schema !== null ? schema : undefined,
      domainId:
        domainId !== undefined && domainId !== null ? domainId : undefined,
    };

    const employees = await getEntries(token, snapshot, "employees");

    console.error(`Found ${employees.result.length} new records.`);
    console.log("this is the snapshot i will pass", snapshot);

    console.log(`Found ${employees.result.length} new records.`);
    console.log("Passed");
    if (employees.result.length > 0) {
      employees.result.forEach((elem) => {
        const newElement = {};
        // Attach object uid to oihMeta object
        oihMeta.recordUid = elem.uid;
        delete elem.uid;
        newElement.meta = oihMeta;
        newElement.data = elem;
        // Emit the object with meta and data properties
        const transformedElement = transform(newElement, cfg, employeeToOih);
   
        self.emit("data", newMessage(transformedElement));
      });
      // Get the lastUpdate property from the last object and attach it to snapshot
      snapshot.lastUpdated = moment(
        employees.result[employees.result.length - 1].last_modified_at
      );
      console.error(`New snapshot: ${JSON.stringify(snapshot, undefined, 2)}`);
      self.emit("snapshot", snapshot);
    }
  }

  /**
   * This method will be called from OIH platform if an error occured
   *
   * @param e - object containg the error
   */
  function emitError(e) {
    console.log(`ERROR: ${e}`);
    self.emit("error", e);
  }

  /**
   * This method will be called from OIH platform
   * when the execution is finished successfully
   *
   */
  function emitEnd() {
    console.log("Finished execution");
    self.emit("end");
  }

  Q().then(emitData).fail(emitError).done(emitEnd);
}

module.exports = {
  process: processTrigger,
  getEntries,
};
