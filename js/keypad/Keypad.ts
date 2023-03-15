// Copyright 2016-2023, University of Colorado Boulder

/**
 * A flexible keypad that looks somewhat like a calculator or keyboard keypad.
 *
 * @author Aadish Gupta
 * @author John Blanco
 */

import merge from '../../../phet-core/js/merge.js';
import optionize from '../../../phet-core/js/optionize.js';
import type { OneKeyStroke } from '../../../scenery/js/imports.js';
import { Font, KeyboardListener, Node, NodeOptions, Text, TPaint } from '../../../scenery/js/imports.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../tandem/js/Tandem.js';
import BackspaceIcon from '../BackspaceIcon.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';
import Key from './Key.js';
import KeyID, { KeyIDValue } from './KeyID.js';
import NumberAccumulator, { NumberAccumulatorOptions } from './NumberAccumulator.js';
import AbstractKeyAccumulator from './AbstractKeyAccumulator.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';

// constants
const DEFAULT_BUTTON_WIDTH = 35;
const DEFAULT_BUTTON_HEIGHT = 35;
const DEFAULT_BUTTON_FONT = new PhetFont( { size: 20 } );
const DEFAULT_BUTTON_COLOR = 'white';
const PLUS_CHAR = '\u002b';
const MINUS_CHAR = '\u2212';
const _0 = new Key( '0', KeyID.ZERO, { keyboardIdentifiers: [ '0', 'Numpad0' ] } );
const _1 = new Key( '1', KeyID.ONE, { keyboardIdentifiers: [ '1', 'Numpad1' ] } );
const _2 = new Key( '2', KeyID.TWO, { keyboardIdentifiers: [ '2', 'Numpad2' ] } );
const _3 = new Key( '3', KeyID.THREE, { keyboardIdentifiers: [ '3', 'Numpad3' ] } );
const _4 = new Key( '4', KeyID.FOUR, { keyboardIdentifiers: [ '4', 'Numpad4' ] } );
const _5 = new Key( '5', KeyID.FIVE, { keyboardIdentifiers: [ '5', 'Numpad5' ] } );
const _6 = new Key( '6', KeyID.SIX, { keyboardIdentifiers: [ '6', 'Numpad6' ] } );
const _7 = new Key( '7', KeyID.SEVEN, { keyboardIdentifiers: [ '7', 'Numpad7' ] } );
const _8 = new Key( '8', KeyID.EIGHT, { keyboardIdentifiers: [ '8', 'Numpad8' ] } );
const _9 = new Key( '9', KeyID.NINE, { keyboardIdentifiers: [ '9', 'Numpad9' ] } );
const WIDE_ZERO = new Key( '0', KeyID.ZERO, { horizontalSpan: 2, keyboardIdentifiers: [ '0', 'Numpad0' ] } );
const DECIMAL = new Key( '.', KeyID.DECIMAL, { keyboardIdentifiers: [ 'period', 'NumpadDecimal' ] } );
const BACKSPACE = new Key( ( new BackspaceIcon( { scale: 1.5 } ) ),
  KeyID.BACKSPACE, { keyboardIdentifiers: [ 'backspace' ] } );
const PLUS_MINUS = new Key( `${PLUS_CHAR}/${MINUS_CHAR}`, KeyID.PLUS_MINUS, {
  keyboardIdentifiers: [ 'minus', 'plus', 'NumpadSubtract', 'NumpadAdd' ]
} );

export type KeypadLayout = ( Key | null )[][];

type SelfOptions = {
  buttonWidth?: number;
  buttonHeight?: number;
  xSpacing?: number;
  ySpacing?: number;
  touchAreaXDilation?: number;
  touchAreaYDilation?: number;
  buttonColor?: TPaint;
  buttonFont?: Font;

  // Accumulator that collects and interprets key presses, see various implementations for examples. If provided, this
  // will be disposed with this Keypad
  accumulator?: AbstractKeyAccumulator | null;

  // Options passed to NumberAccumulator, ignored if options.accumulator is provided
  accumulatorOptions?: NumberAccumulatorOptions | null;

  // phet-io
  tandem?: Tandem;
  tandemNameSuffix?: string;
};

