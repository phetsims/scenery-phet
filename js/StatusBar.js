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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var vegas = require( 'VEGAS/vegas' );

  /**
   * @param {Property} visibleBoundsProperty - for layout
   * @param {Node} messageNode - to the right of the back button, typically Text
   * @param {Node} scoreDisplay - intended to be one of the ScoreDisplay* nodes but can be any custom Node provided
   * by the client
   * @param {Object} [options]
   * @constructor
   */
  function StatusBar( visibleBoundsProperty, messageNode, scoreDisplay, options ) {

    options = _.extend( {
      backButtonListener: null,
      xMargin: 20,
      yMargin: 10,
      backgroundFill: 'rgb( 49, 117, 202 )',
      spacing: 8,
      alwaysInsideLayoutBounds: true // otherwise, moves with the edges of browser window
    }, options );

    assert && assert( !options.children, 'ScoreDisplayNumber sets children' );

    var backButton = new BackButton( { listener: options.backButtonListener } );
    
    var backgroundHeight = _.max( [ backButton.height, messageNode.height, scoreDisplay.height ] ) + 2 * options.yMargin;
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

    visibleBoundsProperty.link( boundsListener );

    // @private
    this.disposeStatusBar = function() {
      backButton.dispose();
      visibleBoundsProperty.unlink( boundsListener );
    };

    options.children = [ backgroundNode, backButton, messageNode, scoreDisplay ];

    Node.call( this, options );
  }

  vegas.register( 'StatusBar', StatusBar );

  return inherit( Node, StatusBar, {

    // @public
    dispose: function() {
      this.disposeStatusBar;
      Node.prototype.dispose.call( this );
    }
  } );
} );