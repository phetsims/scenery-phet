// Copyright 2018, University of Colorado Boulder

/**
 * Status bar that runs along the top of a game
 *
 * @author Andrea Lin
 * @author Chris Malley (PixelZoom, Inc.)
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
      expandToFitBounds: true // expands to fit window width, otherwise stay inside initial layoutBounds
    }, options );

    var backButton = new BackButton( { listener: options.backButtonListener } );

    var backgroundHeight = _.max( [ backButton.height, messageNode.height, scoreDisplay.height ] ) + 2 * options.yMargin;
    var backgroundNode = new Rectangle(
      visibleBoundsProperty.get().minX,
      visibleBoundsProperty.get().minY,
      visibleBoundsProperty.get().maxX - visibleBoundsProperty.get().minX,
      backgroundHeight, {
        fill: options.backgroundFill
      } );

    assert && assert( !options.children, 'StatusBar sets children' );
    options.children = [ backgroundNode, backButton, messageNode, scoreDisplay ];

    Node.call( this, options );

    // Update the messageNode layout when its bounds change.
    var messageNodeUpdateLayout = function() {
      messageNode.left = backButton.right + options.spacing;
      messageNode.centerY = backgroundNode.centerY;
    };
    messageNode.on( 'bounds', messageNodeUpdateLayout );

    // Update the scoreDisplay layout when its bounds change.
    var scoreDisplayUpdateLayout = function() {
      scoreDisplay.right = backgroundNode.right - options.xMargin;
      scoreDisplay.centerY = backgroundNode.centerY;
    };
    scoreDisplay.on( 'bounds', scoreDisplayUpdateLayout );

    // Adjust the bar width and (optionally) update the layout when the browser window width changes.
    var visibleBoundsListener = function( bounds ) {
      if ( options.expandToFitBounds ) {
        backgroundNode.setRectX( bounds.minX );
        backgroundNode.setRectWidth( bounds.maxX - bounds.minX );
      }
      backButton.left = backgroundNode.left + options.xMargin;
      backButton.centerY = backgroundNode.centerY;
      messageNodeUpdateLayout();
      scoreDisplayUpdateLayout();
    };
    visibleBoundsProperty.link( visibleBoundsListener );

    // @private
    this.disposeStatusBar = function() {
      backButton.dispose();
      if ( messageNode.hasListener( 'bounds', messageNodeUpdateLayout ) ) {
        messageNode.off( 'bounds', messageNodeUpdateLayout );
      }
      if ( scoreDisplay.hasListener( 'bounds', scoreDisplayUpdateLayout ) ) {
        scoreDisplay.off( 'bounds', scoreDisplayUpdateLayout );
      }
      if ( visibleBoundsProperty.hasListener( visibleBoundsListener ) ) {
        visibleBoundsProperty.unlink( visibleBoundsListener );
      }
    };
  }

  vegas.register( 'StatusBar', StatusBar );

  return inherit( Node, StatusBar, {

    // @public
    dispose: function() {
      this.disposeStatusBar();
      Node.prototype.dispose.call( this );
    }
  } );
} );