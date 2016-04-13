// Copyright 2016, University of Colorado Boulder

/**
 * Button for toggling 'recording' state on/off.
 *
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanRoundToggleButton = require( 'SUN/buttons/BooleanRoundToggleButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Property.<boolean>} recordingProperty - true: recording, false: not recording
   * @param {Object} [options] node options
   * @constructor
   */
  function RecordStopButton( recordingProperty, options ) {

    options = _.extend( {
      radius: 30
    }, options );

    var squareLength = 0.75 * options.radius;

    // record icon, a red square
    var recordIcon = new Rectangle( 0, 0, squareLength, squareLength, { fill: PhetColorScheme.RED_COLORBLIND } );

    // stop icon, a black square
    var stopIcon = new Rectangle( 0, 0, squareLength, squareLength, { fill: 'black' } );

    BooleanRoundToggleButton.call( this, stopIcon, recordIcon, recordingProperty, options );
  }

  sceneryPhet.register( 'RecordStopButton', RecordStopButton );

  return inherit( BooleanRoundToggleButton, RecordStopButton );
} );