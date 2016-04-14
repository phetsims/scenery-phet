// Copyright 2014-2015, University of Colorado Boulder

/**
 * Button used for stepping the simulation forward when paused.
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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param stepFunction
   * @param {Property.<boolean>} playingProperty - button will be disabled when this is true
   * @param {Object} [options]
   * @constructor
   */
  function StepButton( stepFunction, playingProperty, options ) {

    // button radius is used in computation of other default options
    var BUTTON_RADIUS = ( options && options.radius ) ? options.radius : 20;

    options = _.extend( {
      radius: BUTTON_RADIUS,
      xContentOffset: 0.075 * BUTTON_RADIUS, // shift the content to center align, assumes 3D appearance
      fireOnHold: true,
      iconFill: 'black'
    }, options );

    assert && assert( !options.listener, 'stepFunction replaces options.listener' );
    options.listener = stepFunction;

    // step symbol is sized relative to the radius
    var barWidth = options.radius * 0.15;
    var barHeight = options.radius * 0.9;
    var triangleWidth = options.radius * 0.65;
    var triangleHeight = barHeight;

    var barPath = new Rectangle( 0, 0, barWidth, barHeight, { fill: options.iconFill } );
    var trianglePath = new Path( new Shape()
      .moveTo( 0, triangleHeight / 2 )
      .lineTo( triangleWidth, 0 )
      .lineTo( 0, -triangleHeight / 2 )
      .close(), {
      fill: options.iconFill
    } );

    assert && assert( !options.content, 'button creates its own content' );
    options.content = new HBox( {
      children: [ barPath, trianglePath ],
      spacing: barWidth
    } );

    RoundPushButton.call( this, options );

    var thisButton = this;
    playingProperty.link( function( value ) { thisButton.enabled = !value; } );
  }

  sceneryPhet.register( 'StepButton', StepButton );

  return inherit( RoundPushButton, StepButton );
} );