// Copyright 2016-2018, University of Colorado Boulder

/**
 * A flexible keypad that looks somewhat like a calculator or keyboard keypad.
 *
 * @author Aadish Gupta
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var BackspaceIcon = require( 'SCENERY_PHET/BackspaceIcon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Key = require( 'SCENERY_PHET/keypad/Key' );
  var KeyID = require( 'SCENERY_PHET/keypad/KeyID' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberAccumulator = require( 'SCENERY_PHET/keypad/NumberAccumulator' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var DEFAULT_BUTTON_WIDTH = 35;
  var DEFAULT_BUTTON_HEIGHT = 35;
  var DEFAULT_BUTTON_FONT = new PhetFont( { size: 20 } );
  var DEFAULT_BUTTON_COLOR = 'white';
  var PLUS_CHAR = '\u002b';
  var MINUS_CHAR = '\u2212';

  /**
   * @param {Array.<Key>} layout - an array that specifies the keys and the layout, see static instance below for
   * example usage
   * @param {Object} [options]
   * @constructor
   */
  function Keypad( layout, options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {
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
      accumulator: null
    }, options );

    Node.call( this );
    var self = this;

    // @private {function}
    this.keyAccumulator = options.accumulator ? options.accumulator : new NumberAccumulator( options );

    // @public {Property.<Array.<KeyID>>} (read-only) - array of the keys that have been accumulated
    this.accumulatedKeysProperty = this.keyAccumulator.accumulatedKeysProperty;

    // @public {Property.<string>} (read-only) - string representation of the keys that have been accumulated
    this.stringProperty = this.keyAccumulator.stringProperty;

    // @public {Property.<number>} (read-only) - numeric representation of the keys that have been accumulated
    this.valueProperty = this.keyAccumulator.valueProperty;

    // @private {Array.<RectangularPushButton>}
    this.buttonNodes = [];

    // determine number of rows and columns from the input layout
    var numRows = layout.length;
    var numColumns = 0;
    var row;
    var column;

    for ( row = 0; row < numRows; row++ ) {
      if ( layout[ row ].length > numColumns ) {
        numColumns = layout[ row ].length;
      }
    }

    // check last row to see if any button has vertical span more than 1
    var maxVerticalSpan = 1;
    for ( column = 0; column < layout[ numRows - 1 ].length; column++ ) {
      if ( layout[ numRows - 1 ][ column ] && layout[ numRows - 1 ][ column ].verticalSpan > maxVerticalSpan ) {
        maxVerticalSpan = layout[ numRows - 1 ][ column ].verticalSpan;
      }
    }
    numRows += maxVerticalSpan - 1;

    // 2D grid to check for the overlap
    var occupiedLayoutGrid = [];

    for ( row = 0; row < numRows; row++ ) {
      occupiedLayoutGrid[ row ] = [];
      for ( column = 0; column < numColumns; column++ ) {
        occupiedLayoutGrid[ row ][ column ] = 0;
      }
    }

    // interpret the layout specification
    var x;
    var y;
    for ( row = 0; row < layout.length; row++ ) {
      var startRow = row;
      for ( column = 0; column < layout[ row ].length; column++ ) {
        var button = layout[ row ][ column ];
        if ( button ) {
          var startColumn = column +
                            ( column > 0 && layout[ row ][ column - 1 ] ?
                              layout[ row ][ column - 1 ].horizontalSpan - 1 : 0 );
          var verticalSpan = button.verticalSpan;
          var horizontalSpan = button.horizontalSpan;

          // check for overlap between the buttons
          for ( x = startRow; x < ( startRow + verticalSpan ); x++ ) {
            for ( y = startColumn; y < ( startColumn + horizontalSpan ); y++ ) {
              assert && assert( !occupiedLayoutGrid[ x ][ y ], 'keys overlap in the layout' );
              occupiedLayoutGrid[ x ][ y ] = true;
            }
          }

          // create and add the buttons
          var buttonWidth = button.horizontalSpan * options.buttonWidth + ( button.horizontalSpan - 1 ) * options.xSpacing;
          var buttonHeight = button.verticalSpan * options.buttonHeight + ( button.verticalSpan - 1 ) * options.ySpacing;
          var buttonNode = createKeyNode( button, self.keyAccumulator, buttonWidth, buttonHeight, options );
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
   * @returns {RectangularPushButton} keyNode
   */
  function createKeyNode( keyObject, keyAccumulator, width, height, options ) {

    options = _.extend( {
      buttonColor: 'white',
      buttonFont: DEFAULT_BUTTON_FONT
    }, options );

    var content = ( keyObject.label instanceof Node ) ? keyObject.label :
                  new Text( keyObject.label, { font: options.buttonFont } );

    var keyNode = new RectangularPushButton( {
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
      }
    } );
    keyNode.scale( width / keyNode.width, height / keyNode.height );
    return keyNode;
  }

  return inherit( Node, Keypad, {

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
      [ new Key( '7', KeyID.SEVEN ), new Key( '8', KeyID.EIGHT ), new Key( '9', KeyID.NINE ) ],
      [ new Key( '4', KeyID.FOUR ), new Key( '5', KeyID.FIVE ), new Key( '6', KeyID.SIX ) ],
      [ new Key( '1', KeyID.ONE ), new Key( '2', KeyID.TWO ), new Key( '3', KeyID.THREE ) ],
      [ new Key( '0', KeyID.ZERO, { horizontalSpan: 2 } ), new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), KeyID.BACKSPACE ) ]
    ],

    PositiveAndNegativeIntegerLayout: [
      [ new Key( '7', KeyID.SEVEN ), new Key( '8', KeyID.EIGHT ), new Key( '9', KeyID.NINE ) ],
      [ new Key( '4', KeyID.FOUR ), new Key( '5', KeyID.FIVE ), new Key( '6', KeyID.SIX ) ],
      [ new Key( '1', KeyID.ONE ), new Key( '2', KeyID.TWO ), new Key( '3', KeyID.THREE ) ],
      [ new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), KeyID.BACKSPACE ), new Key( '0', KeyID.ZERO ), new Key( PLUS_CHAR + '/' + MINUS_CHAR, KeyID.PLUS_MINUS ) ]
    ],

    PositiveFloatingPointLayout: [
      [ new Key( '7', KeyID.SEVEN ), new Key( '8', KeyID.EIGHT ), new Key( '9', KeyID.NINE ) ],
      [ new Key( '4', KeyID.FOUR ), new Key( '5', KeyID.FIVE ), new Key( '6', KeyID.SIX ) ],
      [ new Key( '1', KeyID.ONE ), new Key( '2', KeyID.TWO ), new Key( '3', KeyID.THREE ) ],
      [ new Key( '.', KeyID.DECIMAL ), new Key( '0', KeyID.ZERO ), new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), KeyID.BACKSPACE ) ]
    ],

    PositiveAndNegativeFloatingPointLayout: [
      [ new Key( '7', KeyID.SEVEN ), new Key( '8', KeyID.EIGHT ), new Key( '9', KeyID.NINE ) ],
      [ new Key( '4', KeyID.FOUR ), new Key( '5', KeyID.FIVE ), new Key( '6', KeyID.SIX ) ],
      [ new Key( '1', KeyID.ONE ), new Key( '2', KeyID.TWO ), new Key( '3', KeyID.THREE ) ],
      [ new Key( '0', KeyID.ZERO, { horizontalSpan: 2 } ), new Key( PLUS_CHAR + '/' + MINUS_CHAR, KeyID.PLUS_MINUS ) ],
      [ new Key( '.', KeyID.DECIMAL ), null, new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), KeyID.BACKSPACE ) ]
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
} );