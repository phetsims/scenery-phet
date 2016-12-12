// Copyright 2016, University of Colorado Boulder
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Array.<object>} layout each object in this array represents a button in the grid with position span and content
   * @param {object} options
   * @constructor
   */
  function Keypad( layout, accumulator, options ) {
    Node.call( this );
    var self = this;
    this.accumulator = accumulator;
    options = _.extend( {
      minButtonWidth: 35,
      minButtonHeight: 35,
      xSpacing: 10,
      ySpacing: 10,
      buttonColor: 'white',
      buttonFont: new PhetFont( { size: 20 } )
    }, options );

    // get number of rows and columns from the input layout
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

    var layoutGrid = [];

    for( i = 0; i < numRows; i++ ){
      layoutGrid[ i ] = [];
      for( var j = 0; j < numColumns; j++ ){
        layoutGrid[ i ][ j ] = 0;
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
          assert && assert( !layoutGrid[ i ][ j ], 'Keys Overlap in the Layout' );
          layoutGrid[ i ][ j ] = true;
        }
      }
      var buttonWidth = button.horizontalSpan * options.minButtonWidth + ( button.horizontalSpan - 1 ) * options.xSpacing;
      var buttonHeight = button.verticalSpan * options.minButtonHeight + ( button.verticalSpan - 1 ) * options.ySpacing;

      var buttonNode = self.createButtonNode( button, buttonWidth, buttonHeight, options );
      buttonNode.left = startColumn * options.minButtonWidth + startColumn * options.xSpacing;
      buttonNode.top = startRow * options.minButtonHeight + startRow * options.ySpacing;
      self.addChild( buttonNode );
    }  );
    this.mutate( options );
  }

  sceneryPhet.register( 'Keypad', Keypad );

  return inherit( Node, Keypad, {
    createButtonNode: function( button, minWidth, minHeight, options ) {
      var self = this;
      var content = button.key.displayNode instanceof Node ? button.key.displayNode :
                    new Text( button.key.displayNode, { font: options.buttonFont } );
      var buttonNode = new RectangularPushButton( {
        content: content,
        baseColor: options.buttonColor,
        minWidth: minWidth,
        minHeight: minHeight,
        xMargin: 5,
        yMargin: 5,
        listener: function() {
          var newAccumulatedArray = button.key.handleKeyPressed( self.accumulator.accumulatedArrayProperty.get() );
          self.accumulator.validateInput( newAccumulatedArray );
        }
      } );
      buttonNode.scale( minWidth / buttonNode.width, minHeight / buttonNode.height );
      return buttonNode;
  }
  } );
} );