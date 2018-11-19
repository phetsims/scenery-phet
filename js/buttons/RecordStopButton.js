// Copyright 2016-2018, University of Colorado Boulder

/**
 * Button for toggling 'recording' state on/off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanRoundToggleButton = require( 'SUN/buttons/BooleanRoundToggleButton' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Property.<boolean>} recordingProperty - true: recording, false: not recording
   * @param {Object} [options] node options
   * @constructor
   */
  function RecordStopButton( recordingProperty, options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {
      radius: 30
    }, options );

    var squareLength = 0.75 * options.radius;

    // stop icon, a black square
    var stopIcon = new Rectangle( 0, 0, 0.75 * options.radius, 0.75 * options.radius, { fill: 'black' } );

    // record icon, a red circle
    var recordIcon = new Circle( 0.6 * squareLength, {
      fill: PhetColorScheme.RED_COLORBLIND,
      center: stopIcon.center
    } );

    BooleanRoundToggleButton.call( this, stopIcon, recordIcon, recordingProperty, options );
  }

  sceneryPhet.register( 'RecordStopButton', RecordStopButton );

  return inherit( BooleanRoundToggleButton, RecordStopButton );
} );