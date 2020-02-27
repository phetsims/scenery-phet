// Copyright 2019-2020, University of Colorado Boulder

/**
 * Visual representation of a capacitor plate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Bounds3 from '../../../dot/js/Bounds3.js';
import Color from '../../../scenery/js/util/Color.js';
import sceneryPhet from '../sceneryPhet.js';
import BoxNode from './BoxNode.js';
import CapacitorConstants from './CapacitorConstants.js';
import PlateChargeNode from './PlateChargeNode.js';

// constants
const PLATE_COLOR = new Color( 245, 245, 245 );  // capacitor plates

class PlateNode extends BoxNode {

  /**
   * @param {Capacitor} capacitor
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {string} polarity - 'POSITIVE' or 'NEGATIVE'
   * @param {number} maxPlateCharge
   * @param {string} orientation
   */
  constructor( capacitor, modelViewTransform, polarity, maxPlateCharge, orientation ) {

    super( modelViewTransform, PLATE_COLOR, capacitor.plateSizeProperty.value );

    // @private {YawPitchModelViewTransform3}
    this.modelViewTransform = modelViewTransform;

    // Charges restricted to the largest possible top face on a capacitor plate.  Bounds needed for canvas.
    const canvasBounds = this.getMaxBoxNodeBounds();

    // @private {PlateChargeNode}
    this.plateChargeNode = new PlateChargeNode( capacitor, modelViewTransform, {
      polarity: polarity,
      maxPlateCharge: maxPlateCharge,
      canvasBounds: canvasBounds,
      orientation: orientation
    } );
    this.addChild( this.plateChargeNode );
  }

  /**
   * Make the charges on this plate visible.
   * @public
   *
   * @param {boolean} visible
   */
  setChargeVisible( visible ) {
    this.plateChargeNode.visible = visible;
  }

  /**
   * Get bounds for a plate with maximum width.  Useful for layout and bounds calculations.
   * @private
   *
   * @returns {Bounds3}
   */
  getMaxBoxNodeBounds() {
    const maxWidthBoxNode = new BoxNode(
      this.modelViewTransform,
      PLATE_COLOR,
      new Bounds3( 0, 0, 0,
        CapacitorConstants.PLATE_WIDTH_RANGE.max,
        CapacitorConstants.PLATE_HEIGHT,
        CapacitorConstants.PLATE_WIDTH_RANGE.max )
    );
    return maxWidthBoxNode.bounds;
  }
}

sceneryPhet.register( 'PlateNode', PlateNode );
export default PlateNode;