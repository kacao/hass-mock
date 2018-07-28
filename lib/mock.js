const 
  path = require('path'), 
  fs = require('fs'),
  {fromDir} = require('./extra'),
  {isFunction) = require('extra');

exports = module.exports = class HassMock {

  constructor(port) {
    this.port = port;
    this._handlers = {};
    this._addHandler('auth', this._onAuth);
    this._addHandler('get_states', this._onGetStates);
    this._addHandler('call_service', this._onCallService);
    this._addHandler('subscribe_events', this._onSubscribeEvents);
  }

  /*
   * adds .json mock files in ./mocks
   */
  _addMocks(dir) {
    let me = this;
    me._mocks = {};
    fromDir('./mocks', '.json', (name, path) => {
      me._mocks[name] = path;
    });
  }

  /*
   * add a msg handler
   */
  _addHandler(type, func) {
    if (isFunction(func)) {
      this._handlers[type] = func;
    }
  }

  /*
   * send a mock msg
   */
  _dispatch(mock) {
    this.send(JSON.stringify(this.me._mocks[mock]));
  }

  /*
   * responds to 'auth' msg
   */
  async _onAuth(ws, msg) {
    if (msg.api_password == 'yes') {
      ws._hassmock.authed = true;
      ws.dispatch('auth_ok');
    } else if (msg.api_password == 'no') {
      ws.dispatch('auth_invalid');
    }
  }

  // responds to get_states
  async _onGetStates(ws, msg) {
    let res = this._mocks['get_states'];
    res.id = msg.id;
    ws.dispatch(res);
  }

  // responds to call_service
  async _onCallService(ws, msg) {
    let res = this._mocks['call_service'];
    res.id = msg.id;
    ws.dispatch(res);
  }

  // responds to subscribe_events
  async _onSubscribeEvents(ws, msg) {
    let res = this._mocks['subscribe_events'];
    res.id = msg.id;
    ws.dispatch(res);
  }

  async _onConnection(ws, req) {
    let me = this;
    ws.me = me;
    ws.dispatch = me._dispatch.bind(me);
    ws._hassmock = {
      authed: false
    };
    ws.on('message', (message) => {
      self._onMessage(ws, message)
    });
    ws.on('error', (data) => {
      self._onError(ws, data)
    });
  }

  _onMessage(ws, data) {
    try {
      let msg = JSON.parse(data);
      if (this._handlers.hasOwnProperty(msg.type)) {
        this._handlers[msg.type].apply(this, [ws, msg]).then( () => {});
      } else {
        console.log('[hass-mock] unknown type: ' +  msg.type);
      }
    } catch (err) {
      console.log('[hass-mock]' + err);
    }
  }

  async start() {
    this.wss = new WebSocket.Server({ port: this.port });
    this.wss.on('connection', (ws, req) => {
      this._onConnection(ws, req);
    });
  }

  async close() {
    this.wss.close();
  };
}
