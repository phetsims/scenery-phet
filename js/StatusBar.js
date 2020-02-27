// Copyright 2018-2019, University of Colorado Boulder

/**
 * Base type for the status bar that appears at the top of games.
 * The base type is primarily responsible for resizing and 'floating' the bar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import vegas from './vegas.js';

// constants
const DEFAULT_FONT = new PhetFont( 20 );

/**
 * @param {Bounds2} layoutBounds
 * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the parent ScreenView
 * @param {Object} [options]
 * @constructor
 */
function StatusBar( layoutBounds, visibleBoundsProperty, options ) {

  const self = this;

  options = merge( {
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

  const visibleBoundsListener = function( visibleBounds ) {

    // resize the bar
    const y = ( options.floatToTop ) ? visibleBounds.top : layoutBounds.top;
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

export default inherit( Node, StatusBar, {

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
    const leftEdge = ( ( this.dynamicAlignment ) ? this.barNode.left : this.layoutBounds.minX ) + this.xMargin;
    const rightEdge = ( ( this.dynamicAlignment ) ? this.barNode.right : this.layoutBounds.maxX ) - this.xMargin;
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