export type KeypadOptions = SelfOptions & NodeOptions;
type KeyboardKeys = {
  [K in OneKeyStroke]?: Key;
};

class Keypad extends Node {

  private readonly keyAccumulator: AbstractKeyAccumulator;

  // array of the keys that have been accumulated
  public readonly accumulatedKeysProperty: ReadOnlyProperty<KeyIDValue[]>;

  // string representation of the keys that have been accumulated
  public readonly stringProperty: ReadOnlyProperty<string>;

  // numeric representation of the keys that have been accumulated, null if no keys have been accumulated
  public readonly valueProperty: ReadOnlyProperty<number | null>;

  private readonly buttonNodes: RectangularPushButton[];

  /**
   * @param layout - an array that specifies the keys and the layout, see static instance below for example usage
   * @param [providedOptions]
   */
  public constructor( layout: ( Key | null )[][], providedOptions?: KeypadOptions ) {

    const options = optionize<KeypadOptions, SelfOptions, NodeOptions>()( {
      buttonWidth: DEFAULT_BUTTON_WIDTH,
      buttonHeight: DEFAULT_BUTTON_HEIGHT,
      xSpacing: 10,
      ySpacing: 10,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      buttonColor: DEFAULT_BUTTON_COLOR,
      buttonFont: DEFAULT_BUTTON_FONT,
      accumulator: null,
      accumulatorOptions: null,
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'Keypad',
      tagName: 'div',
      ariaLabel: 'Keypad',
      focusable: true
    }, providedOptions );

    super();

    this.keyAccumulator = options.accumulator ? options.accumulator : new NumberAccumulator( merge( {
      tandem: options.tandem.createTandem( 'numberAccumulator' )
    }, options.accumulatorOptions ) );

    this.accumulatedKeysProperty = this.keyAccumulator.accumulatedKeysProperty;
    this.stringProperty = this.keyAccumulator.stringProperty;
    this.valueProperty = this.keyAccumulator.valueProperty;

    this.buttonNodes = [];

    // determine number of rows and columns from the input layout
    let numRows = layout.length;
    let numColumns = 0;

    for ( let row = 0; row < numRows; row++ ) {
      if ( layout[ row ].length > numColumns ) {
        numColumns = layout[ row ].length;
      }
    }

    // check last row to see if any button has vertical span more than 1
    let maxVerticalSpan = 1;
    for ( let column = 0; column < layout[ numRows - 1 ].length; column++ ) {
      const key = layout[ numRows - 1 ][ column ];

      if ( key && key.verticalSpan > maxVerticalSpan ) {
        maxVerticalSpan = key.verticalSpan;
      }
    }
    numRows += maxVerticalSpan - 1;

    // 2D grid to check for the overlap
    const occupiedLayoutGrid: ( boolean | number )[][] = [];

    for ( let row = 0; row < numRows; row++ ) {
      occupiedLayoutGrid[ row ] = [];
      for ( let column = 0; column < numColumns; column++ ) {
        occupiedLayoutGrid[ row ][ column ] = 0;
      }
    }

    const keyboardKeys: KeyboardKeys = {};

    // interpret the layout specification
    for ( let row = 0; row < layout.length; row++ ) {
      const startRow = row;
      for ( let column = 0; column < layout[ row ].length; column++ ) {
        const key = layout[ row ][ column ];
        if ( key ) {
          for ( let i = 0; i < key.keyboardIdentifiers.length; i++ ) {
            const keyboardIdentifier = key.keyboardIdentifiers[ i ];
            assert && assert( !keyboardKeys.hasOwnProperty( keyboardIdentifier ), 'Keypad has already registered key for keyboard input: ' + keyboardIdentifier );
            keyboardKeys[ keyboardIdentifier ] = key;
          }

          const keyBefore = layout[ row ][ column - 1 ];
          const startColumn = column +
                              ( column > 0 && keyBefore ?
                                keyBefore.horizontalSpan - 1 : 0 );
          const verticalSpan = key.verticalSpan;
          const horizontalSpan = key.horizontalSpan;

          // check for overlap between the buttons
          for ( let x = startRow; x < ( startRow + verticalSpan ); x++ ) {
            for ( let y = startColumn; y < ( startColumn + horizontalSpan ); y++ ) {
              assert && assert( !occupiedLayoutGrid[ x ][ y ], 'keys overlap in the layout' );
              occupiedLayoutGrid[ x ][ y ] = true;
            }
          }

          // create and add the buttons
          const buttonWidth = key.horizontalSpan * options.buttonWidth + ( key.horizontalSpan - 1 ) * options.xSpacing;
          const buttonHeight = key.verticalSpan * options.buttonHeight + ( key.verticalSpan - 1 ) * options.ySpacing;
          const buttonNode = createKeyNode( key, this.keyAccumulator, buttonWidth, buttonHeight, options.tandem, options );
          buttonNode.left = startColumn * options.buttonWidth + startColumn * options.xSpacing;
          buttonNode.top = startRow * options.buttonHeight + startRow * options.ySpacing;
          this.buttonNodes.push( buttonNode );
          this.addChild( buttonNode );
        }
      }
    }

    const keyboardListener = new KeyboardListener( {
      keys: Object.keys( keyboardKeys ),
      allowOtherKeys: true,
      callback: ( sceneryEvent, listener ) => {
        const keyObject = keyboardKeys[ listener.keysPressed! ];
        this.keyAccumulator.handleKeyPressed( keyObject!.identifier );
      }
    } );
    this.addInputListener( keyboardListener );
    this.disposeEmitter.addListener( () => keyboardListener.dispose() );

    this.stringProperty.link( string => {
      this.innerContent = string; // show current value in the PDOM
    } );

    this.mutate( options );
  }

