// Copyright 2020-2023, University of Colorado Boulder

/**
 * ZoomButtonGroup is the base class for a pair of buttons used to zoom 'in' and 'out'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import merge from '../../phet-core/js/merge.js';
import { FlowBox, FlowBoxOptions, Node } from '../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import optionize from '../../phet-core/js/optionize.js';
import sceneryPhet from './sceneryPhet.js';
import TRangedProperty from '../../axon/js/TRangedProperty.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';

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
  protected constructor( zoomLevelProperty: TRangedProperty, zoomInIcon: Node, zoomOutIcon: Node,
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
        fireOnHoldInterval: 250, // ms
        phetioVisiblePropertyInstrumented: false,
        phetioEnabledPropertyInstrumented: false
      },

      // FlowBoxOptions
      spacing: 0,
      orientation: 'horizontal',
      align: 'center',
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'ZoomButtonGroup'
    }, providedOptions );

    // For pointer areas. Dependent on options.spacing, pointer areas will be shifted to prevent overlap.
    const halfSpacing = options.spacing / 2;
    const mouseXShift = Math.max( 0, options.orientation === 'horizontal' ? options.mouseAreaXDilation - halfSpacing : 0 );
    const touchXShift = Math.max( 0, options.orientation === 'horizontal' ? options.touchAreaXDilation - halfSpacing : 0 );
    const mouseYShift = Math.max( 0, options.orientation === 'vertical' ? options.mouseAreaYDilation - halfSpacing : 0 );
    const touchYShift = Math.max( 0, options.orientation === 'vertical' ? options.touchAreaYDilation - halfSpacing : 0 );

    // zoom in
    const zoomInButton = new RectangularPushButton( merge( {
      content: zoomInIcon,
      listener: () => {
        zoomLevelProperty.value = options.applyZoomIn( zoomLevelProperty.value );
      },
      touchAreaXDilation: options.touchAreaXDilation,
      touchAreaYDilation: options.touchAreaYDilation,
      mouseAreaXDilation: options.mouseAreaXDilation,
      mouseAreaYDilation: options.mouseAreaYDilation,
      touchAreaXShift: touchXShift,
      touchAreaYShift: -touchYShift,
      mouseAreaXShift: mouseXShift,
      mouseAreaYShift: -mouseYShift,
      accessibleName: SceneryPhetStrings.a11y.zoomInStringProperty,
      tandem: options.tandem.createTandem( 'zoomInButton' )
    }, options.buttonOptions ) );

    // zoom out
    const zoomOutButton = new RectangularPushButton( merge( {
      content: zoomOutIcon,
      listener: () => {
        zoomLevelProperty.value = options.applyZoomOut( zoomLevelProperty.value );
      },
      touchAreaXDilation: options.touchAreaXDilation,
      touchAreaYDilation: options.touchAreaYDilation,
      mouseAreaXDilation: options.mouseAreaXDilation,
      mouseAreaYDilation: options.mouseAreaYDilation,
      touchAreaXShift: -touchXShift,
      touchAreaYShift: touchYShift,
      mouseAreaXShift: -mouseXShift,
      mouseAreaYShift: mouseYShift,
      accessibleName: SceneryPhetStrings.a11y.zoomOutStringProperty,
      tandem: options.tandem.createTandem( 'zoomOutButton' )
    }, options.buttonOptions ) );

    options.children = ( options.orientation === 'horizontal' ) ? [ zoomOutButton, zoomInButton ] : [ zoomInButton, zoomOutButton ];

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