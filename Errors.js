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

class NotFound extends APIError{
    constructor() {  
        super('NotFound', 404, 'RESOURCE_NOT_FOUND'); 
   } 
}


class ArtistNotFound extends APIError{
    constructor() {  
        super('ArtistNotFound', 404, 'RELATED_RESOURCE_NOT_FOUND'); 
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

class InternalServerError extends APIError { 
    constructor() {  
         super('InternalServerError', 500, 'INTERNAL_SERVER_ERROR'); 
    } 
}



module.exports = {
    APIError: APIError,
    InvalidInputError: InvalidInputError,
    AlreadyExistsError: AlreadyExistsError,
    InvalidURL:InvalidURL,
    NotFound:NotFound,
    ArtistNotFound:ArtistNotFound,
    InternalServerError: InternalServerError
  }