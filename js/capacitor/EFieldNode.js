// Copyright 2019-2022, University of Colorado Boulder

/**
 * Visual representation of the effective E-field (E_effective) between the capacitor plates.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Emily Randall (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */


//modules
import Multilink from '../../../axon/js/Multilink.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import EnumerationDeprecated from '../../../phet-core/js/EnumerationDeprecated.js';
import { CanvasNode } from '../../../scenery/js/imports.js';
import sceneryPhet from '../sceneryPhet.js';

// constants
const ARROW_SIZE = new Dimension2( 6, 7 );
const LINE_WIDTH = 1;
const ARROW_COLOR = 'black';
const ArrowDirection = EnumerationDeprecated.byKeys( [ 'UP', 'DOWN' ] );

// determines spacing of electric field lines, chosen by inspection to match spacing from Java
const SPACING_CONSTANT = 0.0258;

/**
 * Draw one EField line with the provided parameters using HTML5 Canvas
 *
 * @param {Vector2} position - origin, at the center of the line
 * @param {number} length length of the line in view coordinates
 * @param {string} direction
 * @param {CanvasRenderingContext2D} context
 */
const drawEFieldLine = ( position, length, direction, context ) => {

  // line, origin at center
  context.moveTo( position.x, position.y - length / 2 - 3 );
  context.lineTo( position.x, position.y + length / 2 - 3 );

  // pull out for readability
  const w = ARROW_SIZE.width;
  const h = ARROW_SIZE.height;

  // make sure that the arrow path is centered along the field line.
  // dividing by 4 aligns better than dividing by 2 for the narrow line width.
  const xOffset = LINE_WIDTH / 4;
  const arrowCenter = direction === ArrowDirection.UP ? position.x - xOffset : position.x + xOffset;

  // path for the UP arrow
  if ( direction === ArrowDirection.UP ) {
    context.moveTo( arrowCenter, position.y - h / 2 );
    context.lineTo( arrowCenter + w / 2, position.y + h / 2 );
    context.lineTo( arrowCenter - w / 2, position.y + h / 2 );
  }

  // path for the DOWN arrow
  else if ( direction === ArrowDirection.DOWN ) {
    context.moveTo( arrowCenter, position.y + h / 2 );
    context.lineTo( arrowCenter - w / 2, position.y - h / 2 );
    context.lineTo( arrowCenter + w / 2, position.y - h / 2 );
  }

  else {
    assert && assert( false, 'EFieldLine must be of orientation UP or DOWN' );
  }
};

class EFieldNode extends CanvasNode {

  /**
   * @param {Capacitor} capacitor
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {number} maxEffectiveEField
   * @param {Bounds2} canvasBounds
   */
  constructor( capacitor, modelViewTransform, maxEffectiveEField, canvasBounds ) {

    super( { canvasBounds: canvasBounds } );
    const self = this;

    // @private
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;
    this.maxEffectiveEField = maxEffectiveEField;

    Multilink.multilink( [
      capacitor.plateSizeProperty,
      capacitor.plateSeparationProperty,
      capacitor.plateVoltageProperty
    ], () => {
      if ( self.isVisible() ) {
        self.invalidatePaint();
      }
    } );

    // Update when this Node becomes visible.
    this.visibleProperty.link( visible => visible && this.invalidatePaint() );
  }

  /**
   * Rendering
   * @public
   *
   * @param {CanvasRenderingContext2D} context
   */
  paintCanvas( context ) {

    // compute density (spacing) of field lines
    const effectiveEField = this.capacitor.getEffectiveEField();
    const lineSpacing = this.getLineSpacing( effectiveEField );

    if ( lineSpacing > 0 ) {

      context.beginPath();

      // relevant model values
      const plateWidth = this.capacitor.plateSizeProperty.value.width;
      const plateDepth = plateWidth;
      const plateSeparation = this.capacitor.plateSeparationProperty.value;

      /*
       * Create field lines, working from the center outwards so that lines appear/disappear at edges of plate as
       * E_effective changes.
       */
      const length = this.modelViewTransform.modelToViewDeltaXYZ( 0, plateSeparation, 0 ).y;
      const direction = ( effectiveEField >= 0 ) ? ArrowDirection.DOWN : ArrowDirection.UP;
      let x = lineSpacing / 2;
      while ( x <= plateWidth / 2 ) {
        let z = lineSpacing / 2;
        while ( z <= plateDepth / 2 ) {

          // calculate position for the lines
          const y = 0;
          const line0Translation = this.modelViewTransform.modelToViewXYZ( x, y, z );
          const line1Translation = this.modelViewTransform.modelToViewXYZ( -x, y, z );
          const line2Translation = this.modelViewTransform.modelToViewXYZ( x, y, -z );
          const line3Translation = this.modelViewTransform.modelToViewXYZ( -x, y, -z );

          // add 4 lines, one for each quadrant
          drawEFieldLine( line0Translation, length, direction, context );
          drawEFieldLine( line1Translation, length, direction, context );
          drawEFieldLine( line2Translation, length, direction, context );
          drawEFieldLine( line3Translation, length, direction, context );

          z += lineSpacing;
        }
        x += lineSpacing;
      }
      // stroke the whole path
      context.strokeStyle = ARROW_COLOR;
      context.fillStyle = ARROW_COLOR;
      context.lineWidth = LINE_WIDTH;
      context.fill();
      context.stroke();
    }
  }

  /**
   * Gets the spacing of E-field lines. Higher E-field results in higher density,
   * therefore lower spacing. Density is computed for the minimum plate size.
   * @public
   *
   * @param {number} effectiveEField
   * @returns {number} spacing, in model coordinates
   */
  getLineSpacing( effectiveEField ) {
    if ( effectiveEField === 0 ) {
      return 0;
    }
    else {
      // sqrt looks best for a square plate
      return SPACING_CONSTANT / Math.sqrt( Math.abs( effectiveEField ) );
    }
  }
}

sceneryPhet.register( 'EFieldNode', EFieldNode );
export default EFieldNode;