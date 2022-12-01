// Copyright 2018-2022, University of Colorado Boulder

/**
 * StatusBar is the base class for the status bar that appears at the top of games. It sizes itself to match the bounds
 * of the browser window (the visible bounds) and float to either the top of the browser window or the layout bounds.
 * Subclasses are responsible for adding UI components to the bar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Property from '../../axon/js/Property.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import optionize from '../../phet-core/js/optionize.js';
import PhetFont from '../../scenery-phet/js/PhetFont.js';
import { Color, Node, NodeOptions, Rectangle, TColor } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  barFill?: TColor;
  barStroke?: TColor;
  barHeight?: number;
  xMargin?: number;
  yMargin?: number;

  // true: float bar to top of visible bounds
  // false: bar at top of layoutBounds
  floatToTop?: boolean;

  // true: keeps things on the status bar aligned with left and right edges of window bounds (aka visible bounds)
  // false: keeps things on the status bar aligned with left and right edges of layoutBounds
  dynamicAlignment?: boolean;
};

export type StatusBarOptions = SelfOptions & NodeOptions;

class StatusBar extends Node {

  protected readonly positioningBoundsProperty: TReadOnlyProperty<Bounds2>;
  private readonly disposeStatusBar: () => void;
  public static readonly DEFAULT_FONT = new PhetFont( 20 );
  public static readonly DEFAULT_TEXT_FILL = Color.BLACK;

  /**
   * @param layoutBounds
   * @param visibleBoundsProperty - visible bounds of the parent ScreenView
   * @param [providedOptions]
   */
  public constructor( layoutBounds: Bounds2, visibleBoundsProperty: TReadOnlyProperty<Bounds2>, providedOptions?: StatusBarOptions ) {

    const options = optionize<StatusBarOptions, SelfOptions, NodeOptions>()( {

      // StatusBarOptions
      barFill: 'lightGray',
      barStroke: null,
      barHeight: 50,
      xMargin: 10,
      yMargin: 8,
      floatToTop: false,
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

    // for layout of UI components on the status bar, compensated for margins
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

  public override dispose(): void {
    this.disposeStatusBar();
    super.dispose();
  }
}

sceneryPhet.register( 'StatusBar', StatusBar );
export default StatusBar;