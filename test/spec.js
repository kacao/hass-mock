const
  should = require('should'),
  {fromDir} = require('../lib/extra');


describe('extra', () => {

  describe('.fromDir', () => {
    it('should correctly list and apply func on files', () => {
      let res = [];
      let val = [
        [ 'auth_invalid.json', 'test/mocks/auth/auth_invalid.json' ],
        [ 'auth_ok.json', 'test/mocks/auth/auth_ok.json' ],
        [ 'test.json', 'test/mocks/test.json' ]
      ].sort();
      let f = (name, path) => {
        res.push([name, path]);
      };
      fromDir('./test/mocks', '.json', f);
      res.sort().should.be.eql(val);
    });
  });


});
