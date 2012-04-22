# webc - website compiler

WebC makes it easy to compile your jade/coffee-script/less files and test them locally in the browser. It can watch the files for changes and even serve them through a static web server locally for testing.

## Installation

via npm:

```bash
$ npm install webc
$ webc --help
```

## Usage

```bash
$ webc compile
```
Compiles your files to _output. Use --out to specify diferent output directory.

```bash
$ webc watch
```
Same as compile, but compiles if changes happen.


```bash
$ webc serve
```
Same as watch but as well serves the files through http://localhost:3000. Use --port to change the port.