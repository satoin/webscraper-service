import express from 'express';

// Default ENV parameters
const DEFAULT_PORT = parseInt(process.env.PORT) || 8080;

// Class to create a simple JSON-HTTP server to listen for GET requests.
export default class Server {
    // Initialize the server with the provided port and set JSON middleware by
    // default.
    constructor(port = DEFAULT_PORT) {
        this.app = express();
        this.port = port;

        this.app.use(express.json());
    }

    route(req, res, handler) {
        try {
            // handle async errors
            const result = handler(req, res); 
            if (!!result && typeof result.then === 'function') {
                result.catch(err => this.sendError(res, err));
            }

            return result;
        } catch (err) {
            this.sendError(res, err);
            return;
        }
    }

    getRoute(uri, handler) {
        this.app.get(uri, (req, res) => this.route(req, res, handler));
    }

    postRoute(uri, handler) {
        this.app.post(uri, (req, res) => this.route(req, res, handler));
    }

    putRoute(uri, handler) {
        this.app.put(uri, (req, res) => this.route(req, res, handler));
    }

    deleteRoute(uri, handler) {
        this.app.delete(uri, (req, res) => this.route(req, res, handler));
    }

    defaultRoute(handler) {
        this.app.use('*', (req, res) => this.route(req, res, handler));
    }

    // sendError setups the current response to send the information of the 
    // error provided. Also receives a status code to be returned as HTTP status
    // code, by default 500.
    sendError(res, error = new Error('Internal server error.'), statusCode = 500) {
        // setup HTTP response
        statusCode = error.statusCode || statusCode;
        res.status(statusCode);
        res.setHeader('Content-Type', 'application/json');
        
        // serilize error including its hidden properties and send it as body
        const content = JSON.stringify(error, Object.getOwnPropertyNames(error));
        return res.end(content);
    }

    // listen starts the server on the defined port
    listen() {
        // start the server
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`);
        });
    }
}