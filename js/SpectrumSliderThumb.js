// Copyright 2019-2020, University of Colorado Boulder

/**
 * This slider thumb has (a) a thin cursor that lies on the track and (b) a teardrop-shaped handle that drops
 * down below the track and depicts the selected color.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import Path from '../../scenery/js/nodes/Path.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import sceneryPhet from './sceneryPhet.js';
import SpectrumNode from './SpectrumNode.js';

class SpectrumSliderThumb extends Path {

  /**
   * The slider thumb, origin at top center.
   *
   * @param {Property} property
   * @param {Object} [options]
   */
  constructor( property, options ) {

    options = merge( {
      width: 35,
      height: 45,
      stroke: 'black',
      lineWidth: 1,
      fill: 'black',
      valueToColor: SpectrumNode.DEFAULT_VALUE_TO_COLOR,
      cursorHeight: 30
    }, options );

    const width = options.width;
    const height = options.height;

    // Set the radius of the arcs based on the height or width, whichever is smaller.
    const radiusScale = 0.15;
    const radius = ( width < height ) ? radiusScale * width : radiusScale * height;

    // Calculate some parameters of the upper triangles of the thumb for getting arc offsets.
    const hypotenuse = Math.sqrt( Math.pow( 0.5 * width, 2 ) + Math.pow( 0.3 * height, 2 ) );
    const angle = Math.acos( width * 0.5 / hypotenuse );
    const heightOffset = radius * Math.sin( angle );

    // Draw the thumb shape starting at the right upper corner of the pentagon below the arc,
    // this way we can get the arc coordinates for the arc in this corner from the other side,
    // which will be easier to calculate arcing from bottom to top.
    const handleShape = new Shape()
      .moveTo( 0.5 * width, 0.3 * height + heightOffset )
      .lineTo( 0.5 * width, height - radius )
      .arc( 0.5 * width - radius, height - radius, radius, 0, Math.PI / 2 )
      .lineTo( -0.5 * width + radius, height )
      .arc( -0.5 * width + radius, height - radius, radius, Math.PI / 2, Math.PI )
      .lineTo( -0.5 * width, 0.3 * height + heightOffset )
      .arc( -0.5 * width + radius, 0.3 * height + heightOffset, radius, Math.PI, Math.PI + angle );

    // Save the coordinates for the point above the left side arc, for use on the other side.
    const sideArcPoint = handleShape.getLastPoint();

    handleShape.lineTo( 0, 0 )
      .lineTo( -sideArcPoint.x, sideArcPoint.y )
      .arc( 0.5 * width - radius, 0.3 * height + heightOffset, radius, -angle, 0 )
      .close();

    super( handleShape, options );

    // Cursor window that appears over the slider track
    this.windowCursor = new Rectangle( 0, 0, 3, options.cursorHeight, 2, 2, {
      bottom: 0,
      centerX: 0,
      stroke: 'black'
    } );
    this.addChild( this.windowCursor );

    const listener = value => this.setFill( options.valueToColor( value ) );
    property.link( listener );

    // @private
    this.disposeSpectrumSliderThumb = () => property.unlink( listener );
  }

  /**
   * Position the thumb in the track.
   * @param {number} centerY
   * @override
   */
  setCenterY( centerY ) {
    super.setY( centerY + this.windowCursor.height / 2 );
  }

  /**
   * Unlink and prepare for garbage collection.
   * @public
   */
  dispose() {
    this.disposeSpectrumSliderThumb();
    super.dispose();
  }
}

sceneryPhet.register( 'SpectrumSliderThumb', SpectrumSliderThumb );
export default SpectrumSliderThumb;