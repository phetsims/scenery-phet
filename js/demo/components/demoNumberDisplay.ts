// Copyright 2022-2025, University of Colorado Boulder

/**
 * Demo for NumberDisplay
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import HSlider from '../../../../sun/js/HSlider.js';
import NumberDisplay, { NumberDisplayOptions } from '../../NumberDisplay.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import StopwatchNode from '../../StopwatchNode.js';

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
    numberFormatterDependencies: [ SceneryPhetStrings.stopwatchValueUnitsPatternStringProperty ],
    useRichText: true,
    align: 'center'
  } );

  // Test shrinking to fit
  const numberDisplayTimeRichUnits = new NumberDisplay( property, new Range( 0, 10 ), {
    numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
      units: 'hours'
    } ),
    numberFormatterDependencies: [ SceneryPhetStrings.stopwatchValueUnitsPatternStringProperty ],
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