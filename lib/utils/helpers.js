const request = require("request-promise").defaults({
  simple: false,
  resolveWithFullResponse: true,
});
const moment = require("moment");

const BASE_URI = "https://api.personio.de/v1";

/**
 * This method fetches persons or organizations from Personio
 *
 * @param options - request options
 * @param snapshot - current state of snapshot
 * @return {Object} - Array of person objects containing data and meta
 */
async function fetchAll(options, snapshot) {
  try {
    const result = [];
    const entries = await request.get(options);

    if (
      Object.entries(entries.body).length === 0 &&
      entries.body.constructor === Object
    ) {
      return false;
    }
    entries.body.data.forEach((employee) => {
      // Push only this objects which were updated after last function call
      if (
        moment(employee.attributes.last_modified_at).isAfter(
          snapshot.lastUpdated
        )
      ) {
        return result.push(employee);
      }
      return employee;
    });

    // Sort the objects by lastUpdate
    result.sort(
      (a, b) =>
        parseInt(a.attributes.last_modified_at, 10) -
        parseInt(b.attributes.last_modified_at, 10)
    );
    return {
      result,
    };
  } catch (e) {
    throw new Error(e);
  }
}

/**
 * @desc Prepares a DTO object for updating
 *
 * @access  Private
 * @param {Object} msg - the whole incoming object
 * @param {String} type - either 'person 'or 'organization'
 * @return {Object} - a new DTO object
 */
function prepareObject(msg, type) {
  let newObject;
  if (type === "employees") {
    newObject = {
      dto: {
        firstName: msg.firstName ? msg.firstName : "",
        lastName: msg.lastName ? msg.lastName : "",
        middleName: msg.middleName ? msg.middleName : "",
        salutation: msg.salutation ? msg.salutation : "",
        title: msg.title ? msg.title : "",
        birthday: msg.birthday ? msg.birthday : "",
        nickname: msg.nickname ? msg.nickname : "",
        jobTitle: msg.jobTitle ? msg.jobTitle : "",
        gender: msg.gender ? msg.gender : "",
      },
    };
  } else {
    newObject = {
      dto: {
        name: msg.name ? msg.name : "",
        logo: msg.logo ? msg.logo : "",
      },
    };
  }
  return newObject;
}

/**
 * @desc Upsert function which creates or updates
 * an object, depending on certain conditions
 *
 * @access  Private
 * @param {Object} msg - the whole incoming object
 * @param {String} token - token from Personio
 * @param {Boolean} objectExists - ig the object was found
 * @param {String} type - object type - 'person' or 'organization'
 * @param {Object} meta -  meta object containg meta inforamtion
 * @return {Object} - the new created ot update object in Personio
 */
async function upsertObject(msg, token, objectExists, type, meta, cfg) {
  if (!type) {
    return false;
  }

  let newObject;
  let uri;
  let method;

  if (objectExists) {
    // Update the object if it already exists
    method = "PUT";
    uri = `${BASE_URI}/${cfg.company_domain}/${type}/${meta.recordUid}`;
    newObject = prepareObject(msg, type);
    delete newObject.uid;
  } else {
    // Create the object if it does not exist
    method = "POST";
    uri = `${BASE_URI}/${cfg.company_domain}/${type}`;
    newObject = msg;
    delete newObject.uid;
    delete newObject.categories;
    delete newObject.relations;
  }

  try {
    const options = {
      method,
      uri,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: newObject,
    };

    const person = await request(options);
    return person;
  } catch (e) {
    return e;
  }
}
async function createObject(msg, token, type, meta, cfg) {
  if (!type) {
    return false;
  }

  let newObject;
  let uri;
  let method;

  // Create the object if it does not exist
  method = "POST";
  uri = `${BASE_URI}/${cfg.company_domain}/${type}`;
  newObject = msg;
  delete newObject.uid;
  delete newObject.categories;
  delete newObject.relations;

  try {
    const options = {
      method,
      uri,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: newObject,
    };

    const person = await request(options);
    return person;
  } catch (e) {
    return e;
  }
}

/**
 * This method fetches objects from Personio
 * depending on the value of count variable and type
 *
 * @param token - Personio token required for authentication
 * @param snapshot - current state of snapshot
 * @param count - amount of objects
 * @return {Object} - Array of person objects containing data and meta
 */
async function getEntries(token, snapshot, type, cfg) {
  let uri;
  // if (count) {
  //   uri = `${BASE_URI}/${type}?num=${count}`;
  // } else {
  //   uri = `${BASE_URI}/${type}`;
  // }
  uri = `${BASE_URI}/${cfg.company_domain}/${type}`;
  try {
    const requestOptions = {
      uri,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const entries = await fetchAll(requestOptions, snapshot);

    if (!entries.result || !Array.isArray(entries.result)) {
      return "Expected records array.";
    }
    return entries;
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = { getEntries, upsertObject, createObject };
