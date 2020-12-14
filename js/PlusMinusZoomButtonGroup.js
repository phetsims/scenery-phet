// Copyright 2020, University of Colorado Boulder

import Dimension2 from '../../dot/js/Dimension2.js';
import merge from '../../phet-core/js/merge.js';
import AlignBox from '../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../scenery/js/nodes/AlignGroup.js';
import MinusNode from './MinusNode.js';
import PlusNode from './PlusNode.js';
import sceneryPhet from './sceneryPhet.js';
import ZoomButtonGroup from './ZoomButtonGroup.js';

// constants
const DEFAULT_SIZE = new Dimension2( 20 * 0.35, 3.6 * 0.35 );

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
        xMargin: 9,
        yMargin: 10
      },
      iconOptions: {
        size: DEFAULT_SIZE
      }
    }, options );

    // Make sure the + and - have the same dimensions
    const alignGroup = new AlignGroup();
    const plusMinusNodeOptions = merge( { size: DEFAULT_SIZE }, options.iconOptions );
    const alignBoxOptions = { group: alignGroup };

    super(
      new AlignBox( new PlusNode( plusMinusNodeOptions ), alignBoxOptions ),
      new AlignBox( new MinusNode( plusMinusNodeOptions ), alignBoxOptions ),
      zoomLevelProperty, options
    );
  }
}

sceneryPhet.register( 'PlusMinusZoomButtonGroup', PlusMinusZoomButtonGroup );
export default PlusMinusZoomButtonGroup;