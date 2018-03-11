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
   * @param {Property} visibleBoundsProperty - for layout
   * @param {Node} messageNode - to the right of the back button, typically Text
   * @param {Property.<number>} scoreProperty
   * @param {Object} [options]
   * @constructor
   */
  function StatusBar( visibleBoundsProperty, messageNode, scoreProperty, options ) {

    options = _.extend( {
      scoreDisplayType: 'stars', // stars|numberAndStar|textAndNumber
      backButtonListener: null,
      xMargin: 20,
      yMargin: 10,
      backgroundFill: 'rgb( 49, 117, 202 )',
      spacing: 8,
      alwaysInsideLayoutBounds: true // otherwise, moves with the edges of browser window
    }, options );

    assert && assert( !options.children, 'ScoreDisplayNumber sets children' );

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
    var backgroundNode = new Rectangle(
      visibleBoundsProperty.get().minX,
      visibleBoundsProperty.minY,
      visibleBoundsProperty.get().maxX - visibleBoundsProperty.get().minX,
      backgroundHeight, {
        fill: options.backgroundFill
    } );

    // layout
    backButton.left = backgroundNode.left + options.xMargin;
    backButton.centerY = backgroundNode.centerY;
    messageNode.left = backButton.right + options.spacing;
    messageNode.centerY = backgroundNode.centerY;
    scoreDisplay.right = backgroundNode.right - options.xMargin;
    scoreDisplay.centerY = backgroundNode.centerY;

    var boundsListener = function( bounds ) {
      backgroundNode.setRectX( bounds.minX );
      backgroundNode.setRectWidth( bounds.maxX - bounds.minX );
      if ( !options.alwaysInsideLayoutBounds ) {
        backButton.left = backgroundNode.left + options.xMargin;
        messageNode.left = backButton.right + options.spacing;
        scoreDisplay.right = backgroundNode.right - options.xMargin;
      }
    };

    // TODO: dispose
    visibleBoundsProperty.link( boundsListener );

    options.children = [ backgroundNode, backButton, messageNode, scoreDisplay ];

    Node.call( this, options );
  }

  vegas.register( 'StatusBar', StatusBar );

  return inherit( Node, StatusBar );
} );