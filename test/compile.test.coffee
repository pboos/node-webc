folder = '_data'
publisher = require('../lib/webc')
path = require('path')
fs = require('fs')
util = require('util')
should = require('should')

dataPath = __dirname + '/_data'
outputPath = dataPath + '/_output'

describe 'Compile', () ->

  afterEach ->
    deleteSync outputPath

  it 'should compile coffee-script files', (done) ->
    publisher.compile { path: dataPath, output: outputPath }, (err) ->
      should.not.exist err
      path.existsSync(outputPath).should.equal true
      path.existsSync(outputPath + '/example.js').should.equal true, 'example.js'
      done()

  it 'should compile jade files', (done) ->
    publisher.compile { path: dataPath, output: outputPath }, (err) ->
      should.not.exist err
      path.existsSync(outputPath).should.equal true
      path.existsSync(outputPath + '/example.html').should.equal true, 'example.html'
      done()

  it 'should compile less files', (done) ->
    publisher.compile { path: dataPath, output: outputPath }, (err) ->
      should.not.exist err
      path.existsSync(outputPath).should.equal true
      path.existsSync(outputPath + '/stylesheets/style.css').should.equal true, '/stylesheets/style.css'
      done()

  it 'should copy other files', (done) ->
    publisher.compile { path: dataPath, output: outputPath }, (err) ->
      should.not.exist err
      path.existsSync(outputPath).should.equal true
      path.existsSync(outputPath + '/images/nodejs.png').should.equal true, '/images/nodejs.png'
      done()

  it 'should not have an error, if output folder exists already', (done) ->
    fs.mk
    publisher.compile { path: dataPath, output: outputPath }, (err) ->
      should.not.exist err
      path.existsSync(outputPath).should.equal true
      path.existsSync(outputPath + '/images/nodejs.png').should.equal true, '/images/nodejs.png'
      done()


deleteSync = (pathToDelete) ->
  if path.existsSync(pathToDelete)
    stats = fs.lstatSync(pathToDelete)
    if stats.isDirectory()
      files = fs.readdirSync(pathToDelete)
      for filename in files
        do (filename) ->
          deleteSync pathToDelete + '/' + filename
      fs.rmdirSync(pathToDelete)
    else
      fs.unlinkSync(pathToDelete)

copyFile = (from, to, callback) ->
  fromFileDescriptor = fs.createReadStream(from);
  toFileDescriptor = fs.createWriteStream(to);
  util.pump(fromFileDescriptor, toFileDescriptor, callback);