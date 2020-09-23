// Copyright 2013-2020, University of Colorado Boulder

/**
 * Button for toggling timer on and off.
 *
 * @author John Blanco
 */

import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import BooleanRectangularToggleButton from '../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import SimpleClockIcon from '../SimpleClockIcon.js';

// constants
const WIDTH = 45;
const HEIGHT = 45;
const MARGIN = 4;
const X_STROKE_WIDTH = 6;

class TimerToggleButton extends BooleanRectangularToggleButton {

  /**
   * @param {Property.<boolean>} timerRunningProperty
   * @param {Object} [options]
   */
  constructor( timerRunningProperty, options ) {

    options = merge( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      minWidth: WIDTH,
      minHeight: HEIGHT,
      xMargin: MARGIN,
      yMargin: MARGIN
    }, options );

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

    super( timerOnNode, timerOffNode, timerRunningProperty, options );
  }
}

sceneryPhet.register( 'TimerToggleButton', TimerToggleButton );
export default TimerToggleButton;