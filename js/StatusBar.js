// Copyright 2018-2020, University of Colorado Boulder

/**
 * StatusBar is the base class for the status bar that appears at the top of games. It sizes itself to match the bounds
 * of the browser window (the visible bounds) and float to either the top of the browser window or the layout bounds.
 * Subclasses are responsible for adding UI components to the bar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import Bounds2 from '../../dot/js/Bounds2.js';
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

  options = merge( {
    barHeight: 50,
    xMargin: 10,
    yMargin: 8,
    barFill: 'lightGray',
    barStroke: null,

    // true: float bar to top of visible bounds
    // false: bar at top of layoutBounds
    floatToTop: false,

    // true: keeps things on the status bar aligned with left and right edges of window bounds (aka visible bounds)
    // false: keeps things on the status bar aligned with left and right edges of layoutBounds
    dynamicAlignment: true
  }, options );

  // @protected size will be set by visibleBoundsListener
  this.barNode = new Rectangle( {
    fill: options.barFill,
    stroke: options.barStroke
  } );

  // Support decoration, with the bar behind everything else
  options.children = [ this.barNode ].concat( options.children || [] );

  Node.call( this, options );

  // @public (read-only) for layout of UI components on the status bar, compensated for margins
  this.positioningBoundsProperty = new Property( Bounds2.EVERYTHING, {
    valueType: Bounds2
  } );

  const visibleBoundsListener = visibleBounds => {

    // Resize and position the bar to match the visible bounds.
    const y = ( options.floatToTop ) ? visibleBounds.top : layoutBounds.top;
    this.barNode.setRect( visibleBounds.minX, y, visibleBounds.width, options.barHeight );

    // Update the bounds inside which components on the status bar should be positioned.
    this.positioningBoundsProperty.value = new Bounds2(
      ( ( options.dynamicAlignment ) ? this.barNode.left : layoutBounds.minX ) + options.xMargin,
      this.barNode.top,
      ( ( options.dynamicAlignment ) ? this.barNode.right : layoutBounds.maxX ) - options.xMargin,
      this.barNode.bottom
    );
  };
  visibleBoundsProperty.link( visibleBoundsListener );

  // @private
  this.disposeStatusBar = () => {
    if ( visibleBoundsProperty.hasListener( visibleBoundsListener ) ) {
      visibleBoundsProperty.unlink( visibleBoundsListener );
    }
  };
}

vegas.register( 'StatusBar', StatusBar );

inherit( Node, StatusBar, {

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

export default StatusBar;