// Copyright 2020-2021, University of Colorado Boulder

/**
 * ZoomButtonGroup is a general 'modern' button group for zooming in and out.
 * It was conceived and first used in natural-selection.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import merge from '../../phet-core/js/merge.js';
import { LayoutBox, LayoutBoxOptions, Node } from '../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import optionize from '../../phet-core/js/optionize.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {

  // function applied when the '+' button is pressed
  applyZoomIn?: ( currentZoom: number ) => number;

  // function applied when the '-' button is pressed
  applyZoomOut?: ( currentZoom: number ) => number;

  // propagated to the '+' and '-' push buttons
  buttonOptions?: Omit<RectangularPushButtonOptions, 'content' | 'listener' | 'tandem'>;

  // pointer area dilation, correct for options.orientation, and overlap will be prevented by shifting
  touchAreaXDilation?: number;
  touchAreaYDilation?: number;
  mouseAreaXDilation?: number;
  mouseAreaYDilation?: number;
};

export type ZoomButtonGroupOptions = SelfOptions & LayoutBoxOptions;

class ZoomButtonGroup extends LayoutBox {

  private readonly disposeZoomButtonGroup: () => void;

  /**
   * @param zoomInIcon
   * @param zoomOutIcon
   * @param zoomLevelProperty - smaller value means more zoomed out
   * @param providedOptions
   */
  constructor( zoomInIcon: Node, zoomOutIcon: Node, zoomLevelProperty: NumberProperty, providedOptions?: ZoomButtonGroupOptions ) {

    assert && assert( zoomLevelProperty.range, 'missing zoomLevelProperty.range' );
    const zoomLevelRange = zoomLevelProperty.range!;

    const options = optionize<ZoomButtonGroupOptions, SelfOptions, LayoutBoxOptions,
      'spacing' | 'tandem'>( {

      // ZoomButtonGroupOptions
      applyZoomIn: ( currentZoom: number ) => currentZoom + 1,
      applyZoomOut: ( currentZoom: number ) => currentZoom - 1,
      touchAreaXDilation: 0,
      touchAreaYDilation: 0,
      mouseAreaXDilation: 0,
      mouseAreaYDilation: 0,
      buttonOptions: {
        fireOnHold: true,
        fireOnHoldDelay: 600, // ms
        fireOnHoldInterval: 250 // ms
      },

      // LayoutBoxOptions
      spacing: 0,
      orientation: 'horizontal',
      align: 'center',
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // zoom in
    const zoomInButton = new RectangularPushButton( merge( {
      content: zoomInIcon,
      listener: () => {
        zoomLevelProperty.value = options.applyZoomIn( zoomLevelProperty.value );
      },
      tandem: options.tandem.createTandem( 'zoomInButton' )
    }, options.buttonOptions ) );

    // zoom out
    const zoomOutButton = new RectangularPushButton( merge( {
      content: zoomOutIcon,
      listener: () => {
        zoomLevelProperty.value = options.applyZoomOut( zoomLevelProperty.value );
      },
      tandem: options.tandem.createTandem( 'zoomOutButton' )
    }, options.buttonOptions ) );

    assert && assert( !options.children, 'ZoomButtonGroup sets children' );
    options.children = ( options.orientation === 'horizontal' ) ? [ zoomOutButton, zoomInButton ] : [ zoomInButton, zoomOutButton ];

    // Pointer areas. Dependent on options.spacing, pointer areas will be shifted to prevent overlap.
    zoomInButton.touchArea = zoomInButton.localBounds.dilatedXY( options.touchAreaXDilation, options.touchAreaYDilation );
    zoomOutButton.touchArea = zoomInButton.localBounds.dilatedXY( options.touchAreaXDilation, options.touchAreaYDilation );
    zoomInButton.mouseArea = zoomInButton.localBounds.dilatedXY( options.mouseAreaXDilation, options.mouseAreaYDilation );
    zoomOutButton.mouseArea = zoomInButton.localBounds.dilatedXY( options.mouseAreaXDilation, options.mouseAreaYDilation );
    const halfSpacing = options.spacing / 2;
    if ( options.orientation === 'horizontal' ) {

      const touchShiftX = options.touchAreaXDilation - halfSpacing;
      if ( touchShiftX > 0 ) {
        zoomInButton.touchArea = zoomInButton.touchArea.shiftedX( touchShiftX );
        zoomOutButton.touchArea = zoomOutButton.touchArea.shiftedX( -touchShiftX );
      }

      const mouseShiftX = options.mouseAreaXDilation - halfSpacing;
      if ( mouseShiftX > 0 ) {
        zoomInButton.mouseArea = zoomInButton.mouseArea.shiftedX( mouseShiftX );
        zoomOutButton.mouseArea = zoomOutButton.mouseArea.shiftedX( -mouseShiftX );
      }
    }
    else {
      const touchShiftY = options.touchAreaYDilation - halfSpacing;
      if ( touchShiftY > 0 ) {
        zoomInButton.touchArea = zoomInButton.touchArea.shiftedY( -touchShiftY );
        zoomOutButton.touchArea = zoomOutButton.touchArea.shiftedY( touchShiftY );
      }

      const mouseShiftY = options.mouseAreaYDilation - halfSpacing;
      if ( mouseShiftY > 0 ) {
        zoomInButton.mouseArea = zoomInButton.mouseArea.shiftedY( -mouseShiftY );
        zoomOutButton.mouseArea = zoomOutButton.mouseArea.shiftedY( mouseShiftY );
      }
    }

    super( options );

    // disable a button if we reach the min or max
    const zoomLevelListener = ( zoomLevel: number ) => {
      zoomOutButton.enabled = ( zoomLevel > zoomLevelRange.min );
      zoomInButton.enabled = ( zoomLevel < zoomLevelRange.max );
    };
    zoomLevelProperty.link( zoomLevelListener );

    this.addLinkedElement( zoomLevelProperty, {
      tandem: options.tandem.createTandem( 'zoomProperty' )
    } );

    // @private
    this.disposeZoomButtonGroup = () => {
      zoomInButton.dispose();
      zoomOutButton.dispose();
      zoomLevelProperty.unlink( zoomLevelListener );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeZoomButtonGroup();
    super.dispose();
  }
}

sceneryPhet.register( 'ZoomButtonGroup', ZoomButtonGroup );
export default ZoomButtonGroup;