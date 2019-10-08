// Copyright 2019, University of Colorado Boulder

/**
 * Portion of the plate charge area facing the vacuum gap
 *
 * Moved from capacitor-lab-basics/js/common/view/VacuumPlateChargeNode.js on Oct 7, 2019
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  const PlateChargeNode = require( 'SCENERY_PHET/capacitor/PlateChargeNode' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  class VacuumPlateChargeNode extends PlateChargeNode {

    /**
     * @param {Capacitor} capacitor
     * @param {CLBModelViewTransform3D} modelViewTransform
     * @param {Object} [options] - See options for PlateChargeNode
     */
    constructor( capacitor, modelViewTransform, options ) {
      super( capacitor, modelViewTransform, options );
    }

    /**
     * Get plate charge from capacitor in the model
     * @public
     *
     * @returns {number} charge
     */
    getPlateCharge() {
      return this.capacitor.plateChargeProperty.value;
    }

    /**
     * Gets the x offset (relative to the plate origin) of the portion of the plate that is facing the vacuum gap
     * @public
     *
     * @returns {number} offset
     */
    getContactXOrigin() {
      return -this.capacitor.plateSizeProperty.value.width / 2;
    }

    /**
     * Gets the width of the portion of the plate that is in contact with air.
     * @public
     *
     * @returns {number}
     */
    getContactWidth() {
      return this.capacitor.plateSizeProperty.value.width;
    }
  }

  return sceneryPhet.register( 'VacuumPlateChargeNode', VacuumPlateChargeNode );
} );