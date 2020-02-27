// Copyright 2016-2020, University of Colorado Boulder

/**
 * Query parameters for the scenery-phet demo application.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import sceneryPhet from './sceneryPhet.js';

const sceneryPhetQueryParameters = QueryStringMachine.getAll( {

  // background color of the screens
  backgroundColor: {
    type: 'string', // CSS color format, e.g. 'green', 'ff8c00', 'rgb(255,0,255)'
    defaultValue: 'white'
  },

  // initial selection on the Sliders screen, values are the same as the labels on combo box items
  slider: {
    type: 'string',
    defaultValue: null
  },

  // initial selection on the Components screen, values are the same as the labels on combo box items
  component: {
    type: 'string',
    defaultValue: null
  },

  memoryTestCreationMax: {
    type: 'number',
    defaultValue: 10000
  },

  greenhouseWaves: {
    type: 'flag'
  }
} );

sceneryPhet.register( 'sceneryPhetQueryParameters', sceneryPhetQueryParameters );

export default sceneryPhetQueryParameters;