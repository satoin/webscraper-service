class ServiceErr extends Error {
    constructor(code, message) {
        super(message);
        this.statusCode = code;
        this.message = message;
    }
}

class NotFoundErr extends ServiceErr {
    constructor(msg = "The requested resource is not found.") {
        super(404, msg);
    }
}

class RequiredParamsErr extends ServiceErr {
    constructor(msg = "Some required parameters have not been provided.") {
        super(400, msg);
    }
}

class InternalErr extends ServiceErr {
    constructor(msg = "Sorry, something was wrong with the services. Please contact with the admin.") {
        super(500, msg);
    }
}

export { ServiceErr, NotFoundErr, RequiredParamsErr, InternalErr };
export default { NotFoundErr, RequiredParamsErr, InternalErr };