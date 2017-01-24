// Copyright 2014-2016, University of Colorado Boulder

/**
 * Node for up/down buttons.  Used in the fractions sims to change the number of divisions in a container.  See also UpDownSpinner.
 *
 * TODO: press to hold
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   *
   * @param {Property.<number>} valueProperty
   * @param {Property.<boolean>} leftEnabledProperty
   * @param {Property.<boolean>} rightEnabledProperty
   * @param {Object} [options]
   * @constructor
   */
  function LeftRightSpinner( valueProperty, leftEnabledProperty, rightEnabledProperty, options ) {
    Tandem.indicateUninstrumentedCode();

    var shapeWidth = 26;
    var leftShape = new Shape().moveTo( 0, 0 ).lineTo( -10, shapeWidth / 2 ).lineTo( 0, shapeWidth );
    var rightShape = new Shape().moveTo( 0, 0 ).lineTo( 10, shapeWidth / 2 ).lineTo( 0, shapeWidth );

    var leftIcon = new Path( leftShape, { lineWidth: 5, stroke: 'black', lineCap: 'round' } );
    var rightIcon = new Path( rightShape, { lineWidth: 5, stroke: 'black', lineCap: 'round' } );

    var radius = 20;
    var leftButton = new RoundPushButton( {
      content: leftIcon,
      listener: function() {
        valueProperty.set( valueProperty.get() - 1 );
      },
      baseColor: '#7fb539',
      radius: radius,
      touchAreaDilation: 10,
      xContentOffset: -3
    } );
    leftEnabledProperty.linkAttribute( leftButton, 'enabled' );

    var rightButton = new RoundPushButton( {
      radius: radius,
      listener: function() {
        valueProperty.set( valueProperty.get() + 1 );
      },
      content: rightIcon,
      touchAreaRadius: 24 * 1.3,
      baseColor: '#7fb539',
      xContentOffset: +3
    } );
    rightEnabledProperty.linkAttribute( rightButton, 'enabled' );

    HBox.call( this, { spacing: 6, children: [ leftButton, rightButton ] } );

    this.mutate( options );
  }

  sceneryPhet.register( 'LeftRightSpinner', LeftRightSpinner );

  return inherit( HBox, LeftRightSpinner );
} );