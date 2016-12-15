// Copyright 2016, University of Colorado Boulder

/**
 * Class that creates the display node for an input keypad based on given layout and passes inputs to the
 * accumulator
 *
 * @author Aadish Gupta
 */

define( function( require ) {
  'use strict';

  // modules
  var BackspaceKey = require( 'SCENERY_PHET/keypad/BackspaceKey' );
  var inherit = require( 'PHET_CORE/inherit' );
  var DigitKey = require( 'SCENERY_PHET/keypad/DigitKey' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlusMinusKey = require( 'SCENERY_PHET/keypad/PlusMinusKey' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Text = require( 'SCENERY/nodes/Text' );

  // Constants

  var DEFAULT_BUTTON_WIDTH = 35;
  var DEFAULT_BUTTON_HEIGHT = 35;

  /**
   * Helper function to create the display key node for the provided key object
   *
   * @param {Object} keyObject
   * @param {IntegerAccumulator} accumulator
   * @param {number} width
   * @param {number} height
   * @param {Object} [options]
   * @returns {RectangularPushButton} keyNode
   */
  function createKeyNode( keyObject, accumulator, width, height, options ) {
    var content = keyObject.key.displayNode instanceof Node ? keyObject.key.displayNode :
                  new Text( keyObject.key.displayNode, { font: options.buttonFont } );
    var keyNode = new RectangularPushButton( {
      content: content,
      baseColor: options.buttonColor,
      minWidth: width,
      minHeight: height,
      xMargin: 5,
      yMargin: 5,
      listener: function() {
        var newAccumulatedArray = keyObject.key.handleKeyPressed( accumulator );
        accumulator.validateAndProcessInput( newAccumulatedArray );
      }
    } );
    keyNode.scale( width / keyNode.width, height / keyNode.height );
    return keyNode;
  }

  /**
   * @param {Array.<object>} layout each object in this array represents a button in the grid with position span and content
   * Look for static layouts for more information on the array format
   * @param {IntegerAccumulator} accumulator
   * @param {object} options
   * @constructor
   */
  function Keypad( layout, accumulator, options ) {
    Node.call( this );
    var self = this;
    this.accumulator = accumulator;
    options = _.extend( {
      buttonWidth: DEFAULT_BUTTON_WIDTH,
      buttonHeight: DEFAULT_BUTTON_HEIGHT,
      xSpacing: 10,
      ySpacing: 10,
      buttonColor: 'white',
      buttonFont: new PhetFont( { size: 20 } )
    }, options );

    // determine number of rows and columns from the input layout
    var numRows = 0;
    var numColumns = 0;
    var i;
    for( i = 0; i < layout.length; i++ ){
      if ( layout[ i ].row + 1 > numRows ){
        numRows = layout[ i ].row + 1;
      }
      if ( layout[ i ].column + 1 > numColumns ){
        numColumns = layout[ i ].column + 1;
      }
    }

    var occupiedLayoutGrid = [];

    for( i = 0; i < numRows; i++ ){
      occupiedLayoutGrid[ i ] = [];
      for( var j = 0; j < numColumns; j++ ){
        occupiedLayoutGrid[ i ][ j ] = 0;
      }
    }

    layout.forEach( function( button ){
      var startColumn = button.column;
      var startRow = button.row;
      var verticalSpan = button.verticalSpan;
      var horizontalSpan = button.horizontalSpan;
      // check for overlap of button
      for( i = startRow; i < ( startRow + verticalSpan ); i++ ){
        for ( j = startColumn; j < ( startColumn + horizontalSpan ); j++ ){
          assert && assert( !occupiedLayoutGrid[ i ][ j ], 'Keys Overlap in the Layout' );
          occupiedLayoutGrid[ i ][ j ] = true;
        }
      }
      var buttonWidth = button.horizontalSpan * options.buttonWidth + ( button.horizontalSpan - 1 ) * options.xSpacing;
      var buttonHeight = button.verticalSpan * options.buttonHeight + ( button.verticalSpan - 1 ) * options.ySpacing;

      var buttonNode = createKeyNode( button, self.accumulator, buttonWidth, buttonHeight, options );
      buttonNode.left = startColumn * options.buttonWidth + startColumn * options.xSpacing;
      buttonNode.top = startRow * options.buttonHeight + startRow * options.ySpacing;
      self.addChild( buttonNode );
    }  );
    this.mutate( options );
  }

  sceneryPhet.register( 'Keypad', Keypad );

  return inherit( Node, Keypad, {}, {
    // static common layouts

    PositiveNumberLayout: [
      {
        column: 0,
        row: 0,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 7 )
      },
      {
        column: 1,
        row: 0,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 8 )
      },
      {
        column: 2,
        row: 0,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 9 )
      },
      {
        column: 0,
        row: 1,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 4 )
      },
      {
        column: 1,
        row: 1,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 5 )
      },
      {
        column: 2,
        row: 1,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 6 )
      },
      {
        column: 0,
        row: 2,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 1 )
      },
      {
        column: 1,
        row: 2,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 2 )
      },
      {
        column: 2,
        row: 2,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 3 )
      },
      {
        column: 2,
        row: 3,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new BackspaceKey( DEFAULT_BUTTON_WIDTH, DEFAULT_BUTTON_HEIGHT )
      },
      {
        column: 0,
        row: 3,
        verticalSpan: 1,
        horizontalSpan: 2,
        key: new DigitKey( 0 )
      }
    ],
    NegativeNumberLayout: [
      {
        column: 0,
        row: 0,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 7 )
      },
      {
        column: 1,
        row: 0,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 8 )
      },
      {
        column: 2,
        row: 0,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 9 )
      },
      {
        column: 0,
        row: 1,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 4 )
      },
      {
        column: 1,
        row: 1,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 5 )
      },
      {
        column: 2,
        row: 1,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 6 )
      },
      {
        column: 0,
        row: 2,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 1 )
      },
      {
        column: 1,
        row: 2,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 2 )
      },
      {
        column: 2,
        row: 2,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 3 )
      },
      {
        column: 2,
        row: 3,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new BackspaceKey( DEFAULT_BUTTON_WIDTH, DEFAULT_BUTTON_HEIGHT )
      },
      {
        column: 1,
        row: 3,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new DigitKey( 0 )
      },
      {
        column: 0,
        row: 3,
        verticalSpan: 1,
        horizontalSpan: 1,
        key: new PlusMinusKey()
      }
    ]
  } );
} );