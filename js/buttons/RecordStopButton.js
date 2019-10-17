// Copyright 2016-2019, University of Colorado Boulder

/**
 * Button for toggling 'recording' state on/off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanRoundToggleButton = require( 'SUN/buttons/BooleanRoundToggleButton' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Property.<boolean>} recordingProperty - true: recording, false: not recording
   * @param {Object} [options] node options
   * @constructor
   */
  function RecordStopButton( recordingProperty, options ) {
    options = merge( {
      radius: 30
    }, options );

    const squareLength = 0.75 * options.radius;

    // stop icon, a black square
    const stopIcon = new Rectangle( 0, 0, 0.75 * options.radius, 0.75 * options.radius, { fill: 'black' } );

    // record icon, a red circle
    const recordIcon = new Circle( 0.6 * squareLength, {
      fill: PhetColorScheme.RED_COLORBLIND,
      center: stopIcon.center
    } );

    BooleanRoundToggleButton.call( this, stopIcon, recordIcon, recordingProperty, options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'RecordStopButton', this );
  }

  sceneryPhet.register( 'RecordStopButton', RecordStopButton );

  return inherit( BooleanRoundToggleButton, RecordStopButton );
} );