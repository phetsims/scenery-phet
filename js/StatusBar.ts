// Copyright 2018-2021, University of Colorado Boulder

/**
 * StatusBar is the base class for the status bar that appears at the top of games. It sizes itself to match the bounds
 * of the browser window (the visible bounds) and float to either the top of the browser window or the layout bounds.
 * Subclasses are responsible for adding UI components to the bar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../axon/js/IReadOnlyProperty.js';
import Property from '../../axon/js/Property.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import optionize from '../../phet-core/js/optionize.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions } from '../../scenery/js/imports.js';
import { Rectangle } from '../../scenery/js/imports.js';
import vegas from './vegas.js';

// constants
const DEFAULT_FONT = new PhetFont( 20 );

// Documented at optionize
type StatusBarSelfOptions = {
  barHeight?: number;
  xMargin?: number;
  yMargin?: number;
  barFill?: ColorDef;
  barStroke?: ColorDef,
  floatToTop?: boolean,
  dynamicAlignment?: boolean
};
export type StatusBarOptions = StatusBarSelfOptions & NodeOptions;

class StatusBar extends Node {
  readonly positioningBoundsProperty: IReadOnlyProperty<Bounds2>;
  private readonly disposeStatusBar: () => void;
  static DEFAULT_FONT: PhetFont;

  /**
   * @param layoutBounds
   * @param visibleBoundsProperty - visible bounds of the parent ScreenView
   * @param [providedOptions]
   */
  constructor( layoutBounds: Bounds2, visibleBoundsProperty: Property<Bounds2>, providedOptions?: StatusBarOptions ) {

    const options = optionize<StatusBarOptions, StatusBarSelfOptions, NodeOptions>( {
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
    }, providedOptions );

    // size will be set by visibleBoundsListener
    const barNode = new Rectangle( {
      fill: options.barFill,
      stroke: options.barStroke
    } );

    // Support decoration, with the bar behind everything else
    const rectangles: Node[] = [ barNode ];
    options.children = rectangles.concat( options.children || [] );

    super( options );

    // @public (read-only) for layout of UI components on the status bar, compensated for margins
    const positioningBoundsProperty = new Property( Bounds2.EVERYTHING, {
      valueType: Bounds2
    } );
    this.positioningBoundsProperty = positioningBoundsProperty;

    const visibleBoundsListener = ( visibleBounds: Bounds2 ) => {

      // Resize and position the bar to match the visible bounds.
      const y = ( options.floatToTop ) ? visibleBounds.top : layoutBounds.top;
      barNode.setRect( visibleBounds.minX, y, visibleBounds.width, options.barHeight );

      // Update the bounds inside which components on the status bar should be positioned.
      positioningBoundsProperty.value = new Bounds2(
        ( ( options.dynamicAlignment ) ? barNode.left : layoutBounds.minX ) + options.xMargin,
        barNode.top,
        ( ( options.dynamicAlignment ) ? barNode.right : layoutBounds.maxX ) - options.xMargin,
        barNode.bottom
      );
    };
    visibleBoundsProperty.link( visibleBoundsListener );

    this.disposeStatusBar = () => {
      if ( visibleBoundsProperty.hasListener( visibleBoundsListener ) ) {
        visibleBoundsProperty.unlink( visibleBoundsListener );
      }
    };
  }

  dispose(): void {
    this.disposeStatusBar();
    super.dispose();
  }
}

// Default font for things text that appears in the status bar subtypes
StatusBar.DEFAULT_FONT = DEFAULT_FONT;

vegas.register( 'StatusBar', StatusBar );
export default StatusBar;