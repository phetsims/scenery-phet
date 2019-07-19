// Copyright 2016-2019, University of Colorado Boulder

/**
 * A general button, typically used to reset something.
 * Drawn programmatically, does not use any image files.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Path = require( 'SCENERY/nodes/Path' );
  const ResetShape = require( 'SCENERY_PHET/ResetShape' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Tandem = require( 'TANDEM/Tandem' );

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

      //TODO this should be handled by RoundButtonView.ThreeDAppearanceStrategy, see sun#234
      // The icon doesn't look right when perfectly centered, account for that here,
      // and see docs in RoundButtonView. The multiplier values were empirically determined.
      xContentOffset: -0.03 * BUTTON_RADIUS,
      yContentOffset: -0.0125 * BUTTON_RADIUS,

      tandem: Tandem.required
    }, options );

    // icon, with bounds adjusted so that center of circle appears to be centered on button, see sun#235
    var resetIcon = new Path( new ResetShape( options.radius ), { fill: options.arrowColor } );
    var reflectedIcon = new Path( resetIcon.shape.transformed( Matrix3.scaling( -1, -1 ) ) );
    resetIcon.localBounds = resetIcon.localBounds.union( reflectedIcon.localBounds );

    assert && assert( !options.content, 'content is not customizable' );
    options.content = resetIcon;

    RoundPushButton.call( this, options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ResetButton', this );
  }

  sceneryPhet.register( 'ResetButton', ResetButton );

  return inherit( RoundPushButton, ResetButton );
} );
