// Copyright 2019-2022, University of Colorado Boulder

/**
 * Visual representation of a capacitor with a vacuum gap.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Multilink from '../../../axon/js/Multilink.js';
import validate from '../../../axon/js/validate.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import { Shape } from '../../../kite/js/imports.js';
import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import { Node } from '../../../scenery/js/imports.js';
import sceneryPhet from '../sceneryPhet.js';
import CapacitorConstants from './CapacitorConstants.js';
import EFieldNode from './EFieldNode.js';
import PlateNode from './PlateNode.js';

// constants
const CLIP_HEIGHT = 100;
const CLIP_WIDTH = 300;

class CapacitorNode extends Node {

  /**
   * @param {ParallelCircuit} circuit
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Property.<boolean>} plateChargeVisibleProperty
   * @param {Property.<boolean>} electricFieldVisibleProperty
   * @param {Object} [options]
   */
  constructor( circuit, modelViewTransform, plateChargeVisibleProperty, electricFieldVisibleProperty, options ) {

    options = merge( {
      orientation: Orientation.VERTICAL,
      includeChargeNode: true
    }, options );
    super();

    validate( options.orientation, { validValues: Orientation.enumeration.values } );

    // @private
    this.capacitor = circuit.capacitor;
    this.modelViewTransform = modelViewTransform;

    // @private {PlateNode}
    this.topPlateNode = new PlateNode( this.capacitor, modelViewTransform, CapacitorConstants.POLARITY.POSITIVE, circuit.maxPlateCharge, options.orientation, options.includeChargeNode );
    this.bottomPlateNode = new PlateNode( this.capacitor, modelViewTransform, CapacitorConstants.POLARITY.NEGATIVE, circuit.maxPlateCharge, options.orientation, options.includeChargeNode );

    const eFieldNode = new EFieldNode( this.capacitor, modelViewTransform, circuit.maxEffectiveEField, this.getPlatesBounds() );

    // rendering order
    this.addChild( this.bottomPlateNode );
    this.addChild( eFieldNode );
    this.addChild( this.topPlateNode );

    const updateGeometry = Multilink.multilink( [
      this.capacitor.plateSizeProperty,
      this.capacitor.plateSeparationProperty
    ], () => this.updateGeometry() );

    const updateVisibility = visible => {
      this.topPlateNode.setChargeVisible( visible );
      this.bottomPlateNode.setChargeVisible( visible );
    };
    plateChargeVisibleProperty.link( updateVisibility );

    const updateElectricFieldVisibility = visible => eFieldNode.setVisible( visible );
    electricFieldVisibleProperty.link( updateElectricFieldVisibility );

    this.mutate( options );

    // @private
    this.disposeCapacitorNode = () => {
      updateGeometry.dispose();
      plateChargeVisibleProperty.unlink( updateVisibility );
      electricFieldVisibleProperty.unlink( updateElectricFieldVisibility );
    };
  }

  // @public
  dispose() {
    this.disposeCapacitorNode();
    super.dispose();
  }

  /**
   * Returns true if the front side contains the specified point, used for voltmeter probe hit testing.
   * @param {Vector2} globalPoint
   * @returns {boolean}
   * @public
   */
  frontSideContainsSensorPoint( globalPoint ) {
    const point = this.topPlateNode.globalToParentPoint( globalPoint );
    return this.topPlateNode.containsPoint( point );
  }

  /**
   * Returns true if the back side contains the specified point, used for voltmeter probe hit testing.
   * @param {Vector2} globalPoint
   * @returns {boolean}
   * @public
   */
  backSideContainsSensorPoint( globalPoint ) {
    const point = this.bottomPlateNode.globalToParentPoint( globalPoint );
    return this.bottomPlateNode.containsPoint( point );
  }

  /**
   * Returns the clipping region for the top shape, in global coordinates, used to show wires or electrons flowing in/out of the capacitor.
   * @returns {Shape}
   * @public
   */
  getTopPlateClipShapeToGlobal() {

    // Note x & y are defined for a vertical capacitor, like in Capacitor Lab: Basics
    const topNode = this.topPlateNode.topNode;
    const shape = Shape.rect( topNode.center.x - CLIP_HEIGHT, topNode.center.y - CLIP_WIDTH, CLIP_HEIGHT * 2, CLIP_WIDTH );
    return shape.transformed( topNode.getLocalToGlobalMatrix() );
  }

  /**
   * Returns the clipping region for the bottom shape, in global coordinates, used to show wires or electrons flowing in/out of the capacitor.
   * @returns {Shape}
   * @public
   */
  getBottomPlateClipShapeToGlobal() {

    // Note x & y are defined for a vertical capacitor, like in Capacitor Lab: Basics
    const frontNode = this.bottomPlateNode.frontNode;
    const shape = Shape.rect( frontNode.bounds.center.x - CLIP_HEIGHT, frontNode.bounds.bottom, CLIP_HEIGHT * 2, CLIP_WIDTH );
    return shape.transformed( frontNode.getLocalToGlobalMatrix() );
  }

  /**
   * Update the geometry of the capacitor plates.
   * @private
   */
  updateGeometry() {

    // geometry
    this.topPlateNode.setBoxSize( this.capacitor.plateSizeProperty.value );
    this.bottomPlateNode.setBoxSize( this.capacitor.plateSizeProperty.value );

    // layout nodes
    const x = 0;
    const z = 0;

    const topPlateY = -this.capacitor.plateSeparationProperty.value / 2 - this.capacitor.plateSizeProperty.value.height;
    this.topPlateNode.center = this.modelViewTransform.modelToViewDeltaXYZ( x, topPlateY, z );

    const bottomPlateY = this.capacitor.plateSeparationProperty.value / 2;
    this.bottomPlateNode.center = this.modelViewTransform.modelToViewDeltaXYZ( x, bottomPlateY, z );
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
      this.bottomPlateNode.bottom
    );
  }
}

sceneryPhet.register( 'CapacitorNode', CapacitorNode );
export default CapacitorNode;