// Copyright 2022, University of Colorado Boulder

/**
 * When enabled, shows a grid across the play area that helps the user to make quantitative comparisons
 * between distances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Agustín Vallejo
 */

import sceneryPhet from './sceneryPhet.js';
import { Shape } from '../../kite/js/imports.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';
import ModelViewTransform2 from '../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

export type GridNodeOptions = SelfOptions & PathOptions;

export default class GridNode extends Path {

  /**
   * @param transformProperty
   * @param spacing - spacing between grid lines
   * @param center - center of the grid in model coordinates
   * @param numGridLines - number grid lines on each side of the center
   * @param [providedOptions]
   */
  public constructor( transformProperty: ReadOnlyProperty<ModelViewTransform2>, spacing: number, center: Vector2, numGridLines: number, providedOptions?: GridNodeOptions ) {

    const options = optionize<GridNodeOptions, SelfOptions, PathOptions>()( {
      stroke: 'gray'
    }, providedOptions );

    super( null, options );

    transformProperty.link( ( transform: ModelViewTransform2 ) => {
      const shape = new Shape();

      const x1 = -numGridLines * spacing + center.x;
      const x2 = numGridLines * spacing + center.x;
      const y1 = -numGridLines * spacing + center.y;
      const y2 = numGridLines * spacing + center.y;

      for ( let i = -numGridLines; i <= numGridLines; i++ ) {
        const x = i * spacing + center.x;
        const y = i * spacing + center.y;
        shape.moveTo( x1, y ).lineTo( x2, y ); // horizontal lines
        shape.moveTo( x, y1 ).lineTo( x, y2 ); // vertical lines
      }

      this.shape = transform.modelToViewShape( shape );
    } );
  }
}

sceneryPhet.register( 'GridNode', GridNode );