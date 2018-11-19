// Copyright 2016-2018, University of Colorado Boulder

/**
 * Query parameters for the scenery-phet demo application.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  var sceneryPhetQueryParameters = QueryStringMachine.getAll( {

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
    }
  } );

  sceneryPhet.register( 'sceneryPhetQueryParameters', sceneryPhetQueryParameters );

  return sceneryPhetQueryParameters;
} );
