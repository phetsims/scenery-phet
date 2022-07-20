// Copyright 2019-2022, University of Colorado Boulder

/**
 * Base class for representation of plate charge.  Plate charge is represented
 * as an integer number of '+' or '-' symbols. These symbols are distributed
 * across some portion of the plate's top face.
 *
 * All model coordinates are relative to the capacitor's local coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Multilink from '../../../axon/js/Multilink.js';
import validate from '../../../axon/js/validate.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import { CanvasNode, Node } from '../../../scenery/js/imports.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import CapacitorConstants from './CapacitorConstants.js';

// constants
const POSITIVE_CHARGE_COLOR = PhetColorScheme.RED_COLORBLIND.toCSS(); // CSS passed into context fillStyle
const NEGATIVE_CHARGE_COLOR = 'blue';
const NUMBER_OF_PLATE_CHARGES = new Range( 1, 625 );
const NEGATIVE_CHARGE_SIZE = new Dimension2( 7, 2 );

class PlateChargeNode extends CanvasNode {

  /**
   * @param {Capacitor} capacitor
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Object} [options]
   */
  constructor( capacitor, modelViewTransform, options ) {

    options = merge( {
      // {string} - 'POSITIVE' or 'NEGATIVE'
      polarity: CapacitorConstants.POLARITY.POSITIVE,
      maxPlateCharge: Infinity,
      opacity: 1.0,
      orientation: Orientation.VERTICAL,
      canvasBounds: null // Bounds2|null
    }, options );

    validate( options.orientation, { validValues: Orientation.enumeration.values } );

    super( { canvasBounds: options.canvasBounds } );
    const self = this; // extend scope for nested callbacks

    // @private {Capacitor}
    this.capacitor = capacitor;

    // @private {Orientation}
    this.orientation = options.orientation;

    // @private {YawPitchModelViewTransform3}
    this.modelViewTransform = modelViewTransform;

    // @private {string} - 'POSITIVE' or 'NEGATIVE'
    this.polarity = options.polarity;

    // @private {number}
    this.maxPlateCharge = options.maxPlateCharge;

    // @private {number}
    this.opacity = options.opacity;

    this.parentNode = new Node(); // @private parent node for charges
    this.addChild( this.parentNode );

    // No disposal required because the capacitor exists for the life of the sim
    Multilink.multilink( [
        capacitor.plateSizeProperty,
        capacitor.plateChargeProperty
      ], () => self.isVisible() && self.invalidatePaint()
    );

    // Update when this Node becomes visible.
    this.visibleProperty.link( visible => visible && this.invalidatePaint() );
  }

  /**
   * @param {number} numberOfObjects
   * @param {number} width
   * @param {number} height
   * @private
   *
   * @returns {Dimension2}
   */
  getGridSize( numberOfObjects, width, height ) {
    let columns = 0;
    let rows = 0;
    if ( numberOfObjects > 0 ) {

      const alpha = Math.sqrt( numberOfObjects / width / height );
      columns = Utils.roundSymmetric( width * alpha );

      // compute rows 2 ways, choose the best fit
      const rows1 = Utils.roundSymmetric( height * alpha );
      const rows2 = Utils.roundSymmetric( numberOfObjects / columns );
      if ( rows1 !== rows2 ) {
        const error1 = Math.abs( numberOfObjects - ( rows1 * columns ) );
        const error2 = Math.abs( numberOfObjects - ( rows2 * columns ) );
        rows = ( error1 < error2 ) ? rows1 : rows2;
      }
      else {
        rows = rows1;
      }

      // handle boundary cases
      if ( columns === 0 ) {
        columns = 1;
        rows = numberOfObjects;
      }
      else if ( rows === 0 ) {
        rows = 1;
        columns = numberOfObjects;
      }
    }
    assert && assert( columns >= 0 && rows >= 0, 'There must be at least 1 column or 1 row of charges.' );
    return new Dimension2( columns, rows );
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

  /**
   * Returns true if plate is positively charged
   *
   * @returns {Boolean}
   * @public
   */
  isPositivelyCharged() {
    return ( this.getPlateCharge() >= 0 && this.polarity === CapacitorConstants.POLARITY.POSITIVE ) ||
           ( this.getPlateCharge() < 0 && this.polarity === CapacitorConstants.POLARITY.NEGATIVE );
  }

  /**
   * Updates the view to match the model. Charges are arranged in a grid.
   *
   * @param {CanvasRenderingContext2D} context
   * @public
   */
  paintCanvas( context ) {

    const plateCharge = this.getPlateCharge();
    const numberOfCharges = this.getNumberOfCharges( plateCharge, this.maxPlateCharge );

    if ( numberOfCharges > 0 ) {

      const zMargin = this.modelViewTransform.viewToModelDeltaXY( NEGATIVE_CHARGE_SIZE.width, 0 ).x;

      const gridWidth = this.getContactWidth(); // contact between plate and vacuum gap
      const gridDepth = this.capacitor.plateSizeProperty.value.depth - ( 2 * zMargin );

      // grid dimensions
      const gridSize = this.getGridSize( numberOfCharges, gridWidth, gridDepth );
      const rows = gridSize.height;
      const columns = gridSize.width;

      // distance between cells
      const dx = gridWidth / columns;
      const dz = gridDepth / rows;

      // offset to move us to the center of cells
      const xOffset = dx / 2;
      const zOffset = dz / 2;

      // populate the grid
      for ( let row = 0; row < rows; row++ ) {
        for ( let column = 0; column < columns; column++ ) {

          // calculate center position for the charge in cell of the grid
          const x = this.getContactXOrigin() + xOffset + ( column * dx );
          const y = 0;
          let z = -( gridDepth / 2 ) + ( zMargin / 2 ) + zOffset + ( row * dz );

          // #2935, so that single charge is not obscured by wire connected to center of top plate
          if ( numberOfCharges === 1 ) {
            z -= dz / 6;
          }
          const centerPosition = this.modelViewTransform.modelToViewXYZ( x, y, z );

          // add the signed charge to the grid
          if ( this.isPositivelyCharged() ) {
            addPositiveCharge( centerPosition, context );
          }
          else {
            addNegativeCharge( centerPosition, context, this.orientation );
          }
        }
      }
    }
  }

  /**
   * Computes number of charges, linearly proportional to plate charge.  If plate charge is less than half of an
   * electron charge, number of charges is zero.
   * @public
   *
   * @param {number} plateCharge
   * @param {number} maxPlateCharge
   * @returns {number}
   */
  getNumberOfCharges( plateCharge, maxPlateCharge ) {
    const absCharge = Math.abs( plateCharge );
    let numberOfCharges = Utils.toFixedNumber( NUMBER_OF_PLATE_CHARGES.max * ( absCharge / maxPlateCharge ), 0 );
    if ( absCharge > 0 && numberOfCharges < NUMBER_OF_PLATE_CHARGES.min ) {
      numberOfCharges = NUMBER_OF_PLATE_CHARGES.min;
    }
    return Math.min( NUMBER_OF_PLATE_CHARGES.max, numberOfCharges );
  }
}

