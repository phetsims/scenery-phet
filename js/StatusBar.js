// Copyright 2018, University of Colorado Boulder

/**
 * Base type for the status bar that appears at the top of games.
 * The base type is primarily responsible for resizing and 'floating' the bar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var vegas = require( 'VEGAS/vegas' );

  // constants
  var DEFAULT_FONT = new PhetFont( 20 );

  /**
   * @param {number} barHeight
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the parent ScreenView
   * @param {Object} [options]
   * @constructor
   */
  function StatusBar( barHeight, layoutBounds, visibleBoundsProperty, options ) {

    var self = this;

    options = _.extend( {
      floatToTop: false, // true: float bar to top of visible bounds; false: bar at top of layoutBounds
      barFill: 'lightGray',
      barStroke: null
    }, options );

    // @protected (read-only) for layout in subtypes, size will be set by visibleBoundsListener
    this.barNode = new Rectangle( {
      fill: options.barFill,
      stroke: options.barStroke
    } );

    // Support decoration, with the bar behind everything else
    options.children = [ this.barNode ].concat( options.children || [] );

    Node.call( this, options );

    // Adjust the bar size and position
    var visibleBoundsListener = function( visibleBounds ) {
      var y = ( options.floatToTop ) ? visibleBounds.top : layoutBounds.top;
      self.barNode.setRect( visibleBounds.minX, y, visibleBounds.width, barHeight );
    };
    visibleBoundsProperty.link( visibleBoundsListener );

    // @private
    this.disposeStatusBar = function() {
      if ( visibleBoundsProperty.hasListener( visibleBoundsListener ) ) {
        visibleBoundsProperty.unlink( visibleBoundsListener );
      }
    };
  }

  vegas.register( 'StatusBar', StatusBar );

  return inherit( Node, StatusBar, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeStatusBar();
      Node.prototype.dispose.call( this );
    }
  }, {

    // Default font for things text that appears in the status bar subtypes
    DEFAULT_FONT: DEFAULT_FONT
  } );
} );
 