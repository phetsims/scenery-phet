// Copyright 2018, University of Colorado Boulder

/**
 * Status bar that runs along the top of a game
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  
  var BackButton = require( 'SCENERY_PHET/buttons/BackButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ProgressIndicator = require( 'VEGAS/ProgressIndicator' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var ScoreDisplayTextAndNumber = require( 'VEGAS/ScoreDisplayTextAndNumber' );
  var vegas = require( 'VEGAS/vegas' );

  /**
   * @param {number} screenWidth
   * @param {Node} messageNode - to the right of the back button, typically Text
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function StatusBar( screenWidth, messageNode, scoreProperty, options ) {
    // TODO: screenWidth... layoutBounds...

    assert && assert( !options.children, 'ScoreDisplayNumber sets children' );

    options = _.extend( {
      scoreDisplayType: 'stars', // stars|numberAndStar|textAndNumber
      backButtonListener: null,
      xMargin: 20,
      yMargin: 10,
      backgroundFill: 'rgb( 49, 117, 202 )',
      spacing: 3,
      alwaysInsideLayoutBounds: true // otherwise, moves with the edges of browser window
    }, options );

    var backButton = new BackButton( { listener: options.backButtonListener } );
    
    // TODO: assert that scoreDisplayType is right
    if ( options.scoreDisplayType === 'stars' ) {
      var scoreDisplay = new ProgressIndicator( 4, scoreProperty, 1 ); // TODO: create a ScoreDisplayStars
    }
    else if ( options.scoreDisplayType === 'numberAndStar' ) {
      scoreDisplay = new ScoreDisplayNumberAndStar( scoreProperty );
    }
    else {
      scoreDisplay = new ScoreDisplayTextAndNumber( scoreProperty );
    }

    var backgroundHeight = Math.max( backButton.height, messageNode.height, scoreDisplay.height ) + 2 * options.yMargin;
    var backgroundNode = new Rectangle( 0, 0, 4 * screenWidth, backgroundHeight, { fill: options.backgroundFill } );

    // layout
    backButton.left = options.xMargin;
    backButton.centerY = backgroundNode.centerY;
    messageNode.left = backButton.right + options.spacing;
    messageNode.centerY = backgroundNode.centerY;
    scoreDisplay.right = screenWidth - options.xMargin;
    scoreDisplay.centerY = backgroundNode.centerY;

    options.children = [ backgroundNode, backButton, messageNode, scoreDisplay ];

    Node.call( this, options );
  }

  vegas.register( 'StatusBar', StatusBar );

  return inherit( Node, StatusBar );
} );