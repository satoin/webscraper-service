# webscaper-service

Simple service that extracts HTML elements from a provided site on the basis of a set of rules.

## Running the service
The service is containerized via [Docker](https://www.docker.com/) (read more about containers [here](https://www.docker.com/resources/what-container)). To install Docker follow [these instructions](https://docs.docker.com/get-docker/).

To make the process of run it locally easiest, the repository includes a [Makefile](https://en.wikipedia.org/wiki/Make_(software)) that abstract all the required commands and parameters in the following CLI commands:

```sh
    make build
    make run
    # or just `make all`
```

**Other commands:**

 - `make enter`: Run a command shell into the running container.
 - `make stop`: Stops current container.
 - `make clean`: Purge all created images and containers.
 - `make all`: First call to `make clean`, then build the crawler (`make build`) and run it (`make run`)

## Available endpoints

### Get token information
| URI | Method | Body (JSON) |
|:---|:---:|:---|
| `/single-page` | POST | **`url`**: The website URL address to scrap.<br/> **`rules`**: The definition of the HTML elements of the webpage to get its values. <br/>Template: `{ <title>: { selector: '<css-selector>', attr: '<element-attr>', multiple: <if-list> }}` |

#### Request
```sh
curl -X POST http://localhost:8082/single-page \
   -H 'Content-Type: application/json' \
   -d '{"url": "http://.../", "rules": {"website":{"selector":"... > a","attr":"href","multiple":false},"social_links":{"selector":"... > a","attr":"href","multiple":true}}}'
```

#### Success response
```json
{
  "website": "...",
  "social_links": [
    "...",
    "...",
    "..."
  ]
}
```

#### Error response
```json
{
  "stack": "[...error stack]",
  "message": "<error_message>",
  "statusCode": "<error_code>"
}
```