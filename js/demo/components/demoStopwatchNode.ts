// Copyright 2022-2023, University of Colorado Boulder

/**
 * Demo for StopwatchNode
 *
 * @author Sam Reid
 */

import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import Stopwatch from '../../Stopwatch.js';
import StopwatchNode from '../../StopwatchNode.js';
import { SunDemoOptions } from '../../../../sun/js/demo/DemosScreenView.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';

export default function demoStopwatchNode( layoutBounds: Bounds2, providedOptions: SunDemoOptions ): Node {

  assert && assert( providedOptions.tandem );
  const tandem = providedOptions.tandem!;

  // Use the same model for all views
  const stopwatch = new Stopwatch( {
    isVisible: true,
    tandem: tandem.createTandem( 'stopwatch' )
  } );

  const stepListener = ( dt: number ) => stopwatch.step( dt );
  stepTimer.addListener( stepListener );

  // StopwatchNode with plain text format MM:SS.CC
  const plainTextStopwatchNode = new StopwatchNode( stopwatch, {
    numberDisplayOptions: {
      numberFormatter: StopwatchNode.PLAIN_TEXT_MINUTES_AND_SECONDS
    },
    tandem: tandem.createTandem( 'stopwatchNodeMMSSCC' )
  } );

  // StopwatchNode with rich format MM:SS.cc and no units
  const richTextStopwatchNode = new StopwatchNode( stopwatch, {
    numberDisplayOptions: {
      numberFormatter: StopwatchNode.RICH_TEXT_MINUTES_AND_SECONDS
    },
    tandem: tandem.createTandem( 'stopwatchNodeMMSScc' )
  } );

  // StopwatchNode with rich text format and dynamic units.
  const unitsProperty = new Property( 'ms' );
  const numberOfDecimalPlaces = 2;
  const customStopwatchNode = new StopwatchNode( stopwatch, {
    backgroundBaseColor: 'red',

    // Supply the formatter on startup as well as on link, so it can detect widest/thinnest text, see NumberDisplay
    numberDisplayOptions: {
      numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
        showAsMinutesAndSeconds: false, // because we're not showing minutes & seconds
        numberOfDecimalPlaces: numberOfDecimalPlaces,
        units: unitsProperty.value
      } )
    },
    scale: 2,
    tandem: tandem.createTandem( 'customStopwatchNode' )
  } );
  unitsProperty.link( units => {
    customStopwatchNode.setNumberFormatter( StopwatchNode.createRichTextNumberFormatter( {
      showAsMinutesAndSeconds: false, // because we're not showing minutes & seconds
      numberOfDecimalPlaces: numberOfDecimalPlaces,
      units: units
    } ) );
  } );

  const unitsRadioButtonGroup = new RectangularRadioButtonGroup( unitsProperty, [
    { value: 'ps', createNode: () => new Text( 'picoseconds' ), tandemName: 'picosecondsRadioButton' },
    { value: 'ms', createNode: () => new Text( 'milliseconds' ), tandemName: 'millisecondsRadioButton' },
    { value: 'fs', createNode: () => new Text( 'femtoseconds' ), tandemName: 'femtosecondsRadioButton' }
  ], {
    spacing: 5,
    tandem: tandem.createTandem( 'unitsRadioButtonGroup' )
  } );

  // Layout
  const vBox = new VBox( {
    align: 'left',
    spacing: 20,
    center: layoutBounds.center,
    children: [
      plainTextStopwatchNode,
      richTextStopwatchNode,
      new HBox( {
        spacing: 20,
        children: [
          customStopwatchNode,
          unitsRadioButtonGroup
        ]
      } )
    ]
  } );

  // Swap out the dispose function for one that also removes the Emitter listener
  const demoDispose = vBox.dispose.bind( vBox );
  vBox.dispose = () => {
    stepTimer.removeListener( stepListener );
    demoDispose();
  };
  return vBox;
}