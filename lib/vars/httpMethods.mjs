import http from 'http';

const httpMethods = http.METHODS.map((method) => method.toLowerCase());

export default httpMethods;
