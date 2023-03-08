// Copyright 2022-2023, University of Colorado Boulder

/**
 * Demo for Keypad
 */

import Keypad from '../../keypad/Keypad.js';
import PhetFont from '../../PhetFont.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Property from '../../../../axon/js/Property.js';
import Checkbox from '../../../../sun/js/Checkbox.js';

export default function demoKeypad( layoutBounds: Bounds2 ): Node {

  const integerKeyPad = new Keypad( Keypad.PositiveAndNegativeIntegerLayout, {
    buttonWidth: 35,
    buttonHeight: 35,
    accumulatorOptions: {
      maxDigits: 5
    }
  } );

  const integerStringRepresentation = new Text( '', { font: new PhetFont( 24 ) } );
  const integerValueRepresentation = new Text( '', { font: new PhetFont( 24 ) } );

  integerKeyPad.stringProperty.link( value => {
    integerStringRepresentation.string = `string: ${value}`;
  } );

  integerKeyPad.valueProperty.link( value => {
    integerValueRepresentation.string = `number: ${value}`;
  } );

  const integerClearButton = new RectangularPushButton( {
    content: new Text( 'Clear Keypad' ),
    listener: () => integerKeyPad.clear()
  } );

  // For testing clearOnNextKeyPress feature
  const integerClearOnNextKeyPressProperty = new Property( integerKeyPad.getClearOnNextKeyPress() );
  const integerClearOnNextKeyPressCheckbox = new Checkbox( integerClearOnNextKeyPressProperty,
    new Text( 'Clear On Next Key Press' ) );
  integerClearOnNextKeyPressProperty.link(
    clearOnNextKeyPress => integerKeyPad.setClearOnNextKeyPress( clearOnNextKeyPress )
  );

  integerKeyPad.valueProperty.link( value => {
    integerClearOnNextKeyPressProperty.value = integerKeyPad.getClearOnNextKeyPress();
  } );

  const integerVBox = new VBox( {
    spacing: 30,
    resize: false,
    align: 'left',
    children: [
      integerValueRepresentation,
      integerStringRepresentation,
      integerKeyPad,
      integerClearButton,
      integerClearOnNextKeyPressCheckbox
    ]
  } );

  const floatingPointKeyPad = new Keypad( Keypad.PositiveFloatingPointLayout, {
    buttonWidth: 35,
    buttonHeight: 35,
    accumulatorOptions: {
      maxDigits: 4,
      maxDigitsRightOfMantissa: 2
    }
  } );

  const floatingPointStringRepresentation = new Text( '', { font: new PhetFont( 24 ) } );
  const floatingPointValueRepresentation = new Text( '', { font: new PhetFont( 24 ) } );

  floatingPointKeyPad.stringProperty.link( value => {
    floatingPointStringRepresentation.string = `string: ${value}`;
  } );

  floatingPointKeyPad.valueProperty.link( value => {
    floatingPointValueRepresentation.string = `number: ${value}`;
  } );

  const floatingPointClearButton = new RectangularPushButton( {
    content: new Text( 'Clear Keypad' ),
    listener: () => floatingPointKeyPad.clear()
  } );

  // For testing clearOnNextKeyPress feature
  const floatingPointClearOnNextKeyPressProperty = new Property( floatingPointKeyPad.getClearOnNextKeyPress() );
  const floatingPointClearOnNextKeyPressButton = new Checkbox( floatingPointClearOnNextKeyPressProperty, new Text( 'Clear On Next Key Press' ) );
  floatingPointClearOnNextKeyPressProperty.link(
    clearOnNextKeyPress => floatingPointKeyPad.setClearOnNextKeyPress( clearOnNextKeyPress )
  );

  floatingPointKeyPad.valueProperty.link( () => {
    floatingPointClearOnNextKeyPressProperty.value = floatingPointKeyPad.getClearOnNextKeyPress();
  } );

  const floatingPointVBox = new VBox( {
    spacing: 30,
    resize: false,
    align: 'left',
    children: [
      floatingPointValueRepresentation,
      floatingPointStringRepresentation,
      floatingPointKeyPad,
      floatingPointClearButton,
      floatingPointClearOnNextKeyPressButton
    ]
  } );

  const positiveAndNegativeFloatingPointKeyPad = new Keypad( Keypad.PositiveAndNegativeFloatingPointLayout, {
    buttonWidth: 35,
    buttonHeight: 35,
    accumulatorOptions: {
      maxDigits: 4,
      maxDigitsRightOfMantissa: 2
    }
  } );

  const positiveAndNegativeFloatingPointStringRepresentation = new Text( '', { font: new PhetFont( 24 ) } );
  const positiveAndNegativeFloatingPointValueRepresentation = new Text( '', { font: new PhetFont( 24 ) } );

  positiveAndNegativeFloatingPointKeyPad.stringProperty.link( value => {
    positiveAndNegativeFloatingPointStringRepresentation.string = `string: ${value}`;
  } );

  positiveAndNegativeFloatingPointKeyPad.valueProperty.link( value => {
    positiveAndNegativeFloatingPointValueRepresentation.string = `number: ${value}`;
  } );

  const positiveAndNegativeFloatingPointClearButton = new RectangularPushButton( {
    content: new Text( 'Clear Keypad' ),
    listener: () => positiveAndNegativeFloatingPointKeyPad.clear()
  } );

  // For testing clearOnNextKeyPress feature
  const positiveAndNegativeFloatingPointClearOnNextKeyPressProperty = new Property(
    positiveAndNegativeFloatingPointKeyPad.getClearOnNextKeyPress()
  );
  const positiveAndNegativeFloatingPointClearOnNextKeyPressCheckbox = new Checkbox( positiveAndNegativeFloatingPointClearOnNextKeyPressProperty, new Text( 'Clear On Next Key Press' ) );

  function handlePositiveAndNegativeFloatingPointClearOnNextKeyPressChanged( clearOnNextKeyPress: boolean ): void {
    positiveAndNegativeFloatingPointKeyPad.setClearOnNextKeyPress( clearOnNextKeyPress );
  }

  positiveAndNegativeFloatingPointClearOnNextKeyPressProperty.link(
    handlePositiveAndNegativeFloatingPointClearOnNextKeyPressChanged
  );

  positiveAndNegativeFloatingPointKeyPad.valueProperty.link( () => {
    positiveAndNegativeFloatingPointClearOnNextKeyPressProperty.value =
      positiveAndNegativeFloatingPointKeyPad.getClearOnNextKeyPress();
  } );

  // create and add a button that will remove the keypad from the screen - this exists to test dispose
  const removeKeypadFromScreenButton = new RectangularPushButton( {
    content: new Text( 'Remove Keypad (tests dispose)' ),
    baseColor: '#73DC69',
    listener: () => {
      positiveAndNegativeFloatingPointKeyPad.clear();
      positiveAndNegativeFloatingPointVBox.removeChild( positiveAndNegativeFloatingPointKeyPad );
      positiveAndNegativeFloatingPointKeyPad.dispose();
      positiveAndNegativeFloatingPointVBox.removeChild( positiveAndNegativeFloatingPointClearButton );
      positiveAndNegativeFloatingPointClearButton.dispose();
      positiveAndNegativeFloatingPointVBox.removeChild( positiveAndNegativeFloatingPointClearOnNextKeyPressCheckbox );
      positiveAndNegativeFloatingPointClearOnNextKeyPressCheckbox.dispose();
      positiveAndNegativeFloatingPointVBox.removeChild( removeKeypadFromScreenButton );
      removeKeypadFromScreenButton.dispose();
    }
  } );

  const positiveAndNegativeFloatingPointVBox = new VBox( {
    spacing: 30,
    resize: false,
    align: 'left',
    children: [
      positiveAndNegativeFloatingPointValueRepresentation,
      positiveAndNegativeFloatingPointStringRepresentation,
      positiveAndNegativeFloatingPointKeyPad,
      positiveAndNegativeFloatingPointClearButton,
      positiveAndNegativeFloatingPointClearOnNextKeyPressCheckbox,
      removeKeypadFromScreenButton
    ]
  } );

  return new HBox( {
    spacing: 50,
    resize: false,
    children: [
      integerVBox,
      floatingPointVBox,
      positiveAndNegativeFloatingPointVBox
    ],
    center: layoutBounds.center
  } );

}