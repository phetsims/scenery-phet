// Copyright 2016-2020, University of Colorado Boulder

/**
 * A flexible keypad that looks somewhat like a calculator or keyboard keypad.
 *
 * @author Aadish Gupta
 * @author John Blanco
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../tandem/js/Tandem.js';
import BackspaceIcon from '../BackspaceIcon.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';
import Key from './Key.js';
import KeyID from './KeyID.js';
import NumberAccumulator from './NumberAccumulator.js';

// constants
const DEFAULT_BUTTON_WIDTH = 35;
const DEFAULT_BUTTON_HEIGHT = 35;
const DEFAULT_BUTTON_FONT = new PhetFont( { size: 20 } );
const DEFAULT_BUTTON_COLOR = 'white';
const PLUS_CHAR = '\u002b';
const MINUS_CHAR = '\u2212';
const _0 = new Key( '0', KeyID.ZERO );
const _1 = new Key( '1', KeyID.ONE );
const _2 = new Key( '2', KeyID.TWO );
const _3 = new Key( '3', KeyID.THREE );
const _4 = new Key( '4', KeyID.FOUR );
const _5 = new Key( '5', KeyID.FIVE );
const _6 = new Key( '6', KeyID.SIX );
const _7 = new Key( '7', KeyID.SEVEN );
const _8 = new Key( '8', KeyID.EIGHT );
const _9 = new Key( '9', KeyID.NINE );
const WIDE_ZERO = new Key( '0', KeyID.ZERO, { horizontalSpan: 2 } );
const BACKSPACE_KEY = new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), KeyID.BACKSPACE );
const PLUS_MINUS_KEY = new Key( PLUS_CHAR + '/' + MINUS_CHAR, KeyID.PLUS_MINUS );
const DECIMAL_KEY = new Key( '.', KeyID.DECIMAL );

/**
 * @param {Array.<Key>} layout - an array that specifies the keys and the layout, see static instance below for
 * example usage
 * @param {Object} [options]
 * @constructor
 */
function Keypad( layout, options ) {
  options = merge( {
    buttonWidth: DEFAULT_BUTTON_WIDTH,
    buttonHeight: DEFAULT_BUTTON_HEIGHT,
    xSpacing: 10,
    ySpacing: 10,
    touchAreaXDilation: 5,
    touchAreaYDilation: 5,
    buttonColor: DEFAULT_BUTTON_COLOR,
    buttonFont: DEFAULT_BUTTON_FONT,

    // {AbstractAccumulator|null} accumulator that collects and interprets key presses, see various implementations
    // for examples
    accumulator: null,
    tandem: Tandem.REQUIRED
  }, options );

  Node.call( this );
  const self = this;

  // @private {function}
  this.keyAccumulator = options.accumulator ? options.accumulator : new NumberAccumulator( merge( {
    tandem: options.tandem.createTandem( 'numberAccumulator' )
  }, _.omit( options, 'tandem' ) ) );

  // @public {Property.<Array.<KeyID>>} (read-only) - array of the keys that have been accumulated
  this.accumulatedKeysProperty = this.keyAccumulator.accumulatedKeysProperty;

  // @public {Property.<string>} (read-only) - string representation of the keys that have been accumulated
  this.stringProperty = this.keyAccumulator.stringProperty;

  // @public {Property.<number>} (read-only) - numeric representation of the keys that have been accumulated
  this.valueProperty = this.keyAccumulator.valueProperty;

  // @private {Array.<RectangularPushButton>}
  this.buttonNodes = [];

  // determine number of rows and columns from the input layout
  let numRows = layout.length;
  let numColumns = 0;
  let row;
  let column;

  for ( row = 0; row < numRows; row++ ) {
    if ( layout[ row ].length > numColumns ) {
      numColumns = layout[ row ].length;
    }
  }

  // check last row to see if any button has vertical span more than 1
  let maxVerticalSpan = 1;
  for ( column = 0; column < layout[ numRows - 1 ].length; column++ ) {
    if ( layout[ numRows - 1 ][ column ] && layout[ numRows - 1 ][ column ].verticalSpan > maxVerticalSpan ) {
      maxVerticalSpan = layout[ numRows - 1 ][ column ].verticalSpan;
    }
  }
  numRows += maxVerticalSpan - 1;

  // 2D grid to check for the overlap
  const occupiedLayoutGrid = [];

  for ( row = 0; row < numRows; row++ ) {
    occupiedLayoutGrid[ row ] = [];
    for ( column = 0; column < numColumns; column++ ) {
      occupiedLayoutGrid[ row ][ column ] = 0;
    }
  }

  // interpret the layout specification
  let x;
  let y;
  for ( row = 0; row < layout.length; row++ ) {
    const startRow = row;
    for ( column = 0; column < layout[ row ].length; column++ ) {
      const button = layout[ row ][ column ];
      if ( button ) {
        const startColumn = column +
                            ( column > 0 && layout[ row ][ column - 1 ] ?
                              layout[ row ][ column - 1 ].horizontalSpan - 1 : 0 );
        const verticalSpan = button.verticalSpan;
        const horizontalSpan = button.horizontalSpan;

        // check for overlap between the buttons
        for ( x = startRow; x < ( startRow + verticalSpan ); x++ ) {
          for ( y = startColumn; y < ( startColumn + horizontalSpan ); y++ ) {
            assert && assert( !occupiedLayoutGrid[ x ][ y ], 'keys overlap in the layout' );
            occupiedLayoutGrid[ x ][ y ] = true;
          }
        }

        // create and add the buttons
        const buttonWidth = button.horizontalSpan * options.buttonWidth + ( button.horizontalSpan - 1 ) * options.xSpacing;
        const buttonHeight = button.verticalSpan * options.buttonHeight + ( button.verticalSpan - 1 ) * options.ySpacing;
        const buttonNode = createKeyNode( button, self.keyAccumulator, buttonWidth, buttonHeight, options.tandem, options );
        buttonNode.left = startColumn * options.buttonWidth + startColumn * options.xSpacing;
        buttonNode.top = startRow * options.buttonHeight + startRow * options.ySpacing;
        self.buttonNodes.push( buttonNode );
        self.addChild( buttonNode );
      }
    }
  }

  this.mutate( options );
}

