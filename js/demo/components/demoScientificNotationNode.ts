// Copyright 2022, University of Colorado Boulder

/**
 * Demo for ScientificNotationNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Panel from '../../../../sun/js/Panel.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import VSeparator from '../../../../sun/js/VSeparator.js';
import PhetFont from '../../PhetFont.js';
import Keypad from '../../keypad/Keypad.js';
import ScientificNotationNode from '../../ScientificNotationNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';

export default function demoScientificNotationNode( layoutBounds: Bounds2 ) {

  const textOptions = {
    font: new PhetFont( 14 )
  };

  const mantissaRange = new Range( 0, 10 );
  const mantissaDecimalPlacesProperty = new NumberProperty( 2, {
    numberType: 'Integer',
    range: mantissaRange
  } );
  const mantissaControl = new HBox( {
    spacing: 10,
    children: [
      new NumberSpinner( mantissaDecimalPlacesProperty, new Property( mantissaRange ) ),
      new Text( 'mantissaDecimalPlaces', textOptions )
    ]
  } );

  const showIntegersAsMantissaOnlyProperty = new BooleanProperty( false );
  const showIntegersAsMantissaOnlyCheckbox = new Checkbox( showIntegersAsMantissaOnlyProperty, new Text( 'showIntegersAsMantissaOnly', textOptions ) );

  const showZeroAsIntegerProperty = new BooleanProperty( true );
  const showZeroAsIntegerCheckbox = new Checkbox( showZeroAsIntegerProperty, new Text( 'showZeroAsInteger', textOptions ) );

  const exponentRange = new Range( 0, 10 );
  const exponentProperty = new NumberProperty( 1, {
    numberType: 'Integer',
    range: exponentRange
  } );
  const exponentControl = new HBox( {
    spacing: 10,
    children: [
      new NumberSpinner( exponentProperty, new Property( exponentRange ) ),
      new Text( 'exponent', textOptions )
    ]
  } );

  const nullExponentProperty = new BooleanProperty( false );
  const nullExponentCheckbox = new Checkbox( nullExponentProperty, new Text( 'exponent: null', textOptions ) );
  nullExponentProperty.link( nullExponent => {
    exponentControl.enabled = !nullExponent;
  } );

  const showZeroExponentProperty = new BooleanProperty( false );
  const showZeroExponentCheckbox = new Checkbox( showZeroExponentProperty, new Text( 'showZeroExponent', textOptions ) );

  const titleFont = new PhetFont( { size: 20, weight: 'bold' } );

  // controls for mantissa
  const mantissaBox = new VBox( {
    align: 'left',
    spacing: 20,
    children: [
      new Text( 'mantissa options', { font: titleFont } ),
      mantissaControl,
      showIntegersAsMantissaOnlyCheckbox,
      showZeroAsIntegerCheckbox
    ]
  } );

  // controls for exponent
  const exponentBox = new VBox( {
    align: 'left',
    spacing: 20,
    children: [
      new Text( 'exponent options', { font: titleFont } ),
      exponentControl,
      nullExponentCheckbox,
      showZeroExponentCheckbox
    ]
  } );

  const hSeparatorWidth = Math.max( mantissaBox.width, exponentBox.width );
  const leftContent = new VBox( {
    align: 'left',
    spacing: 20,
    children: [
      mantissaBox,
      new HSeparator( hSeparatorWidth ),
      exponentBox
    ]
  } );

  const numberFont = new PhetFont( 20 );

  const maxDigits = mantissaRange.max + 1;
  const keypad = new Keypad( Keypad.PositiveDecimalLayout, {
    accumulatorOptions: {
      maxDigits: maxDigits,
      maxDigitsRightOfMantissa: maxDigits
    },
    minButtonWidth: 35,
    minButtonHeight: 35,
    buttonFont: new PhetFont( 20 )
  } );

  const keypadValueText = new Text( '', {
    font: numberFont
  } );

  const valueProperty = new NumberProperty( 0 );

  const clearButton = new RectangularPushButton( {
    content: new Text( 'Clear', textOptions ),
    listener: () => keypad.clear()
  } );

  const keypadBox = new VBox( {
    align: 'center',
    spacing: 20,
    children: [
      new Text( 'value', { font: titleFont } ),
      keypadValueText,
      keypad,
      clearButton
    ]
  } );

  const vSeparatorHeight = Math.max( leftContent.height, keypadBox.height );
  const controlPanelContent = new HBox( {
    align: 'center',
    spacing: 20,
    children: [ leftContent, new VSeparator( vSeparatorHeight ), keypadBox ]
  } );

  const controlPanel = new Panel( controlPanelContent, {
    xMargin: 20,
    yMargin: 20
  } );

  let scientificNotationNode: Node;
  const scientificNotationNodeParent = new Node();

  const apply = () => {

    const keypadString = keypad.stringProperty.value;
    if ( keypadString.length > 0 ) {
      valueProperty.value = parseFloat( keypadString );
    }

    if ( scientificNotationNode ) {
      scientificNotationNode.dispose();
    }
    scientificNotationNode = new ScientificNotationNode( valueProperty, {

      font: numberFont,

      // mantissa
      mantissaDecimalPlaces: mantissaDecimalPlacesProperty.value,
      showZeroAsInteger: showZeroAsIntegerProperty.value,
      showIntegersAsMantissaOnly: showIntegersAsMantissaOnlyProperty.value,

      // exponent
      exponent: ( nullExponentProperty.value ) ? null : exponentProperty.value,
      showZeroExponent: showZeroExponentProperty.value
    } );
    scientificNotationNodeParent.children = [ scientificNotationNode ];
  };
  apply();

  const applyButton = new RectangularPushButton( {
    content: new Text( 'Apply \u2192', {
      font: new PhetFont( 22 )
    } ),
    listener: () => apply()
  } );

  keypad.stringProperty.link( ( keypadString: string ) => {
    const keypadIsEmpty = ( keypadString.length === 0 );
    keypadValueText.text = keypadIsEmpty ? 'no value' : keypadString;
    applyButton.enabled = !keypadIsEmpty;
  } );

  // layout
  return new HBox( {
    spacing: 60,
    children: [ controlPanel, applyButton, scientificNotationNodeParent ],
    left: layoutBounds.left + 40,
    centerY: layoutBounds.centerY
  } );
}