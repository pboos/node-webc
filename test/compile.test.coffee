folder = '_data'
publisher = require('../index')
path = require('path')
fs = require('fs')
should = require('should')

dataPath = __dirname + '/_data'
outputPath = dataPath + '/_output'

describe 'Compile all', () ->

  beforeEach ->
    deleteFolderSync outputPath

  it 'should compile coffee-script files', (done) ->
    publisher.run { path: dataPath, output: outputPath }, (err) ->
      should.not.exist err
      path.existsSync(outputPath).should.equal true
      path.existsSync(outputPath + '/example.js').should.equal true, 'example.js'
      done()

  it 'should compile jade files', (done) ->
    publisher.run { path: dataPath, output: outputPath }, (err) ->
      should.not.exist err
      path.existsSync(outputPath).should.equal true
      path.existsSync(outputPath + '/example.html').should.equal true, 'example.html'
      done()

  it 'should copy other files', (done) ->
    publisher.run { path: dataPath, output: outputPath }, (err) ->
      should.not.exist err
      path.existsSync(outputPath).should.equal true
      path.existsSync(outputPath + '/images/nodejs.png').should.equal true, '/images/nodejs.png'
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
    fs.rmdirSync(folder)