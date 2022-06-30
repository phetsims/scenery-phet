// Copyright 2022, University of Colorado Boulder

/**
 * Demo for NumberDisplay
 */

import NumberDisplay, { NumberDisplayOptions } from '../../NumberDisplay.js';
import StopwatchNode from '../../StopwatchNode.js';
import { Node, VBox } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import HSlider from '../../../../sun/js/HSlider.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

export default function demoNumberDisplay( layoutBounds: Bounds2 ): Node {

  const range = new Range( 0, 1000 );

  // Options for both NumberDisplay instances
  const numberDisplayOptions: NumberDisplayOptions = {
    valuePattern: '{{value}} K',
    align: 'right'
  };

  // To demonstrate 'no value' options
  const noValueDisplay = new NumberDisplay( new Property( null ), range,
    combineOptions<NumberDisplayOptions>( {}, numberDisplayOptions, {
      noValueAlign: 'center',
      noValuePattern: '{{value}}'
    } ) );

  // To demonstrate numeric value display
  const property = new NumberProperty( 1 );

  const numberDisplay = new NumberDisplay( property, range, numberDisplayOptions );
  const numberDisplayTime = new NumberDisplay( property, range, {
    numberFormatter: StopwatchNode.PLAIN_TEXT_MINUTES_AND_SECONDS,
    align: 'center'
  } );
  const numberDisplayTimeRich = new NumberDisplay( property, range, {
    numberFormatter: StopwatchNode.RICH_TEXT_MINUTES_AND_SECONDS,
    useRichText: true,
    align: 'center'
  } );

  // Test shrinking to fit
  const numberDisplayTimeRichUnits = new NumberDisplay( property, new Range( 0, 10 ), {
    numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
      units: 'hours'
    } ),
    useRichText: true,
    align: 'center'
  } );
  const slider = new HSlider( property, range, {
    trackSize: new Dimension2( 400, 5 )
  } );

  return new VBox( {
    spacing: 30,
    children: [ noValueDisplay, numberDisplay, numberDisplayTime, numberDisplayTimeRich, numberDisplayTimeRichUnits, slider ],
    center: layoutBounds.center
  } );
}