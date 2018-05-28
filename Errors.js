class APIError extends Error { 
    constructor(name, statusCode, errorCode, message = null) {
           super(message || name);   
           this.name = name;   
           this.status = statusCode;   
           this.errorCode = errorCode; } 
}

class InvalidInputError extends APIError { 
    constructor() {  
         super('InvalidInputError', 400, 'BAD_REQUEST'); 
    } 
}

class AlreadyExistsError extends APIError { 
    constructor() {  
         super('AlreadyExistsError', 409, 'RESOURCE_ALREADY_EXISTS'); 
    } 
}

class InvalidURL extends APIError { 
    constructor() {  
         super('InvalidURLError', 404, 'RESOURCE_NOT_FOUND'); 
    } 
}


module.exports = {
    APIError: APIError,
    InvalidInputError: InvalidInputError,
    AlreadyExistsError: AlreadyExistsError,
    InvalidURL:InvalidURL
  }