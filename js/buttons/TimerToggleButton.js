// Copyright 2013-2019, University of Colorado Boulder

/**
 * Button for toggling timer on and off.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );
  const SimpleClockIcon = require( 'SCENERY_PHET/SimpleClockIcon' );

  // constants
  const WIDTH = 45;
  const HEIGHT = 45;
  const MARGIN = 4;
  const X_STROKE_WIDTH = 6;

  /**
   * @param {Property.<boolean>} timerRunningProperty
   * @param {Object} [options]
   * @constructor
   */
  function TimerToggleButton( timerRunningProperty, options ) {

    // Create the node that represents the timer being on.
    const clockRadius = WIDTH * 0.35;
    const timerOnNode = new SimpleClockIcon( clockRadius );

    // Create the node that represents the timer being off.
    const timerOffNode = new Node();
    const timerOffNodeBackground = new SimpleClockIcon( clockRadius, { opacity: 0.8 } );
    timerOffNode.addChild( timerOffNodeBackground );
    const xNode = new Shape();
    const xNodeWidth = timerOffNode.width * 0.8;
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

    BooleanRectangularToggleButton.call( this, timerOnNode, timerOffNode, timerRunningProperty, merge( {
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