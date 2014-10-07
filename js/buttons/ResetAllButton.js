// Copyright 2002-2014, University of Colorado Boulder

/**
 * Reset All button.  This version is drawn in code using shapes, gradients,
 * and such, and does not use any image files.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var ResetAllShape = require( 'SCENERY_PHET/ResetAllShape' );

  // Constants
  var DEFAULT_RADIUS = 24; // Derived from images initially used for reset button.

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ResetAllButton( options ) {
    var buttonRadius = options && options.radius ? options.radius : DEFAULT_RADIUS;
    options = _.extend( {
      // Default values
      radius: DEFAULT_RADIUS,
      minXMargin: buttonRadius * 0.2,

      // Default orange color scheme, standard for PhET reset buttons
      baseColor: new Color( 247, 151, 34 ),

      // The arrow shape doesn't look right when perfectly centered, account
      // for that here, and see docs in RoundButtonView.  The multiplier
      // values were empirically determined.
      xContentOffset: buttonRadius * 0.03,
      yContentOffset: buttonRadius * ( -0.0125 )
    }, options );

    var icon = new Path( new ResetAllShape( options.radius ), { fill: 'white' } );

    RoundPushButton.call( this, _.extend( { content: icon }, options ) );

    // set a better id value for data collection
    this.buttonModel.property( 'down' ).setID( 'resetAllButton.down' );
  }

  return inherit( RoundPushButton, ResetAllButton );
} );