  /**
   * Calls the clear function for the given accumulator
   */
  public clear(): void {
    this.keyAccumulator.clear();
  }

  /**
   * Determines whether pressing a key (except for backspace) will clear the existing value.
   */
  public setClearOnNextKeyPress( clearOnNextKeyPress: boolean ): void {
    this.keyAccumulator.setClearOnNextKeyPress( clearOnNextKeyPress );
  }

  /**
   * Will pressing a key (except for backspace) clear the existing value?
   */
  public getClearOnNextKeyPress(): boolean {
    return this.keyAccumulator.getClearOnNextKeyPress();
  }

  public override dispose(): void {
    this.keyAccumulator.dispose();
    this.buttonNodes.forEach( buttonNode => buttonNode.dispose() );
    super.dispose();
  }

  //------------------------------------------------------------------------------------------------------------------
  // static keypad layouts - These can be used 'as is' for common layouts or serve as examples for creating custom
  // layouts. If the vertical span is greater than 1, the column in the next row(s) has to be null.  If
  // the horizontal span is greater than 1, the next key in that row will not overlap and will be placed in the next
  // space in the grid. If a blank space is desired, null should be provided.
  //------------------------------------------------------------------------------------------------------------------

  public static readonly PositiveIntegerLayout: KeypadLayout = [
    [ _7, _8, _9 ],
    [ _4, _5, _6 ],
    [ _1, _2, _3 ],
    [ WIDE_ZERO, BACKSPACE ]
  ];

  public static readonly PositiveDecimalLayout: KeypadLayout = [
    [ _7, _8, _9 ],
    [ _4, _5, _6 ],
    [ _1, _2, _3 ],
    [ DECIMAL, _0, BACKSPACE ]
  ];

  public static readonly PositiveAndNegativeIntegerLayout: KeypadLayout = [
    [ _7, _8, _9 ],
    [ _4, _5, _6 ],
    [ _1, _2, _3 ],
    [ BACKSPACE, _0, PLUS_MINUS ]
  ];

