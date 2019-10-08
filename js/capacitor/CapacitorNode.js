// Copyright 2019, University of Colorado Boulder

/**
 * Visual representation of a capacitor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 *
 * Moved from capacitor-lab-basics/js/common/view/CapacitorNode.js on Oct 7, 2019
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const EFieldNode = require( 'SCENERY_PHET/capacitor/EFieldNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PlateNode = require( 'SCENERY_PHET/capacitor/PlateNode' );
  const Property = require( 'AXON/Property' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  class CapacitorNode extends Node {

    /**
     * @param {ParallelCircuit} circuit
     * @param {CLBModelViewTransform3D} modelViewTransform
     * @param {Property.<boolean>} plateChargeVisibleProperty
     * @param {Property.<boolean>} electricFieldVisibleProperty
     * @param {Tandem} tandem
     */
    constructor( circuit, modelViewTransform, plateChargeVisibleProperty, electricFieldVisibleProperty, tandem, options ) {

      super( { tandem: tandem } ); // TODO: Move tandem to options
      const self = this; // extend scope for nested callbacks

      // @private
      this.capacitor = circuit.capacitor;
      this.modelViewTransform = modelViewTransform;

      // @private {PlateNode}
      this.topPlateNode = PlateNode.createTopPlateNode( this.capacitor, modelViewTransform, circuit.maxPlateCharge );
      this.bottomPlateNode = PlateNode.createBottomPlateNode( this.capacitor, modelViewTransform, circuit.maxPlateCharge );

      const eFieldNode = new EFieldNode( this.capacitor, modelViewTransform, circuit.maxEffectiveEField, this.getPlatesBounds() );

      // rendering order
      this.addChild( this.bottomPlateNode );
      this.addChild( eFieldNode );
      this.addChild( this.topPlateNode );

      Property.multilink( [
        this.capacitor.plateSizeProperty,
        this.capacitor.plateSeparationProperty
      ], function() {
        self.updateGeometry();
      } );

      plateChargeVisibleProperty.link( function( visible ) {
        self.topPlateNode.setChargeVisible( visible );
        self.bottomPlateNode.setChargeVisible( visible );
      } );

      electricFieldVisibleProperty.link( function( visible ) {
        eFieldNode.setVisible( visible );
      } );

      this.mutate( options );
    }

    /**
     * Update the geometry of the capacitor plates.
     * @public
     */
    updateGeometry() {
      // geometry
      this.topPlateNode.setBoxSize( this.capacitor.plateSizeProperty.value );
      this.bottomPlateNode.setBoxSize( this.capacitor.plateSizeProperty.value );

      // layout nodes
      const x = 0;
      let y = -( this.capacitor.plateSeparationProperty.value / 2 ) - this.capacitor.plateSizeProperty.value.height;
      const z = 0;
      this.topPlateNode.center = this.modelViewTransform.modelToViewDeltaXYZ( x, y, z );

      y = this.capacitor.plateSeparationProperty.value / 2;
      this.bottomPlateNode.center = this.modelViewTransform.modelToViewDeltaXYZ( x, y, z );
    }

    /**
     * Get the bound of the capacitor from the plates.  Allows for bounds to be passed into the canvas node before the
     * children are added to the view.
     * @public
     *
     * @returns {Bounds2}
     */
    getPlatesBounds() {
      return new Bounds2(
        this.topPlateNode.left,
        this.topPlateNode.top,
        this.bottomPlateNode.right,
        this.bottomPlateNode.bottom );
    }
  }

  return sceneryPhet.register( 'CapacitorNode', CapacitorNode );
} );