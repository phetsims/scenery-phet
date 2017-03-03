// Copyright 2016, University of Colorado Boulder

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
  var NumberAccumulator = require( 'SCENERY_PHET/keypad/NumberAccumulator' );
  var Key = require( 'SCENERY_PHET/keypad/Key' );
  var Keys = require( 'SCENERY_PHET/keypad/Keys' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Tandem = require( 'TANDEM/Tandem' );

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
      buttonColor: DEFAULT_BUTTON_COLOR,
      buttonFont: DEFAULT_BUTTON_FONT,
      accumulator: null
    }, options );

    Node.call( this );
    var self = this;

    // @private
    if ( options.accumulator ) {
      this.keyAccumulator = options.accumulator;
    }
    else {
      this.keyAccumulator = new NumberAccumulator( options );
    }

    this.stringProperty = this.keyAccumulator.stringProperty; // @public (read-only)
    this.valueProperty = this.keyAccumulator.valueProperty; // @public (read-only)
    this.accumulatedKeysProperty = this.keyAccumulator.accumulatedKeysProperty; // @public (read-only)

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

    var content = ( keyObject.displayNode instanceof Node ) ?
                  keyObject.displayNode :
                  new Text( keyObject.displayNode, { font: options.buttonFont } );

    var keyNode = new RectangularPushButton( {
      content: content,
      baseColor: options.buttonColor,
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
    }

  }, {

    // -------------------- static common layouts -------------------------

    /**
     * Layout Specifications for creating your custom layout
     * If Vertical Span greater than 1 is provided the column in the next rows has to be null else it will hit assertion
     * for overlap
     * If Horizontal Span greater than 1 is provided the next key in that row will not overlap and start after the row
     * If you want blank spaces in the row you would need to provide null
     */

    PositiveIntegerLayout: [
      [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
      [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
      [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
      [ new Key( '0', Keys.ZERO, { horizontalSpan: 2 } ), new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), Keys.BACKSPACE ) ]
    ],

    PositiveAndNegativeIntegerLayout: [
      [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
      [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
      [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
      [ new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), Keys.BACKSPACE ), new Key( '0', Keys.ZERO ), new Key( PLUS_CHAR + '/' + MINUS_CHAR, Keys.PLUSMINUS ) ]
    ],

    PositiveFloatingPointLayout: [
      [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
      [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
      [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
      [ new Key( '.', Keys.DECIMAL ), new Key( '0', Keys.ZERO ), new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), Keys.BACKSPACE ) ]
    ],

    PositiveAndNegativeFloatingPointLayout: [
      [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
      [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
      [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
      [ new Key( '0', Keys.ZERO, { horizontalSpan: 2 } ), new Key( PLUS_CHAR + '/' + MINUS_CHAR, Keys.PLUSMINUS ) ],
      [ new Key( '.', Keys.DECIMAL ), null, new Key( ( new BackspaceIcon( { scale: 1.5 } ) ), Keys.BACKSPACE ) ]
    ],

    // Weird Layout is created for testing purposes to test the edge cases and layout capabilities
    WeirdLayout: [
      [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE, { horizontalSpan: 3 } ) ],
      [ null, new Key( '4', Keys.FOUR, { horizontalSpan: 5 } ) ],
      [ new Key( '5', Keys.FIVE, { verticalSpan: 2 } ), new Key( '6', Keys.SIX ), new Key( '7', Keys.SEVEN ) ],
      [ null, new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
      [ null, new Key( '0', Keys.ZERO, { horizontalSpan: 2, verticalSpan: 2 } ) ]
    ]

  } );
} );