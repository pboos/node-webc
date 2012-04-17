folder = '_data'
publisher = require('../index')

describe 'Compile all', () ->
  it 'should compile jade files', (done) ->
    publisher.run().should.equal process.cwd()
    publisher.run({path:__dirname}).should.equal __dirname
    done()