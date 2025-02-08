// Copyright 2022-2025, University of Colorado Boulder

/**
 * When enabled, shows a grid across the play area that helps the user to make quantitative comparisons
 * between distances.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../dot/js/Vector2.js';
import Shape from '../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../phetcommon/js/view/ModelViewTransform2.js';
import Path, { PathOptions } from '../../scenery/js/nodes/Path.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = EmptySelfOptions;

export type GridNodeOptions = SelfOptions & PathOptions;

export default class GridNode extends Path {

  /**
   * @param transformProperty
   * @param spacing - spacing between grid lines
   * @param center - center of the grid in model coordinates
   * @param numberOfGridLines - number of grid lines on each side of the center
   * @param [providedOptions]
   */
  public constructor( transformProperty: TReadOnlyProperty<ModelViewTransform2>, spacing: number, center: Vector2, numberOfGridLines: number, providedOptions?: GridNodeOptions ) {

    const options = optionize<GridNodeOptions, SelfOptions, PathOptions>()( {
      stroke: 'gray'
    }, providedOptions );

    super( null, options );

    transformProperty.link( ( transform: ModelViewTransform2 ) => {
      const shape = new Shape();

      const x1 = -numberOfGridLines * spacing + center.x;
      const x2 = numberOfGridLines * spacing + center.x;
      const y1 = -numberOfGridLines * spacing + center.y;
      const y2 = numberOfGridLines * spacing + center.y;

      for ( let i = -numberOfGridLines; i <= numberOfGridLines; i++ ) {
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