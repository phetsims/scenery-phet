// Copyright 2020-2021, University of Colorado Boulder

/**
 * ZoomButtonGroup is a general 'modern' button group for zooming in and out.
 * It was conceived and first used in natural-selection.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import merge from '../../phet-core/js/merge.js';
import LayoutBox from '../../scenery/js/nodes/LayoutBox.js';
import Node from '../../scenery/js/nodes/Node.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';

class ZoomButtonGroup extends LayoutBox {

  /**
   * @param {Node} zoomInIcon
   * @param {Node} zoomOutIcon
   * @param {NumberProperty} zoomLevelProperty - smaller value means more zoomed out
   * @param {Object} [options]
   */
  constructor( zoomInIcon, zoomOutIcon, zoomLevelProperty, options ) {

    assert && assert( zoomInIcon instanceof Node, 'icons are required in the base class' );
    assert && assert( zoomOutIcon instanceof Node, 'icons are required in the base class' );
    assert && assert( zoomLevelProperty instanceof NumberProperty, 'invalid zoomLevelProperty' );
    assert && assert( zoomLevelProperty.range, 'missing zoomLevelProperty.range' );

    options = merge( {

      zoomInDelta: 1,   // delta applied when the '+' button is pressed, must be > 0
      zoomOutDelta: -1, // delta applied when the '-' button is pressed, must be < 0

      // pointer area dilation, correct for options.orientation, and overlap will be prevented by shifting
      touchAreaXDilation: 0,
      touchAreaYDilation: 0,
      mouseAreaXDilation: 0,
      mouseAreaYDilation: 0,

      // RectangularPushButton options
      buttonOptions: {
        fireOnHold: true,
        fireOnHoldDelay: 600, // ms
        fireOnHoldInterval: 250 // ms
      },

      // LayoutBox options
      spacing: 0,
      orientation: 'horizontal',
      align: 'center',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( options.zoomInDelta > 0, 'zoomInDelta must be > 0' );
    assert && assert( options.zoomOutDelta < 0, 'zoomOutDelta must be > 0' );
    assert && assert( !options.buttonOptions.content, 'ZoomButtonGroup sets buttonOptions.content' );
    assert && assert( !options.buttonOptions.listener, 'ZoomButtonGroup sets buttonOptions.listener' );
    assert && assert( options.spacing >= 0, `invalid spacing: ${options.spacing}` );

    // zoom in
    const zoomInButton = new RectangularPushButton( merge( {}, options.buttonOptions, {
      content: zoomInIcon,
      listener: () => {
        zoomLevelProperty.value += options.zoomInDelta;
      },
      tandem: options.tandem.createTandem( 'zoomInButton' )
    } ) );

    // zoom out
    const zoomOutButton = new RectangularPushButton( merge( {}, options.buttonOptions, {
      content: zoomOutIcon,
      listener: () => {
        zoomLevelProperty.value += options.zoomOutDelta;
      },
      tandem: options.tandem.createTandem( 'zoomOutButton' )
    } ) );

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
    const zoomLevelListener = zoomLevel => {
      zoomOutButton.enabled = ( zoomLevel > zoomLevelProperty.range.min );
      zoomInButton.enabled = ( zoomLevel < zoomLevelProperty.range.max );
    };
    zoomLevelProperty.link( zoomLevelListener );

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