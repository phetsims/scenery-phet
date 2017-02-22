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
  var PLUS_CHAR = '\u002b';
  var MINUS_CHAR = '\u2212';

  /**
   * @param {Array.<Object>} layout - an array that specifies the keys and the layout, see static instance below for
   * example usage
   * @param {AbstractKeyAccumulator} keyAccumulator - object that accumulates the keys pressed by the user
   * @param {Object} [options]
   * @constructor
   */
  function Keypad( layout, keyAccumulator, options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {
      buttonWidth: DEFAULT_BUTTON_WIDTH,
      buttonHeight: DEFAULT_BUTTON_HEIGHT,
      xSpacing: 10,
      ySpacing: 10,
      buttonColor: 'white',
      buttonFont: DEFAULT_BUTTON_FONT
    }, options );

    Node.call( this );
    var self = this;

    //TODO add visibility annotation
    this.keyAccumulator = keyAccumulator;

    // determine number of rows and columns from the input layout
    var numRows = layout.length;
    var numColumns = 0;
    var i;

    for( i = 0; i < numRows; i++ ){
      if ( layout[ i ].length > numColumns ){
        numColumns = layout[ i ].length;
      }
    }
    // check last row to see if any button has vertical span more than 1
    var maxVerticalSpan = 1;
    for ( i = 0; i < layout[ numRows - 1 ].length; i++ ){
      if ( layout[ numRows - 1][i] && layout[ numRows - 1][i].verticalSpan > maxVerticalSpan ){
        maxVerticalSpan = layout[ numRows - 1][i].verticalSpan;
      }
    }
    numRows += maxVerticalSpan - 1;
    var occupiedLayoutGrid = [];

    for( i = 0; i < numRows; i++ ){
      occupiedLayoutGrid[ i ] = [];
      for( var j = 0; j < numColumns; j++ ){
        occupiedLayoutGrid[ i ][ j ] = 0;
      }
    }

    // interpret the layout specification
    var x;
    var y;
    for( i = 0; i < layout.length; i++ ){
      var startRow = i;
      for( j = 0; j < layout[i].length; j++ ){
        var button = layout[ i ][ j ];
        if ( button ) {
          var startColumn = j + ( j > 0 && layout[ i ][ j - 1 ] ? layout[ i ][ j - 1 ].horizontalSpan - 1 : 0 );
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
   * @param {Object} keyObject
   * @param {IntegerAccumulator} keyAccumulator
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

  return inherit( Node, Keypad, {}, {

    // -------------------- static common layouts -------------------------

    WeirdLayout: [
      [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE, { horizontalSpan: 3 } )],
      [ null, new Key( '4', Keys.FOUR )],
      [ new Key( '5', Keys.FIVE, { verticalSpan: 2 } ), new Key( '6', Keys.SIX ), new Key( '7', Keys.SEVEN )],
      [ null, new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
      [ null, new Key( '0', Keys.ZERO, { horizontalSpan: 2 , verticalSpan: 2} ) ]
    ],

    PositiveIntegerLayout: [
      [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
      [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
      [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
      [ new Key( '0', Keys.ZERO, { horizontalSpan: 2 } ), new Key( ( new BackspaceIcon( { scale: 1.5 } ) ) , Keys.BACKSPACE ) ]
    ],

    PositiveAndNegativeIntegerLayout: [
      [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
      [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
      [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
      [ new Key( ( new BackspaceIcon( { scale: 1.5 } ) ) , Keys.BACKSPACE ), new Key( '0', Keys.ZERO ), new Key( PLUS_CHAR + '/' + MINUS_CHAR, Keys.PLUSMINUS ) ]
    ],

    PositiveFloatingPointLayout: [
      [ new Key( '7', Keys.SEVEN ), new Key( '8', Keys.EIGHT ), new Key( '9', Keys.NINE ) ],
      [ new Key( '4', Keys.FOUR ), new Key( '5', Keys.FIVE ), new Key( '6', Keys.SIX ) ],
      [ new Key( '1', Keys.ONE ), new Key( '2', Keys.TWO ), new Key( '3', Keys.THREE ) ],
      [ new Key( '.', Keys.DECIMAL ), new Key( '0', Keys.ZERO ), new Key( ( new BackspaceIcon( { scale: 1.5 } ) ) , Keys.BACKSPACE ) ]
    ]

  } );
} );