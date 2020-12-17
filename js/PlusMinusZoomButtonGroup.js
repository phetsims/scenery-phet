// Copyright 2020, University of Colorado Boulder

import Dimension2 from '../../dot/js/Dimension2.js';
import merge from '../../phet-core/js/merge.js';
import AlignBox from '../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../scenery/js/nodes/AlignGroup.js';
import ButtonNode from '../../sun/js/buttons/ButtonNode.js';
import MinusNode from './MinusNode.js';
import PlusNode from './PlusNode.js';
import sceneryPhet from './sceneryPhet.js';
import ZoomButtonGroup from './ZoomButtonGroup.js';

// constants
const DEFAULT_ICON_SIZE = new Dimension2( 7, 1.26 ); // chosen to match existing sim defaults

/**
 * A ZoomButtonGroup that shows a "+" and "-" sign for the button icons.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
class PlusMinusZoomButtonGroup extends ZoomButtonGroup {

  /**
   * @param {NumberProperty} zoomLevelProperty - smaller value means more zoomed out
   * @param {Object} [options]
   */
  constructor( zoomLevelProperty, options ) {
    options = merge( {
      buttonOptions: {
        baseColor: 'white',
        xMargin: 9,
        yMargin: 10,
        cornerRadius: 0,
        buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy
      },
      iconOptions: {
        size: DEFAULT_ICON_SIZE
      }
    }, options );

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