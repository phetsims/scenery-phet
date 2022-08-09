// Copyright 2019-2022, University of Colorado Boulder

/**
 * SpectrumSliderThumb has (a) a thin cursor that lies on the track and (b) a teardrop-shaped handle that drops
 * down below the track and depicts the selected color. Origin is at top center.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import PickOptional from '../../phet-core/js/types/PickOptional.js';
import { Node, Path, PathOptions, Rectangle } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';
import SpectrumNode, { SpectrumNodeOptions } from './SpectrumNode.js';

type SelfOptions = {
  width?: number;
  height?: number;
  cursorHeight?: number;
} & PickOptional<SpectrumNodeOptions, 'valueToColor'>;

export type SpectrumSliderThumbOptions = SelfOptions & PathOptions;

export default class SpectrumSliderThumb extends Path {

  private readonly windowCursor: Node;
  private readonly disposeSpectrumSliderThumb: () => void;

  public constructor( property: TReadOnlyProperty<number>, providedOptions?: SpectrumSliderThumbOptions ) {

    const options = optionize<SpectrumSliderThumbOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      width: 35,
      height: 45,
      valueToColor: SpectrumNode.DEFAULT_VALUE_TO_COLOR,
      cursorHeight: 30,

      // PathOptions
      fill: 'black',
      stroke: 'black',
      lineWidth: 1
    }, providedOptions );

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
    const sideArcPoint = handleShape.getLastPoint()!;
    assert && assert( sideArcPoint );

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

    const listener = ( value: number ) => this.setFill( options.valueToColor( value ) );
    property.link( listener );

    this.disposeSpectrumSliderThumb = () => property.unlink( listener );
  }

  /**
   * Position the thumb in the track.
   */
  public override setCenterY( centerY: number ): this {
    return super.setY( centerY + this.windowCursor.height / 2 );
  }

  public override dispose(): void {
    this.disposeSpectrumSliderThumb();
    super.dispose();
  }
}

sceneryPhet.register( 'SpectrumSliderThumb', SpectrumSliderThumb );