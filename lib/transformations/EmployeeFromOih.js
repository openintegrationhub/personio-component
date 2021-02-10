/* eslint consistent-return: "off" */
/* eslint max-len: 'off' */

/**
 * Copyright 2018 Wice GmbH

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

/* eslint no-invalid-this: 0 no-console: 0 */

// New implementation
module.exports.employeeFromOih = (msg) => {
  // if (Object.keys(msg.body).length === 0 && msg.body.constructor === Object) {
  //   return msg.body;
  // }

  let email = '';
  let phone = '';
  if (msg.data.contactData && msg.data.contactData.length > 0) {
    const { length } = msg.data.contactData;
    for (let i = 0; i < length; i += 1) {
      if (msg.data.contactData[i].type === 'email') {
        if (email === '') email = msg.data.contactData[i].value;
      } else if (msg.data.contactData[i].type === 'phone') {
        if (phone === '') phone = msg.data.contactData[i].value;
      } else if (msg.data.contactData[i].type === 'mobile') {
        if (phone === '') phone = msg.data.contactData[i].value;
      }
    }
  }

  // let gender;
  // if(
  //   msg.data.gender
  //   && (msg.data.gender==='female' || msg.data.gender==='male')
  // ){
  //   gender = msg.data.gender;
  // }

  const expression = {
    metadata: msg.metadata,
    data: {
      employee: {
        first_name: msg.data.firstName,
        last_name: msg.data.lastName,
        // email: msg.data.email,
        email,
        // title: msg.data.title,
        // position: msg.data.jobTitle,
        // salutation: msg.data.salutation,
        // gender,
        // birthday: msg.data.birthday,
        // displayName: msg.data.displayName,
        // middleName: msg.data.middleName,
        // nickname: msg.data.nickname,
        // profile_picture: msg.data.photo,
        // addresses: msg.data.addresses,
        // contactData: msg.data.contactData,
        // relations: msg.data.relations,
      },
    },
  };

  // Remove null values
  Object.keys(expression.data).forEach(
    key => (expression.data[key] == null || expression.data[key] === undefined)
      && delete expression.data[key],
  );

  // Remove value-less array items
  // if (expression.contactData) expression.contactData.filter((cd) => cd.value);
  // if (expression.addresses)
  //   expression.addresses.filter((adr) => Object.keys(adr).length > 0);

  return expression;
};
