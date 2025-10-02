// Copyright 2013-2025, University of Colorado Boulder

/**
 * Button for toggling timer on and off.
 *
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import Shape from '../../../kite/js/Shape.js';
import optionize, { combineOptions } from '../../../phet-core/js/optionize.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import Path, { PathOptions } from '../../../scenery/js/nodes/Path.js';
import BooleanRectangularToggleButton, { BooleanRectangularToggleButtonOptions } from '../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import SimpleClockIcon from '../SimpleClockIcon.js';

// constants
const WIDTH = 45;
const HEIGHT = 45;
const MARGIN = 4;

type SelfOptions = {
  offIconOptions?: NodeOptions;
};

export type TimerToggleButtonOptions = SelfOptions & BooleanRectangularToggleButtonOptions;

export default class TimerToggleButton extends BooleanRectangularToggleButton {

  public constructor( timerRunningProperty: Property<boolean>, provideOptions?: TimerToggleButtonOptions ) {

    const options = optionize<TimerToggleButtonOptions, SelfOptions, BooleanRectangularToggleButtonOptions>()( {

      // BooleanRectangularToggleButtonOptions
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      minWidth: WIDTH,
      minHeight: HEIGHT,
      xMargin: MARGIN,
      yMargin: MARGIN,
      accessibleNameOn: SceneryPhetFluent.a11y.timerToggleButton.accessibleNameOnStringProperty,
      accessibleNameOff: SceneryPhetFluent.a11y.timerToggleButton.accessibleNameOffStringProperty,
      offIconOptions: {}
    }, provideOptions );

    const clockRadius = WIDTH * 0.35;

    super( timerRunningProperty, createOnIcon( clockRadius ), createOffIcon( clockRadius, options.offIconOptions ), options );
  }
}

/**
 * Creates the icon for the 'on' state. This is a clock icon.
 */
function createOnIcon( clockRadius: number ): Node {
  return new SimpleClockIcon( clockRadius );
}

/**
 * Creates the icon for the 'off' state. This is a clock icon with a red 'X' over it.
 */
function createOffIcon( clockRadius: number, providedOptions: PathOptions ): Node {

  const clockIcon = new SimpleClockIcon( clockRadius, { opacity: 0.8 } );

  const xShapeWidth = clockIcon.width * 0.8;
  const xShape = new Shape()
    .moveTo( 0, 0 )
    .lineTo( xShapeWidth, xShapeWidth )
    .moveTo( 0, xShapeWidth )
    .lineTo( xShapeWidth, 0 );
  const offIcon = new Path( xShape, combineOptions<PathOptions>( {
    stroke: 'red',
    opacity: 0.55,
    lineWidth: 6,
    lineCap: 'round',
    center: clockIcon.center
  }, providedOptions ) );

  return new Node( {
    children: [ clockIcon, offIcon ]
  } );
}

sceneryPhet.register( 'TimerToggleButton', TimerToggleButton );