  public static readonly PositiveFloatingPointLayout: KeypadLayout = [
    [ _7, _8, _9 ],
    [ _4, _5, _6 ],
    [ _1, _2, _3 ],
    [ DECIMAL, _0, BACKSPACE ]
  ];

  public static readonly PositiveAndNegativeFloatingPointLayout: KeypadLayout = [
    [ _7, _8, _9 ],
    [ _4, _5, _6 ],
    [ _1, _2, _3 ],
    [ WIDE_ZERO, PLUS_MINUS ],
    [ DECIMAL, null, BACKSPACE ]
  ];

  // Weird Layout is created for testing purposes to test the edge cases and layout capabilities
  public static readonly WeirdLayout: KeypadLayout = [
    [ new Key( '1', KeyID.ONE ), new Key( '2', KeyID.TWO ), new Key( '3', KeyID.THREE, { horizontalSpan: 3 } ) ],
    [ null, new Key( '4', KeyID.FOUR, { horizontalSpan: 5 } ) ],
    [ new Key( '5', KeyID.FIVE, { verticalSpan: 2 } ), new Key( '6', KeyID.SIX ), new Key( '7', KeyID.SEVEN ) ],
    [ null, new Key( '8', KeyID.EIGHT ), new Key( '9', KeyID.NINE ) ],
    [ null, new Key( '0', KeyID.ZERO, { horizontalSpan: 2, verticalSpan: 2 } ) ]
  ];

  public static readonly KEY_0 = _0;
  public static readonly KEY_1 = _1;
  public static readonly KEY_2 = _2;
  public static readonly KEY_3 = _3;
  public static readonly KEY_4 = _4;
  public static readonly KEY_5 = _5;
  public static readonly KEY_6 = _6;
  public static readonly KEY_7 = _7;
  public static readonly KEY_8 = _8;
  public static readonly KEY_9 = _9;
  public static readonly KEY_WIDE_ZERO = WIDE_ZERO;
  public static readonly KEY_DECIMAL = DECIMAL;
  public static readonly KEY_BACKSPACE = BACKSPACE;
  public static readonly KEY_PLUS_MINUS = PLUS_MINUS;
}

/**
 * Helper function to create the display key node for the provided key object
 */
function createKeyNode(
  keyObject: Key,
  keyAccumulator: AbstractKeyAccumulator,
  width: number,
  height: number,
  keyPadTandem: Tandem,
  options: PickRequired<SelfOptions, 'buttonColor' | 'buttonFont' | 'touchAreaXDilation' | 'touchAreaYDilation'>
): RectangularPushButton {

  // Wrapping the keyObject's label so that we're not DAG'ing this badly and causing infinite loops
  const content = ( keyObject.label instanceof Node ) ? new Node( { children: [ keyObject.label ] } ) :
                  new Text( keyObject.label, { font: options.buttonFont } );

  const keyNode = new RectangularPushButton( {
    content: content,
    baseColor: options.buttonColor,
    touchAreaXDilation: options.touchAreaXDilation,
    touchAreaYDilation: options.touchAreaYDilation,
    minWidth: width,
    minHeight: height,
    xMargin: 5,
    yMargin: 5,
    listener: () => keyAccumulator.handleKeyPressed( keyObject.identifier ),

    // pdom
    // alt input is handled as a whole keypad, so remove these individual keys from the keypad if covered by the KeyboardListener.
    tagName: keyObject.keyboardIdentifiers.length === 0 ? 'button' : null, // Duplicated tagName with `ButtonNode`

    // phet-io
    tandem: keyPadTandem.createTandem( keyObject.buttonTandemName )
  } );
  keyNode.dispose = function() {
    // Release the reference to the key
    content.dispose();

    RectangularPushButton.prototype.dispose.call( this );
  };
  keyNode.scale( width / keyNode.width, height / keyNode.height );
  return keyNode;
}

sceneryPhet.register( 'Keypad', Keypad );
export default Keypad;