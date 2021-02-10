/* eslint no-unused-expressions: "off" */

const { expect } = require('chai');
const { employeeToOih } = require('./../lib/transformations/EmployeeToOih');
const { employeeFromOih } = require('./../lib/transformations/EmployeeFromOih');

const oihPerson = {
  metadata: { recordUid: null, applicationUid: 'appUid not set yet' },
  data: {
    firstName: 'Test',
    lastName: 'Person',
    title: 'Dr.',
    photo: 'abc.jpg',
    jobTitle: 'CEO',
    gender: 'male',
    birthday: '01.01.1901',
    contactData: [{ type: 'email', value: 'some@mail.com' }, { type: 'phone', value: '040 / 123456' }],
    addresses: [{
      street: 'Teststrasse', streetNumber: '123', city: 'Somecity', zipcode: '12345',
    }],
  },
};

const employee = {
  metadata: {
    recordUid: null,
  },
  data: {
    type: 'employee',
    attributes: {
      first_name: {
        label: 'Firstname',
        value: 'Test',
      },
      last_name: {
        label: 'Lastname',
        value: 'Person',
      },
      email: {
        label: 'E-Mail',
        value: 'some@mail.com',
      },
      profile_picture: {
        label: 'Photo',
        value: 'abc.jpg',
      },
      position: {
        label: 'Position',
        value: 'CEO',
      },
      gender: {
        label: 'Gender',
        value: 'male',
      },
      dynamic_1: {
        label: 'Title',
        value: 'Dr.',
      },
      dynamic_2: {
        label: 'Title',
        value: 'Dr.',
      },
      dynamic_3: {
        label: 'Birthday',
        value: '01.01.1901',
      },
      dynamic_4: {
        label: 'Tel.',
        value: '040 / 123456',
      },

      dynamic_5: {
        label: 'Street',
        value: 'Teststrasse',
      },
      dynamic_6: {
        label: 'Nr',
        value: '123',
      },
      dynamic_7: {
        label: 'Zipcode',
        value: '12345',
      },
      dynamic_8: {
        label: 'City',
        value: 'Somecity',
      },
    },
  },
};

describe('Transformations', () => {
  before(async () => {
  });

  it('Should transform employee to OIH person format', async () => {
    const result = employeeToOih(employee);

    expect(result).to.not.be.empty;
    expect(result.metadata).to.be.an('object');
    expect(result.data).to.be.an('object');

    expect(result.data.firstName).to.equal('Test');
    expect(result.data.lastName).to.equal('Person');

    expect(result.data.title).to.equal('Dr.');
    expect(result.data.photo).to.equal('abc.jpg');
    expect(result.data.jobTitle).to.equal('CEO');
    expect(result.data.gender).to.equal('male');
    expect(result.data.birthday).to.equal('01.01.1901');

    expect(result.data.contactData[0].type).to.equal('email');
    expect(result.data.contactData[0].value).to.equal('some@mail.com');

    expect(result.data.contactData[1].type).to.equal('phone');
    expect(result.data.contactData[1].value).to.equal('040 / 123456');

    expect(result.data.addresses[0].street).to.equal('Teststrasse');
    expect(result.data.addresses[0].streetNumber).to.equal('123');
    expect(result.data.addresses[0].city).to.equal('Somecity');
    expect(result.data.addresses[0].zipcode).to.equal('12345');
  });

  it('Should transform OIH person to personio employee format', async () => {
    const result = employeeFromOih(oihPerson);
    console.log(result);
    expect(result).to.not.be.empty;
    expect(result.metadata).to.be.an('object');
    expect(result.data).to.be.an('object');
    expect(result.data.employee).to.be.an('object');

    expect(result.data.employee.first_name).to.equal('Test');
    expect(result.data.employee.last_name).to.equal('Person');

    expect(result.data.employee.email).to.equal('some@mail.com');

    // expect(result.data.employee.position).to.equal('CEO');
    // expect(result.data.employee.gender).to.equal('male');
    // expect(result.data.employee.profile_picture).to.equal('abc.jpg');
  });
});
