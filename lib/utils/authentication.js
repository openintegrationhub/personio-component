/**
 * Copyright 2019 Wice GmbH

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

// const request = require('request-promise');
const axios = require('axios');
// let uri = "";

/**
 * This method will authenticate the user in Personio
 * and return a Bearer token if it is successful
 *
 * @param {Object} config - incoming message object that contains username and password
 * @return {String} - Bearer token
 */
// eslint-disable-next-line consistent-return
async function getToken(config) {
  // let url = `https://api.personio.de/v1/auth?client_id=${config.client_id}&client_secret=${config.client_secret}`;
  // const options = {
  //   url
  //   // json: true,
  //   // body: {
  //   //   email: config.email,
  //   //   password: config.password,
  //   // },
  //   // params: {
  //   //   client_id: config.client_id,
  //   //   client_secret: config.client_secret,
  //   // },
  // };
  // console.log(options);

  try {
    const tokenRequest = await axios.post(`https://api.personio.de/v1/auth?client_id=${config.client_id}&client_secret=${config.client_secret}`);
    console.log('this is the request:', tokenRequest.data);
    if (tokenRequest.data.success === true) {
      const { token } = tokenRequest.data.data;
      console.log(token);
      return token;
    }
    // return token;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getToken,
};
