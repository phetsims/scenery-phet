// Copyright 2020-2022, University of Colorado Boulder

/**
 * A ZoomButtonGroup that shows a "+" and "-" sign for the button icons.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import optionize from '../../phet-core/js/optionize.js';
import { AlignBox, AlignGroup, PathOptions } from '../../scenery/js/imports.js';
import ButtonNode from '../../sun/js/buttons/ButtonNode.js';
import MinusNode from './MinusNode.js';
import PlusNode from './PlusNode.js';
import sceneryPhet from './sceneryPhet.js';
import ZoomButtonGroup, { ZoomButtonGroupOptions } from './ZoomButtonGroup.js';

// constants
const DEFAULT_ICON_SIZE = new Dimension2( 7, 1.26 ); // chosen to match existing sim defaults

type SelfOptions = {

  // options propagated to PlusNode and MinusNode
  iconOptions?: {
    size?: Dimension2;
  } & PathOptions;
};

export type PlusMinusZoomButtonGroupOptions = SelfOptions & ZoomButtonGroupOptions;

class PlusMinusZoomButtonGroup extends ZoomButtonGroup {

  /**
   * @param zoomLevelProperty - smaller value means more zoomed out
   * @param providedOptions
   */
  constructor( zoomLevelProperty: NumberProperty, providedOptions?: PlusMinusZoomButtonGroupOptions ) {

    const options = optionize<PlusMinusZoomButtonGroupOptions, SelfOptions, ZoomButtonGroupOptions>( {

      // SelfOptions
      iconOptions: {
        size: DEFAULT_ICON_SIZE
      },

      // ZoomButtonGroupOptions
      buttonOptions: {
        baseColor: 'white',
        xMargin: 9,
        yMargin: 10,
        cornerRadius: 0,
        buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy
      }
    }, providedOptions );

    // To make the icons have the same effective size
    const alignBoxOptions = { group: new AlignGroup() };

    super(
      new AlignBox( new PlusNode( options.iconOptions ), alignBoxOptions ),
      new AlignBox( new MinusNode( options.iconOptions ), alignBoxOptions ),
      zoomLevelProperty, options
    );
  }
}

sceneryPhet.register( 'PlusMinusZoomButtonGroup', PlusMinusZoomButtonGroup );
export default PlusMinusZoomButtonGroup;