/**
 * Draw a positive charge with canvas.  'Plus' sign is painted with two
 * overlapping rectangles around a center position.
 *
 * @param {Vector2} position - center position of the charge in view space
 * @param {CanvasRenderingContext2D} context - context for the canvas methods
 * @private
 */
const addPositiveCharge = ( position, context ) => {
  const chargeWidth = NEGATIVE_CHARGE_SIZE.width;
  const chargeHeight = NEGATIVE_CHARGE_SIZE.height;

  context.fillStyle = POSITIVE_CHARGE_COLOR;
  context.fillRect( position.x - chargeWidth / 2, position.y - chargeHeight / 2, chargeWidth, chargeHeight );
  context.fillRect( position.x - chargeHeight / 2, position.y - chargeWidth / 2, chargeHeight, chargeWidth );
};

/**
 * Draw a negative charge with canvas.  'Minus' sign is painted with a single
 * rectangle around a center position.
 *
 * @param {Vector2} position
 * @param {CanvasRenderingContext2D} context
 * @param {string} orientation
 * @private
 */
const addNegativeCharge = ( position, context, orientation ) => {
  const chargeWidth = NEGATIVE_CHARGE_SIZE.width;
  const chargeHeight = NEGATIVE_CHARGE_SIZE.height;

  context.fillStyle = NEGATIVE_CHARGE_COLOR;
  if ( orientation === Orientation.VERTICAL ) {
    context.fillRect( position.x - chargeWidth / 2, position.y, chargeWidth, chargeHeight );
  }
  else {
    context.fillRect( position.x - chargeHeight / 2, position.y - 2.5, chargeHeight, chargeWidth );
  }
};

sceneryPhet.register( 'PlateChargeNode', PlateChargeNode );
export default PlateChargeNode;