sceneryPhet.register( 'Keypad', Keypad );

/**
 * Helper function to create the display key node for the provided key object
 *
 * @param {Key} keyObject
 * @param {AbstractKeyAccumulator} keyAccumulator
 * @param {number} width
 * @param {number} height
 * @param {Object} [options]
 * @param {Tandem} keyPadTandem
 * @returns {RectangularPushButton} keyNode
 */
function createKeyNode( keyObject, keyAccumulator, width, height, keyPadTandem, options ) {

  options = merge( {
    buttonColor: 'white',
    buttonFont: DEFAULT_BUTTON_FONT
  }, options );

  const content = ( keyObject.label instanceof Node ) ? keyObject.label :
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
    listener: function() {
      keyAccumulator.handleKeyPressed( keyObject.identifier );
    },
    tandem: keyPadTandem.createTandem( keyObject.buttonTandemName )
  } );
  keyNode.scale( width / keyNode.width, height / keyNode.height );
  return keyNode;
}

export default inherit( Node, Keypad, {

  /**
   * Calls the clear function for the given accumulator
   * @public
   */
  clear: function() {
    this.keyAccumulator.clear();
  },

  /**
   * Determines whether pressing a key (except for backspace) will clear the existing value.
   * @param {boolean} clearOnNextKeyPress
   * @public
   */
  setClearOnNextKeyPress: function( clearOnNextKeyPress ) {
    this.keyAccumulator.setClearOnNextKeyPress( clearOnNextKeyPress );
  },

  /**
   * Will pressing a key (except for backspace) clear the existing value?
   * @returns {boolean}
   * @public
   */
  getClearOnNextKeyPress: function() {
    return this.keyAccumulator.getClearOnNextKeyPress();
  },

  /**
   * Cleans up references.
   * @public
   */
  dispose: function() {
    this.keyAccumulator.dispose();
    this.buttonNodes.forEach( function( buttonNode ) {
      buttonNode.dispose();
    } );
    Node.prototype.dispose.call( this );
  }
}, {

  //------------------------------------------------------------------------------------------------------------------
  // static keypad layouts - These can be used 'as is' for common layouts or serve as examples for creating custom
  // layouts. If the vertical span is greater than 1, the column in the next row(s) has to be null.  If
  // the horizontal span is greater than 1, the next key in that row will not overlap and will be placed in the next
  // space in the grid. If a blank space is desired, null should be provided.
  //------------------------------------------------------------------------------------------------------------------

  PositiveIntegerLayout: [
    [ _7, _8, _9 ],
    [ _4, _5, _6 ],
    [ _1, _2, _3 ],
    [ WIDE_ZERO, BACKSPACE_KEY ]
  ],

  PositiveAndNegativeIntegerLayout: [
    [ _7, _8, _9 ],
    [ _4, _5, _6 ],
    [ _1, _2, _3 ],
    [ BACKSPACE_KEY, _0, PLUS_MINUS_KEY ]
  ],

  PositiveFloatingPointLayout: [
    [ _7, _8, _9 ],
    [ _4, _5, _6 ],
    [ _1, _2, _3 ],
    [ DECIMAL_KEY, _0, BACKSPACE_KEY ]
  ],

  PositiveAndNegativeFloatingPointLayout: [
    [ _7, _8, _9 ],
    [ _4, _5, _6 ],
    [ _1, _2, _3 ],
    [ WIDE_ZERO, PLUS_MINUS_KEY ],
    [ DECIMAL_KEY, null, BACKSPACE_KEY ]
  ],

  // Weird Layout is created for testing purposes to test the edge cases and layout capabilities
  WeirdLayout: [
    [ new Key( '1', KeyID.ONE ), new Key( '2', KeyID.TWO ), new Key( '3', KeyID.THREE, { horizontalSpan: 3 } ) ],
    [ null, new Key( '4', KeyID.FOUR, { horizontalSpan: 5 } ) ],
    [ new Key( '5', KeyID.FIVE, { verticalSpan: 2 } ), new Key( '6', KeyID.SIX ), new Key( '7', KeyID.SEVEN ) ],
    [ null, new Key( '8', KeyID.EIGHT ), new Key( '9', KeyID.NINE ) ],
    [ null, new Key( '0', KeyID.ZERO, { horizontalSpan: 2, verticalSpan: 2 } ) ]
  ]
} );