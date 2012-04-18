folder = '_data'
publisher = require('../index')
path = require('path')
fs = require('fs')

dataPath = __dirname + '/_data'
outputPath = dataPath + '/_output'

describe 'Compile all', () ->

  beforeEach ->
    deleteFolderSync outputPath

  it 'should compile jade files', (done) ->
    publisher.run({ path: dataPath, output: outputPath })

    path.existsSync(outputPath).should.equal true
    path.existsSync(outputPath + '/example.html').should.equal true
    path.existsSync(outputPath + '/example.js').should.equal true
    done()


deleteFolderSync = (folder) ->
  if path.existsSync(folder)
    files = fs.readdirSync(folder)
    for filename in files
      do (filename) ->
        file = folder + '/' + filename
        stats = fs.lstatSync(file)
        if stats.isFile()
          fs.unlinkSync(file)
        else if stats.isDirectory()
          deleteFolderSync(file)
