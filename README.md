# xgettext-unity

[![NPM version](https://img.shields.io/npm/v/xgettext-unity.svg)](https://www.npmjs.com/package/xgettext-unity)
[![Build Status](https://travis-ci.org/Spark-NF/xgettext-unity.svg?branch=master)](https://travis-ci.org/Spark-NF/xgettext-unity)
[![Code Coverage](https://img.shields.io/codecov/c/github/Spark-NF/xgettext-unity.svg)](https://codecov.io/gh/Spark-NF/xgettext-unity)
[![Project license](https://img.shields.io/github/license/Spark-NF/xgettext-unity.svg)](https://raw.githubusercontent.com/Spark-NF/xgettext-unity/master/LICENSE)

## About
Extract translation strings from Unity YAML files and generate POT files with them.

## Usage
```typescript
xgettextUnity(inputFiles, variables, outputFile);
```

* `inputFiles`: the list of Unity files to extract
* `variables`: which YAML variables to look for in the Unity files
* `outputFile`: the output POT file (will be overwritten)

### Example
Basic
```javascript
var xgettextUnity = require("xgettext-unity").default;

var inputFiles = ["Assets/Scenes/SampleScene.unity", "Assets/Scenes/MainMenu.unity"];
var outputFile = "Assets/Localization/template.pot";
xgettextUnity(inputFiles, ["m_text"], outputFile);
```

With [glob](https://github.com/isaacs/node-glob)
```javascript
var glob = require("glob");
var xgettextUnity = require("xgettext-unity").default;

var inputFiles = glob.sync("Assets/**/*.{unity,prefab}");
var outputFile = "Assets/Localization/template.pot";
xgettextUnity(inputFiles, ["m_text"], outputFile);
```

## Authors
* [Spark-NF](https://github.com/Spark-NF)

## License
The program is licensed under the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).

## Building
```
npm install
npm run check
npm run build
npm run test
```