// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node for up/down buttons.  Used in the fractions sims to change the number of divisions in a container.  See also UpDownSpinner.
 *
 * TODO: press to hold
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // imports
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RoundShinyButton = require( 'SCENERY_PHET/RoundShinyButton' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  function LeftRightSpinner( valueProperty, leftEnabledProperty, rightEnabledProperty, options ) {

    var shapeWidth = 26;
    var leftShape = new Shape().moveTo( 0, 0 ).lineTo( -10, shapeWidth / 2 ).lineTo( 0, shapeWidth );
    var rightShape = new Shape().moveTo( 0, 0 ).lineTo( 10, shapeWidth / 2 ).lineTo( 0, shapeWidth );

    var leftIcon = new Path( leftShape, {lineWidth: 5, stroke: 'black', lineCap: 'round'} );
    var rightIcon = new Path( rightShape, {lineWidth: 5, stroke: 'black', lineCap: 'round'} );

    var radius = 20;
    var leftButton = new RoundShinyButton( function() {
      valueProperty.set( valueProperty.get() - 1 );
    }, leftIcon, {
      radius: radius,
      touchAreaRadius: 24 * 1.3,
      upFill: new Color( '#7fb539' ),
      overFill: new Color( '#afd46d' ),
      downFill: new Color( '#517c23' ),
      iconOffsetX: -3
    } );
    leftEnabledProperty.linkAttribute( leftButton, 'enabled' );

    var rightButton = new RoundShinyButton( function() {
      valueProperty.set( valueProperty.get() + 1 );
    }, rightIcon, {
      radius: radius,
      touchAreaRadius: 24 * 1.3,
      upFill: new Color( '#7fb539' ),
      overFill: new Color( '#afd46d' ),
      downFill: new Color( '#517c23' ),
      iconOffsetX: +3
    } );
    rightEnabledProperty.linkAttribute( rightButton, 'enabled' );

    HBox.call( this, {spacing: 6, children: [leftButton, rightButton]} );

    this.mutate( options );
  }

  return inherit( HBox, LeftRightSpinner );
} );