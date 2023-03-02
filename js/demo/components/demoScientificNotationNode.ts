// Copyright 2022-2023, University of Colorado Boulder

/**
 * Demo for ScientificNotationNode. This also serves as a test harness.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HBox, HSeparator, Node, Text, VBox, VSeparator } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Panel from '../../../../sun/js/Panel.js';
import PhetFont from '../../PhetFont.js';
import Keypad from '../../keypad/Keypad.js';
import ScientificNotationNode from '../../ScientificNotationNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PhetColorScheme from '../../PhetColorScheme.js';

const SCIENTIFIC_NOTATION_FONT = new PhetFont( 30 );
const TITLE_FONT = new PhetFont( { size: 20, weight: 'bold' } );
const CONTROL_FONT = new PhetFont( 14 );
const KEYPAD_FONT = new PhetFont( 20 );

export default function demoScientificNotationNode( layoutBounds: Bounds2 ): Node {

  // Properties related to ScientificNotationNode options
  const mantissaDecimalPlacesProperty = new NumberProperty( 2, {
    numberType: 'Integer',
    range: new Range( 0, 10 )
  } );
  const showIntegersAsMantissaOnlyProperty = new BooleanProperty( false );
  const showZeroAsIntegerProperty = new BooleanProperty( true );
  const exponentProperty = new NumberProperty( 1, {
    numberType: 'Integer',
    range: new Range( 0, 10 )
  } );
  const nullExponentProperty = new BooleanProperty( false );
  const showZeroExponentProperty = new BooleanProperty( false );

  const controlPanel = new ControlPanel( mantissaDecimalPlacesProperty,
    showIntegersAsMantissaOnlyProperty,
    showZeroAsIntegerProperty,
    exponentProperty,
    nullExponentProperty,
    showZeroExponentProperty
  );

  // The value to be displayed in scientific notation
  const valueProperty = new NumberProperty( 0 );

  let scientificNotationNode: Node;
  const scientificNotationNodeParent = new Node();

  // Creates a new ScientificNotationNode instance with the configuration specified in the control panel.
  const apply = () => {

    const keypadString = controlPanel.keypad.stringProperty.value;
    if ( keypadString.length > 0 ) {
      valueProperty.value = parseFloat( keypadString );
    }

    if ( scientificNotationNode ) {
      scientificNotationNode.dispose();
    }
    scientificNotationNode = new ScientificNotationNode( valueProperty, {

      font: SCIENTIFIC_NOTATION_FONT,

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

  // Pressing this button calls apply().
  const applyButton = new RectangularPushButton( {
    content: new Text( 'Apply \u2192', {
      font: new PhetFont( 22 )
    } ),
    baseColor: PhetColorScheme.BUTTON_YELLOW,
    listener: () => apply(),

    // Disable the button if the keypad shows no value.
    enabledProperty: new DerivedProperty( [ controlPanel.keypad.stringProperty ],
      ( keypadString: string ) => ( keypadString.length !== 0 ) )
  } );

  // layout
  return new HBox( {
    spacing: 60,
    children: [ controlPanel, applyButton, scientificNotationNodeParent ],
    left: layoutBounds.left + 40,
    centerY: layoutBounds.centerY
  } );
}

/**
 * This is the control panel for this demo. It contains controls for setting options related to ScientificNotationNode,
 * and a keypad for entering the value to be displayed.
 */
class ControlPanel extends Panel {

  public readonly keypad: Keypad;

  public constructor( mantissaDecimalPlacesProperty: NumberProperty,
                      showIntegersAsMantissaOnlyProperty: Property<boolean>,
                      showZeroAsIntegerProperty: Property<boolean>,
                      exponentProperty: NumberProperty,
                      nullExponentProperty: Property<boolean>,
                      showZeroExponentProperty: Property<boolean> ) {

    const textOptions = {
      font: CONTROL_FONT
    };

    const mantissaControl = new HBox( {
      spacing: 10,
      children: [
        new NumberSpinner( mantissaDecimalPlacesProperty, new Property( mantissaDecimalPlacesProperty.range ) ),
        new Text( 'mantissaDecimalPlaces', textOptions )
      ]
    } );

    const showIntegersAsMantissaOnlyCheckbox = new Checkbox( showIntegersAsMantissaOnlyProperty, new Text( 'showIntegersAsMantissaOnly', textOptions ) );

    const showZeroAsIntegerCheckbox = new Checkbox( showZeroAsIntegerProperty, new Text( 'showZeroAsInteger', textOptions ) );

    const exponentControl = new HBox( {
      spacing: 10,
      children: [
        new NumberSpinner( exponentProperty, new Property( exponentProperty.range ) ),
        new Text( 'exponent', textOptions )
      ]
    } );

    const nullExponentCheckbox = new Checkbox( nullExponentProperty, new Text( 'exponent: null', textOptions ) );
    nullExponentProperty.link( nullExponent => {
      exponentControl.enabled = !nullExponent;
    } );

    const showZeroExponentCheckbox = new Checkbox( showZeroExponentProperty, new Text( 'showZeroExponent', textOptions ) );

    // controls for mantissa options
    const mantissaBox = new VBox( {
      align: 'left',
      spacing: 20,
      children: [
        new Text( 'mantissa options', { font: TITLE_FONT } ),
        mantissaControl,
        showIntegersAsMantissaOnlyCheckbox,
        showZeroAsIntegerCheckbox
      ]
    } );

    // controls for exponent options
    const exponentBox = new VBox( {
      align: 'left',
      spacing: 20,
      children: [
        new Text( 'exponent options', { font: TITLE_FONT } ),
        exponentControl,
        nullExponentCheckbox,
        showZeroExponentCheckbox
      ]
    } );

    const leftContent = new VBox( {
      align: 'left',
      spacing: 20,
      children: [
        mantissaBox,
        new HSeparator(),
        exponentBox
      ]
    } );

    const maxDigits = mantissaDecimalPlacesProperty.range.max + 1;
    const keypad = new Keypad( Keypad.PositiveDecimalLayout, {
      accumulatorOptions: {
        maxDigits: maxDigits,
        maxDigitsRightOfMantissa: maxDigits
      },
      buttonWidth: 35,
      buttonHeight: 35,
      buttonFont: KEYPAD_FONT
    } );

    const keypadValueText = new Text( '', {
      font: KEYPAD_FONT
    } );

    const clearButton = new RectangularPushButton( {
      content: new Text( 'Clear', { font: KEYPAD_FONT } ),
      baseColor: 'white',
      listener: () => keypad.clear(),

      // Disabled if there is no value to clear
      enabledProperty: new DerivedProperty( [ keypad.stringProperty ],
        ( keypadString: string ) => ( keypadString.length !== 0 )
      )
    } );

    const keypadBox = new VBox( {
      align: 'center',
      spacing: 20,
      children: [
        keypadValueText,
        keypad,
        clearButton
      ]
    } );

    keypad.stringProperty.link( ( keypadString: string ) => {
      if ( keypadString.length === 0 ) {
        keypadValueText.string = 'no value';
        keypadValueText.fill = 'red';
      }
      else {
        keypadValueText.string = keypadString;
        keypadValueText.fill = 'black';
      }
    } );

    const content = new HBox( {
      align: 'center',
      spacing: 20,
      children: [ leftContent, new VSeparator(), keypadBox ]
    } );

    super( content, {
      xMargin: 20,
      yMargin: 20
    } );

    this.keypad = keypad;
  }
}