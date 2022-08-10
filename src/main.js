import Server from './modules/server.js';
import Errors from './modules/error.js';
import { singlePage } from './modules/scraper.js';

const server = new Server();

server.postRoute('/single-page', async (req, res) => {
    let url, rules;
    try {
        url = req.body.url;
        rules = req.body.rules;
        if (!url) throw new Error('No url provided.');
        if (!rules) throw new Error('No rules provided.');
    } catch {
        throw new Errors.RequiredParamsErr();
    }
    
    try {
        const result = await singlePage(url, rules);
        res.send(result);
    } catch(error) {
        console.log(error)
        throw new Errors.InternalErr();
    }
});

server.defaultRoute(() => {
    throw new Errors.NotFoundErr();
});

server.listen();