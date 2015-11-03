// Copyright 2002-2013, University of Colorado Boulder

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

  var DEFAULT_RADIUS = 20;

  /**
   *
   * @param stepFunction
   * @param {Property.<boolean>} playProperty
   * @param {Object} [options]
   * @constructor
   */
  function StepBackButton( stepFunction, playProperty, options ) {
    var stepBackButton = this;
    options = _.extend( {
      radius: DEFAULT_RADIUS,
      fireOnHold: true
    }, options );

    // step symbol is sized relative to the radius
    var barWidth = options.radius * 0.15;
    var barHeight = options.radius * 0.9;
    var triangleWidth = options.radius * 0.65;
    var triangleHeight = barHeight;

    var barPath = new Rectangle( 0, 0, barWidth, barHeight, { fill: 'black' } );
    var trianglePath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), { fill: 'black' } );
    trianglePath.mutate( { rotation: Math.PI } );

    RoundPushButton.call( this, _.extend( {
      content: new HBox( { children: [ trianglePath, barPath ], spacing: barWidth } ),
      listener: stepFunction,
      radius: options.radius,
      //left shift the content to center align
      xContentOffset: -options.radius * 0.15
    }, options ) );
    this.enabled = false;

    playProperty.link( function( value ) { stepBackButton.enabled = !value; } );
  }

  return inherit( RoundPushButton, StepBackButton );
} );