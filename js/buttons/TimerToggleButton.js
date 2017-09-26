// Copyright 2013-2017, University of Colorado Boulder

/**
 * Button for toggling timer on and off.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var SimpleClockIcon = require( 'SCENERY_PHET/SimpleClockIcon' );

  // constants
  var WIDTH = 45;
  var HEIGHT = 45;
  var MARGIN = 4;
  var X_STROKE_WIDTH = 6;

  /**
   * @param {Property.<boolean>} timerRunningProperty
   * @param {Object} [options]
   * @constructor
   */
  function TimerToggleButton( timerRunningProperty, options ) {

    // Create the node that represents the timer being on.
    var clockRadius = WIDTH * 0.35;
    var timerOnNode = new SimpleClockIcon( clockRadius );

    // Create the node that represents the timer being off.
    var timerOffNode = new Node();
    var timerOffNodeBackground = new SimpleClockIcon( clockRadius, { opacity: 0.8 } );
    timerOffNode.addChild( timerOffNodeBackground );
    var xNode = new Shape();
    var xNodeWidth = timerOffNode.width * 0.8;
    xNode.moveTo( 0, 0 );
    xNode.lineTo( xNodeWidth, xNodeWidth );
    xNode.moveTo( 0, xNodeWidth );
    xNode.lineTo( xNodeWidth, 0 );
    timerOffNode.addChild( new Path( xNode, {
      stroke: 'red',
      opacity: 0.55,
      lineWidth: X_STROKE_WIDTH,
      lineCap: 'round',
      centerX: timerOffNode.width / 2,
      centerY: timerOffNode.height / 2
    } ) );

    BooleanRectangularToggleButton.call( this, timerOnNode, timerOffNode, timerRunningProperty, _.extend( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      minWidth: WIDTH,
      minHeight: HEIGHT,
      xMargin: MARGIN,
      yMargin: MARGIN
    }, options ) );
  }

  sceneryPhet.register( 'TimerToggleButton', TimerToggleButton );

  return inherit( BooleanRectangularToggleButton, TimerToggleButton );
} );