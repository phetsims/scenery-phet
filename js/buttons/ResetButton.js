// Copyright 2013-2016, University of Colorado Boulder

/**
 * A general button, typically used to reset something.
 * Drawn programmatically, does not use any image files.
 *
 * @author John Blanco
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ResetShape = require( 'SCENERY_PHET/ResetShape' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ResetButton( options ) {

    // radius is used in computation of defaults for other options
    var BUTTON_RADIUS = ( options && options.radius ) ? options.radius : 24;
    
    options = _.extend( {
      radius: BUTTON_RADIUS,
      minXMargin: BUTTON_RADIUS * 0.2,
      baseColor: 'white',
      arrowColor: 'black',

      // The arrow shape doesn't look right when perfectly centered, account for that here,
      // and see docs in RoundButtonView. The multiplier values were empirically determined.
      xContentOffset: 0.03 * BUTTON_RADIUS,
      yContentOffset: -0.0125 * BUTTON_RADIUS,

      // Marker entry to indicate that tandem is supported (in the parent)
      tandem: null
    }, options );

    assert && assert( !options.content, 'content is not customizable' );
    options.content = new Path( new ResetShape( options.radius ), { fill: options.arrowColor } );

    RoundPushButton.call( this, options );
  }

  sceneryPhet.register( 'ResetButton', ResetButton );

  return inherit( RoundPushButton, ResetButton );
} );
