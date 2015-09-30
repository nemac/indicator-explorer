# Indicators Explorer Widget
The indicators explorer is a reusable and embeddable jQuery Widget that allows for quick comparison between two sets of selectable map images. The widget is configuration-driven and therefore can be reused with only modifications to configuration.

## Dependencies
- jQuery
- jQuery UI

## Incorporated libraries
Note that the following libraries are incorporated into the source of the indicators explorer widget and do not need to be included separately.
- [Event Move](https://github.com/stephband/jquery.event.move)
- [Twentytwenty](https://github.com/zurb/twentytwenty)
- [Skeleton](http://getskeleton.com/) (only the grid, clearing, and utilities; note that a custom namespace has been applied to minimize interference with anywhere this may be included)

## Usage
1. Include the JS and CSS. The minified copies of the files are preferable to use.
2. Declare the widget on an empty div:

```javascript
// Provide a path to a standalone config file
$('#map-compare').mapCompare({config: 'config.json'});

// or provide the desired options as an object
$('#map-compare').mapCompare({config: {
  // config options
}});
```

See the demo directory for a working demo.

## Config options
```javascript
{
  "defaultSlidePosition": 0.5,    // default starting position of the slider
  "leftSelector": {
    "name": "Climate Indicator",  // name that appears above left selector
    "images": [{                  // array of images
        "name": "Image Name to Appear in Selector",
        "source": "path/to/image.jpg",
        "default": true           // default selected map
      }
    ]
  },
  "rightSelector": {}             // functions the same as the left selector
}

```

## Building the source
The [map-compare-widget](/map-compare-widget/) directory contains the non-minifed source in addition to minified builds. Should it be desired to make changes to the script, the included gulp file will handle the minification and update to the demo for testing.

### Dependencies
- node.js
- NPM

To satisfy build tool dependencies, in the project directory run:
```bash
npm install
```

Then any of the gulp commands as described in the gulpfile. The default command is probably sufficient:
```bash
gulp
```
