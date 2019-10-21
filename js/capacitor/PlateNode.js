// Copyright 2019, University of Colorado Boulder

/**
 * Visual representation of a capacitor plate.
 *
 * Moved from capacitor-lab-basics/js/common/view/PlateNode.js on Oct 7, 2019
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds3 = require( 'DOT/Bounds3' );
  const BoxNode = require( 'SCENERY_PHET/capacitor/BoxNode' );
  const CapacitorConstants = require( 'SCENERY_PHET/capacitor/CapacitorConstants' );
  const Color = require( 'SCENERY/util/Color' );
  const PlateChargeNode = require( 'SCENERY_PHET/capacitor/PlateChargeNode' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // constants
  const PLATE_COLOR = new Color( 245, 245, 245 );  // capacitor plates

  class PlateNode extends BoxNode {

    /**
     * @param {Capacitor} capacitor
     * @param {YawPitchModelViewTransform3} modelViewTransform
     * @param {string} polarity - 'POSITIVE' or 'NEGATIVE'
     * @param {number} maxPlateCharge
     */
    constructor( capacitor, modelViewTransform, polarity, maxPlateCharge, orientation ) {

      super( modelViewTransform, PLATE_COLOR, capacitor.plateSizeProperty.value );

      // @private {YawPitchModelViewTransform3}
      this.modelViewTransform = modelViewTransform;

      // Charges restricted to the largest possible top face on a capacitor plate.  Bounds needed for canvas.
      const canvasBounds = this.getMaxBoxNodeBounds();

      // @private {VacuumPlateChargeNode}
      this.vacuumPlateChargeNode = new PlateChargeNode( capacitor, modelViewTransform, {
        polarity: polarity,
        maxPlateCharge: maxPlateCharge,
        canvasBounds: canvasBounds,
        orientation: orientation
      } );
      this.addChild( this.vacuumPlateChargeNode );
    }

    /**
     * Make the charges on this plate visible.
     * @public
     *
     * @param {boolean} visible
     */
    setChargeVisible( visible ) {
      this.vacuumPlateChargeNode.visible = visible;
    }

    /**
     * Get bounds for a plate with maximum width.  Useful for layout and bounds calculations.
     * @public
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

  return sceneryPhet.register( 'PlateNode', PlateNode );
} );