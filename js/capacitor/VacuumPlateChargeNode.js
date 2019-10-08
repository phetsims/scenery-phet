// Copyright 2019, University of Colorado Boulder

/**
 * Portion of the plate charge area facing the vacuum gap
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 *
 * Moved from capacitor-lab-basics/js/common/view/VacuumPlateChargeNode.js on Oct 7, 2019
 */
define( require => {
  'use strict';

  const inherit = require( 'PHET_CORE/inherit' );
  const PlateChargeNode = require( 'SCENERY_PHET/capacitor/PlateChargeNode' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @constructor
   *
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Object} [options] - See options for PlateChargeNode
   */
  function VacuumPlateChargeNode( capacitor, modelViewTransform, options ) {
    PlateChargeNode.call( this, capacitor, modelViewTransform, options );
  }

  sceneryPhet.register( 'VacuumPlateChargeNode', VacuumPlateChargeNode );

  return inherit( PlateChargeNode, VacuumPlateChargeNode, {

    /**
     * Get plate charge from capacitor in the model
     * @public
     *
     * @returns {number} charge
     */
    getPlateCharge: function() {
      return this.capacitor.plateChargeProperty.value;
    },


    /**
     * Gets the x offset (relative to the plate origin) of the portion of the plate that is facing the vacuum gap
     * @public
     *
     * @returns {number} offset
     */
    getContactXOrigin: function() {
      return -this.capacitor.plateSizeProperty.value.width / 2;
    },

    /**
     * Gets the width of the portion of the plate that is in contact with air.
     * @public
     *
     * @returns {number}
     */
    getContactWidth: function() {
      return this.capacitor.plateSizeProperty.value.width;
    }
  } );
} );
