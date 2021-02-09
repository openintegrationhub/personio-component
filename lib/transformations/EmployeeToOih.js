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
module.exports.employeeToOih = (msg) => {
  if (Object.keys(msg).length === 0 && msg.constructor === Object) {
    return msg;
  }

  // const contactData = [];
  // const addresses = [];

  // if (msg.data.contactData) {
  //   for (let i = 0; i < msg.data.contactData.length; i += 1) {
  //     const cd = msg.data.contactData[i];
  //     delete cd.categories;
  //     delete cd.contextRef;
  //     delete cd.uid;
  //     if (cd.type === 'mobil') cd.type = 'mobile';
  //     contactData.push(cd);
  //   }
  // }

  // if (msg.data.addresses) {
  //   for (let j = 0; j < msg.data.addresses.length; j += 1) {
  //     const adr = msg.data.addresses[j];
  //     delete adr.categories;
  //     delete adr.contextRef;
  //     delete adr.uid;
  //     addresses.push(adr);
  //   }
  // }

  console.log('this is the message:', msg);

  let title = '';
  const titleMatches = ['titel', 'title'];

  let birthday = '';
  const birthdayMatches = ['geburtstag', 'geb.', 'geb', 'birthday', 'birthdate'];

  let phone = '';
  const phoneMatches = ['telefon', 'tel.', 'tel', 'mobile', 'mobile', 'phone'];

  let street = '';
  const streetMatches = ['straße', 'strasse', 'street'];

  let streetNumber = '';
  const streetNumberMatches = ['hausnummer', 'nr.', 'nr', 'streetnumber'];

  let zipcode = '';
  const zipcodeMatches = ['postleitzahl', 'plz.', 'plz', 'zipcode', 'zip'];

  let city = '';
  const cityMatches = ['crt', 'stadt', 'city'];


  if (msg.data.attributes) {
    let key;
    // eslint-disable-next-line
    for (key in msg.data.attributes) {
      if ('label' in msg.data.attributes[key]) {
        const label = msg.data.attributes[key].label.toLowerCase();
        if (titleMatches.includes(label)) {
          if (title === '') title = msg.data.attributes[key].value;
        } else if (phoneMatches.includes(label)) {
          if (phone === '') phone = msg.data.attributes[key].value;
        } else if (birthdayMatches.includes(label)) {
          if (birthday === '') birthday = msg.data.attributes[key].value;
        } else if (streetMatches.includes(label)) {
          if (street === '') street = msg.data.attributes[key].value;
        } else if (streetNumberMatches.includes(label)) {
          if (streetNumber === '') streetNumber = msg.data.attributes[key].value;
        } else if (zipcodeMatches.includes(label)) {
          if (zipcode === '') zipcode = msg.data.attributes[key].value;
        } else if (cityMatches.includes(label)) {
          if (city === '') city = msg.data.attributes[key].value;
        }
      }
    }
  }

  const meta = msg.metadata ? msg.metadata : msg.meta;

  const expression = {
    metadata: {
      recordUid: meta.recordUid,
      operation: msg.operation,
      applicationUid:
        meta.applicationUid !== undefined
        && meta.applicationUid !== null
          ? meta.applicationUid
          : 'appUid not set yet',
      iamToken:
        meta.iamToken !== undefined && meta.iamToken !== null
          ? meta.iamToken
          : undefined,
      domainId:
        meta.domainId !== undefined && meta.domainId !== null
          ? meta.domainId
          : undefined,
      schema:
        meta.schema !== undefined && meta.schema !== null
          ? meta.schema
          : undefined,
    },
    data: {
      firstName: msg.data.attributes.first_name ? msg.data.attributes.first_name.value : '',
      lastName: msg.data.attributes.last_name ? msg.data.attributes.last_name.value : '',
      // email: msg.data.attributes.email ? msg.data.attributes.email.value : '',
      title,
      photo: msg.data.attributes.profile_picture ? msg.data.attributes.profile_picture.value : '',
      jobTitle: msg.data.attributes.position ? msg.data.attributes.position.value : '',
      // salutation: msg.data.salutation,
      gender: msg.data.attributes.gender ? msg.data.attributes.gender.value : '',
      birthday,
      // displayName: msg.data.displayName,
      // middleName: msg.data.middleName,
      // nickname: msg.data.nickname,
      contactData: [
        {
          type: 'email',
          value: msg.data.attributes.email ? msg.data.attributes.email.value : '',
        },
      ],
      addresses: [],
    },
  };

  if (phone !== '') {
    expression.data.contactData.push({
      type: 'phone',
      value: phone,
    });
  }

  if (street !== '' || city !== '') {
    expression.data.addresses.push({
      street,
      streetNumber,
      city,
      zipcode,
    });
  }

  console.log('this is the message:', msg);
  console.log('this is the expression data:', expression.data);

  // Remove null values
  Object.keys(expression.data).forEach(
    key => (expression.data[key] == null || expression.data[key] === undefined)
      && delete expression.data[key],
  );
  return expression;
};
