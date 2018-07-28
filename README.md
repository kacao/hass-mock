# hass-mock
Home Assistant Websocket mock

## installation
`npm install -s kacao/hass-mock`

## Example
```javascript
const HassMock = require('hass-mock');
let hassMock = new HassMock(8123);
hassMock.start().then( () => {} );
// or await hassMock.start();
