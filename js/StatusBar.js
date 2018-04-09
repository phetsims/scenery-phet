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
   * @param {Bounds2} layoutBounds - static 'safe' bounds of the parent ScreenView
   * @param {Property.<Bounds2>} visibleBoundsProperty - dynamic bounds of the browser window
   * @param {Node} messageNode - to the right of the back button, typically Text
   * @param {Node} scoreDisplay - intended to be one of the ScoreDisplay* nodes but can be any custom Node provided
   * by the client
   * @param {Object} [options]
   * @constructor
   */
  function StatusBar( layoutBounds, visibleBoundsProperty, messageNode, scoreDisplay, options ) {

    options = _.extend( {
      backButtonListener: null,
      xMargin: 20,
      yMargin: 10,
      backgroundFill: 'rgb( 49, 117, 202 )',
      spacing: 8,

      // true: keeps things on the status bar aligned with left and right edges of window bounds
      // false: align things on status bar with left and right edges of static layoutBounds
      dynamicAlignment: true
    }, options );

    var backButton = new BackButton( { listener: options.backButtonListener } );

    var backgroundHeight = _.max( [ backButton.height, messageNode.height, scoreDisplay.height ] ) + 2 * options.yMargin;
    var backgroundNode = new Rectangle(
      visibleBoundsProperty.get().minX,
      visibleBoundsProperty.minY,
      visibleBoundsProperty.get().maxX - visibleBoundsProperty.get().minX,
      backgroundHeight, {
        fill: options.backgroundFill
      } );

    assert && assert( !options.children, 'StatusBar sets children' );
    options.children = [ backgroundNode, backButton, messageNode, scoreDisplay ];

    Node.call( this, options );

    // Update the layout of things on the status bar.
    // Some of this may be unnecessary depending on what changed, but it simplifies to do all layout here.
    var updateLayout = function() {

      var leftEdge = ( options.dynamicAlignment ) ? backgroundNode.left : layoutBounds.minX;
      var rightEdge = ( options.dynamicAlignment ) ? backgroundNode.right : layoutBounds.maxX;

      // Back button on left end
      backButton.left = leftEdge + options.xMargin;
      backButton.centerY = backgroundNode.centerY;

      // Message to the right of back button
      messageNode.left = backButton.right + options.spacing;
      messageNode.centerY = backgroundNode.centerY;

      // Score display on the right end
      scoreDisplay.right = rightEdge - options.xMargin;
      scoreDisplay.centerY = backgroundNode.centerY;
    };
    messageNode.on( 'bounds', updateLayout );
    scoreDisplay.on( 'bounds', updateLayout );

    // Adjust the bar width and (optionally) update the layout when the browser window width changes.
    var visibleBoundsListener = function( bounds ) {
      backgroundNode.setRectX( bounds.minX );
      backgroundNode.setRectWidth( bounds.maxX - bounds.minX );
      updateLayout();
    };
    visibleBoundsProperty.link( visibleBoundsListener );

    // @private
    this.disposeStatusBar = function() {
      backButton.dispose();
      if ( messageNode.hasListener( 'bounds', updateLayout ) ) {
        messageNode.off( 'bounds', updateLayout );
      }
      if ( scoreDisplay.hasListener( 'bounds', updateLayout ) ) {
        scoreDisplay.off( 'bounds', updateLayout );
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