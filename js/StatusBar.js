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
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the parent ScreenView
   * @param {Object} [options]
   * @constructor
   */
  function StatusBar( layoutBounds, visibleBoundsProperty, options ) {

    var self = this;

    options = _.extend( {
      barHeight: 50,
      xMargin: 10,
      yMargin: 8,
      barFill: 'lightGray',
      barStroke: null,

      // true: float bar to top of visible bounds; false: bar at top of layoutBounds
      floatToTop: false,

      // true: keeps things on the status bar aligned with left and right edges of window bounds
      // false: align things on status bar with left and right edges of static layoutBounds
      dynamicAlignment: true

    }, options );

    // @private
    this.layoutBounds = layoutBounds;
    this.xMargin = options.xMargin;
    this.yMargin = options.yMargin;
    this.dynamicAlignment = options.dynamicAlignment;

    // @private size will be set by visibleBoundsListener
    this.barNode = new Rectangle( {
      fill: options.barFill,
      stroke: options.barStroke
    } );

    // Support decoration, with the bar behind everything else
    options.children = [ this.barNode ].concat( options.children || [] );

    Node.call( this, options );

    var visibleBoundsListener = function( visibleBounds ) {

      // resize the bar
      var y = ( options.floatToTop ) ? visibleBounds.top : layoutBounds.top;
      self.barNode.setRect( visibleBounds.minX, y, visibleBounds.width, options.barHeight );

      // update layout of things on the bar
      self.updateLayout();
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
    },

    /**
     * Updates the layout of things on the bar.
     * @protected
     */
    updateLayout: function() {
      var leftEdge = ( ( this.dynamicAlignment ) ? this.barNode.left : this.layoutBounds.minX ) + this.xMargin;
      var rightEdge = ( ( this.dynamicAlignment ) ? this.barNode.right : this.layoutBounds.maxX ) - this.xMargin;
      this.updateLayoutProtected( leftEdge, rightEdge, this.barNode.centerY );
    },

    /**
     * Layout that is specific to subtypes.
     * @param {number} leftEdge - the bar's left edge, compensated for xMargin
     * @param {number} rightEdge - the bar's right edge, compensated for xMargin
     * @param {number} centerY - the bar's vertical center
     * @protected
     * @abstract
     */
    updateLayoutProtected: function( leftEdge, rightEdge, centerY ) {
      throw new Error( 'updateLayout must be implemented by subtypes' );
    }
  }, {

    // Default font for things text that appears in the status bar subtypes
    DEFAULT_FONT: DEFAULT_FONT
  } );
} );
 