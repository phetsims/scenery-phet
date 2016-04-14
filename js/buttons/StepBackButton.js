// Copyright 2014-2015, University of Colorado Boulder

//TODO lots of duplication with StepButton, differences noted in TODOs below, see scenery-phet#235
/**
 * StepBackButton button is generally used along side play/pause and forward buttons.
 * Though the listener is generic, the button is typically used to step back in time frame
 *
 * This class uses the same drawing code as StepButton but differs in the following ways
 * The triangle's path is rotated to 180 degrees
 * The order of adding bar and triangle is reversed
 * The content is center aligned by shifting it leftwards
 *
 * @author Sharfudeen Ashraf
 *
 *  @see StepButton.js
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
   * @param {Property.<boolean>} enabledProperty - TODO this is different than StepButton
   * @param {Object} [options]
   * @constructor
   */
  function StepBackButton( stepFunction, enabledProperty, options ) {

    // button radius is used in computation of other default options
    var BUTTON_RADIUS = ( options && options.radius ) ? options.radius : 20;

    options = _.extend( {
      radius: BUTTON_RADIUS,
      //TODO multiplier is different than StepButton
      xContentOffset: -0.15 * BUTTON_RADIUS, // shift the content to center align, assumes 3D appearance
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
      fill: options.iconFill,
      rotation: Math.PI //TODO rotates the same shape as StepButton
    } );

    assert && assert( !options.content, 'button creates its own content' );
    options.content = new HBox( {
      children: [ trianglePath, barPath ], //TODO order is different than StepButton
      spacing: barWidth
    } );

    RoundPushButton.call( this, options );

    var thisButton = this;
    enabledProperty.link( function( value ) { thisButton.enabled = value; } ); //TODO this is different than StepButton
  }

  sceneryPhet.register( 'StepBackButton', StepBackButton );

  return inherit( RoundPushButton, StepBackButton );
} );