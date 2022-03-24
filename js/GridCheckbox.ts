// Copyright 2019-2022, University of Colorado Boulder

/**
 * Checkbox for showing/hiding grid lines for a graph.
 * See https://github.com/phetsims/graphing-lines/issues/91.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import { IColor, Path } from '../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../sun/js/Checkbox.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  gridSize?: number; // {number} square grid with this width and height
  gridStroke?: IColor;
  gridLineWidth?: number;
};

export type GridCheckboxOptions = SelfOptions & CheckboxOptions;

export default class GridCheckbox extends Checkbox {

  /**
   * @param property
   * @param providedOptions
   */
  constructor( property: Property<boolean>, providedOptions?: GridCheckboxOptions ) {

    const options = optionize<GridCheckboxOptions, SelfOptions, CheckboxOptions>( {

      // options for the grid icon
      gridSize: 30, // {number} square grid with this width and height
      gridStroke: 'rgb( 100, 100, 100 )',
      gridLineWidth: 1,

      // superclass options
      spacing: 10

    }, providedOptions );

    const iconSize = options.gridSize;

    // The grid shape looks approximately like this:
    //
    //      |   |   |
    //   ---|---|---|---
    //      |   |   |
    //   ---|---|---|---
    //      |   |   |
    //   ---|---|---|---
    //      |   |   |
    //
    const iconShape = new Shape()
      .moveTo( iconSize / 4, 0 )
      .lineTo( iconSize / 4, iconSize )
      .moveTo( iconSize / 2, 0 )
      .lineTo( iconSize / 2, iconSize )
      .moveTo( iconSize * 3 / 4, 0 )
      .lineTo( iconSize * 3 / 4, iconSize )
      .moveTo( 0, iconSize / 4 )
      .lineTo( iconSize, iconSize / 4 )
      .moveTo( 0, iconSize / 2 )
      .lineTo( iconSize, iconSize / 2 )
      .moveTo( 0, iconSize * 3 / 4 )
      .lineTo( iconSize, iconSize * 3 / 4 );

    const iconNode = new Path( iconShape, {
      stroke: options.gridStroke,
      lineWidth: options.gridLineWidth
    } );

    super( iconNode, property, options );
  }
}

sceneryPhet.register( 'GridCheckbox', GridCheckbox );