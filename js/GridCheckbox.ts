// Copyright 2019-2022, University of Colorado Boulder

/**
 * Checkbox for showing/hiding grid lines for a graph.
 * See https://github.com/phetsims/graphing-lines/issues/91.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Checkbox, { CheckboxOptions } from '../../sun/js/Checkbox.js';
import GridIcon, { GridIconOptions } from './GridIcon.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  iconOptions?: GridIconOptions;
};

export type GridCheckboxOptions = SelfOptions & CheckboxOptions;

export default class GridCheckbox extends Checkbox {

  public constructor( property: Property<boolean>, providedOptions?: GridCheckboxOptions ) {

    const options = optionize<GridCheckboxOptions, StrictOmit<SelfOptions, 'iconOptions'>, CheckboxOptions>()( {
      // empty optionize because we're using options.iconOptions below
    }, providedOptions );

    const iconNode = new GridIcon( options.iconOptions );

    super( property, iconNode, options );
  }
}

sceneryPhet.register( 'GridCheckbox', GridCheckbox );