// Copyright 2020-2022, University of Colorado Boulder

/**
 * ZoomButtonGroup is the base class for a pair of buttons used to zoom 'in' and 'out'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { RangedProperty } from '../../axon/js/NumberProperty.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import merge from '../../phet-core/js/merge.js';
import { FlowBox, FlowBoxOptions, Node } from '../../scenery/js/imports.js';
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
  buttonOptions?: StrictOmit<RectangularPushButtonOptions, 'content' | 'listener' | 'tandem'>;

  // pointer area dilation, correct for options.orientation, and overlap will be prevented by shifting
  touchAreaXDilation?: number;
  touchAreaYDilation?: number;
  mouseAreaXDilation?: number;
  mouseAreaYDilation?: number;
};

export type ZoomButtonGroupOptions = SelfOptions & StrictOmit<FlowBoxOptions, 'children'>;

export default class ZoomButtonGroup extends FlowBox {

  private readonly disposeZoomButtonGroup: () => void;

  /**
   * @param zoomLevelProperty - smaller value means more zoomed out
   * @param zoomInIcon
   * @param zoomOutIcon
   * @param providedOptions?
   */
  public constructor( zoomLevelProperty: RangedProperty, zoomInIcon: Node, zoomOutIcon: Node,
                      providedOptions?: ZoomButtonGroupOptions ) {

    const zoomLevelRange = zoomLevelProperty.range;

    const options = optionize<ZoomButtonGroupOptions, SelfOptions, FlowBoxOptions>()( {

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

      // FlowBoxOptions
      spacing: 0,
      orientation: 'horizontal',
      align: 'center',
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'ZoomButtonGroup'
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
      zoomOutButton.enabled = zoomLevelRange.contains( options.applyZoomOut( zoomLevel ) );
      zoomInButton.enabled = zoomLevelRange.contains( options.applyZoomIn( zoomLevel ) );
    };
    zoomLevelProperty.link( zoomLevelListener );

    this.addLinkedElement( zoomLevelProperty, {
      tandem: options.tandem.createTandem( 'zoomProperty' )
    } );

    this.disposeZoomButtonGroup = () => {
      zoomInButton.dispose();
      zoomOutButton.dispose();
      zoomLevelProperty.unlink( zoomLevelListener );
    };
  }

  public override dispose(): void {
    this.disposeZoomButtonGroup();
    super.dispose();
  }
}

sceneryPhet.register( 'ZoomButtonGroup', ZoomButtonGroup );