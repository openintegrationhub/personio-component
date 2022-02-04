
 const Swagger = require('swagger-client');
 const spec = require('./lib/spec.json');

const main = () => { 
     let securities = {};
    securities['BearerAuth'] = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5wZXJzb25pby5kZS92MS9jb21wYW55L2VtcGxveWVlcyIsImlhdCI6MTYzOTQwMTM1MiwiZXhwIjoxNjM5NDg4Mzg2LCJuYmYiOjE2Mzk0MDE5ODYsImp0aSI6Ijg3MTRiNTZkLTVmODQtNDFkZS1hOTU0LTQzOTZkNjExY2QzOSIsInN1YiI6Ik1EZzROVE15Wm1Nd01URXpOVFpqWm1VelpEWmtORFppIiwicHJ2IjoiN2ExOTk0OTk5ZDE4MWRlZWE2OGU0MzA0YjMzNDZlNzhmODM4ZWNiNyIsInNjb3BlIjpbImVtcGxveWVlczpyZWFkIiwiYXR0ZW5kYW5jZXM6cmVhZCIsImFic2VuY2VzOnJlYWQiXX0.VG2eNHodsKAF48xXS3fRH94cqlj49p9urvwrbHYom2Q";
    const cfg = {}
    const parameters = {}
     if(cfg.otherServer){
         if(!spec.servers){
             spec.servers = [];
         }
         spec.servers.push({"url":cfg.otherServer})
     }
     const contentType = undefined;
     const body = {}

let callParams = {
    spec: spec,
    operationId: undefined,
    pathName: '/company/employees',
    method: 'get',
    parameters: parameters,
    requestContentType: contentType,
    // requestBody: body,
    securities: {authorized: securities},
    server: spec.servers[cfg.server] || cfg.otherServer,
};

return Swagger.execute(callParams).then(data => {
    console.log(data.headers.authorization.split(" ")[1])
    delete data.uid;
    const newElement = {}
    newElement.metadata = oihMeta;
    const response = JSON.parse(data.data);
    newElement.data = cfg.nodeSettings.arraySplittingKey !== undefined ? response[cfg.nodeSettings.arraySplittingKey] : response;
    if(Array.isArray(newElement.data)){
       for(let i = 0; i < newElement.data.length; i++ ){
           const newObject = newElement;
           newObject.data = newElement.data[i];
           this.emit("data",newObject)
       }
   } else {
   this.emit("data",newElement);
} 
});
}

main();