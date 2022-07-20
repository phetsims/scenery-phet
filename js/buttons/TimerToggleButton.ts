// Copyright 2013-2022, University of Colorado Boulder

/**
 * Button for toggling timer on and off.
 *
 * @author John Blanco
 */

import Property from '../../../axon/js/Property.js';
import { Shape } from '../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import { Node, Path } from '../../../scenery/js/imports.js';
import BooleanRectangularToggleButton, { BooleanRectangularToggleButtonOptions } from '../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import SimpleClockIcon from '../SimpleClockIcon.js';

// constants
const WIDTH = 45;
const HEIGHT = 45;
const MARGIN = 4;

type SelfOptions = EmptySelfOptions;

export type TimerToggleButtonOptions = SelfOptions & BooleanRectangularToggleButtonOptions;

export default class TimerToggleButton extends BooleanRectangularToggleButton {

  public constructor( timerRunningProperty: Property<boolean>, provideOptions?: TimerToggleButtonOptions ) {

    const options = optionize<TimerToggleButtonOptions, SelfOptions, BooleanRectangularToggleButtonOptions>()( {

      // BooleanRectangularToggleButtonOptions
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      minWidth: WIDTH,
      minHeight: HEIGHT,
      xMargin: MARGIN,
      yMargin: MARGIN
    }, provideOptions );

    const clockRadius = WIDTH * 0.35;

    super( timerRunningProperty, createOnIcon( clockRadius ), createOffIcon( clockRadius ), options );
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
function createOffIcon( clockRadius: number ): Node {

  const clockIcon = new SimpleClockIcon( clockRadius, { opacity: 0.8 } );

  const xShapeWidth = clockIcon.width * 0.8;
  const xShape = new Shape()
    .moveTo( 0, 0 )
    .lineTo( xShapeWidth, xShapeWidth )
    .moveTo( 0, xShapeWidth )
    .lineTo( xShapeWidth, 0 );
  const xNode = new Path( xShape, {
    stroke: 'red',
    opacity: 0.55,
    lineWidth: 6,
    lineCap: 'round',
    center: clockIcon.center
  } );

  return new Node( {
    children: [ clockIcon, xNode ]
  } );
}

sceneryPhet.register( 'TimerToggleButton', TimerToggleButton );