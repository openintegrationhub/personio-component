# <p align="center" width="100%"> <img src="./logo.png"> </p>

# <p align="center" width="100%"> Personio OIH Connector </p>

## Description

[![Generic badge](https://img.shields.io/badge/Status-NotTested!-lightgrey.svg)](https://shields.io/)

A generated OIH connector for the Personnel Data API (version 1.0).

Generated from: https://raw.githubusercontent.com/personio/api-docs/master/personio-personnel-data-api.yaml<br/>
Generated at: 2021-05-27T11:30:06+02:00

## API Description

API for reading and writing personnel data incl. data about attendances and absences<br/>

## Authorization

Supported authorization schemes:

- API Key

## Actions

### Create an employee

> Creates new employee. Status of the employee will be set to `active` if `hire_date` provided is in past. Otherwise status will be set to `onboarding`. This endpoint will respond with `id` of created employee in case of success.<br/>

### Show employee by ID

#### Input Parameters

- `employee_id` - _required_ - Numeric `id` of the employee<br/>

### Show employee profile picture

#### Input Parameters

- `employee_id` - _required_ - Numeric `id` of the employee<br/>
- `width` - _required_ - Width of the image. Default 75x75<br/>

### This endpoint is responsible for adding attendance data for the company employees. It is possible to add attendances for one or many employees at the same time. The payload sent on the request should be a list of attendance periods, in the form of an array containing attendance period objects.

### This endpoint is responsible for deleting attendance data for the company employees.

#### Input Parameters

- `id` - _required_ - ID of the attendance period to delete<br/>

### This endpoint is responsible for updating attendance data for the company employees. Attributes are not required and if not specified, the current value will be used. It is not possible to change the employee id.

#### Input Parameters

- `id` - _required_ - ID of the attendance period to update<br/>

### This endpoint is responsible for adding absence data for the company employees.

### This endpoint is responsible for deleting absence period data for the company employees.

#### Input Parameters

- `id` - _required_ - ID of the absence period to delete<br/>

### Absence Period

#### Input Parameters

- `id` - _required_ - Numeric `id` of the absence period<br/>

## License

: personio-component<br/>
<br/>

All files of this connector are licensed under the Apache 2.0 License. For details
see the file LICENSE on the toplevel directory.
