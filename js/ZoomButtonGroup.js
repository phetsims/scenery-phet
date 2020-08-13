// Copyright 2020, University of Colorado Boulder

/**
 * ZoomButtonGroup is a general 'modern' button group for zooming in and out.
 * It was conceived and first used in natural-selection.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import merge from '../../phet-core/js/merge.js';
import LayoutBox from '../../scenery/js/nodes/LayoutBox.js';
import Text from '../../scenery/js/nodes/Text.js';
import RectangularButtonView from '../../sun/js/buttons/RectangularButtonView.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import MathSymbols from './MathSymbols.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_FONT = new PhetFont( 16 );

class ZoomButtonGroup extends LayoutBox {

  /**
   * @param {NumberProperty} zoomLevelProperty - smaller value means more zoomed out
   * @param {Object} [options]
   */
  constructor( zoomLevelProperty, options ) {

    assert && assert( zoomLevelProperty instanceof NumberProperty, 'invalid zoomLevelProperty' );
    assert && assert( zoomLevelProperty.range, 'missing zoomLevelProperty.range' );

    options = merge( {

      zoomInDelta: 1,   // delta applied when the '+' button is pressed
      zoomOutDelta: -1, // delta applied when the '-' button is pressed

      // RectangularPushButton options
      buttonOptions: {
        baseColor: 'white',
        buttonAppearanceStrategy: RectangularButtonView.FlatAppearanceStrategy,
        cornerRadius: 0,
        xMargin: 8,
        yMargin: 5,
        fireOnHold: true,
        fireOnHoldDelay: 600, // ms
        fireOnHoldInterval: 250 // ms
      },

      // Text options, for the + and - buttons
      textOptions: {
        font: DEFAULT_FONT
      },

      // LayoutBox options
      spacing: 0,
      orientation: 'horizontal',
      align: 'center',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( !options.buttonOptions.content, 'ZoomButtonGroup sets buttonOptions.content' );
    assert && assert( !options.buttonOptions.listener, 'ZoomButtonGroup sets buttonOptions.listener' );

    // zoom in
    const zoomInButton = new RectangularPushButton( merge( {}, options.buttonOptions, {
      content: new Text( MathSymbols.PLUS, options.textOptions ),
      listener: () => {
        zoomLevelProperty.value += options.zoomInDelta;
      },
      tandem: options.tandem.createTandem( 'zoomInButton' )
    } ) );

    // zoom out
    const zoomOutButton = new RectangularPushButton( merge( {}, options.buttonOptions, {
      content: new Text( MathSymbols.MINUS, options.textOptions ),
      listener: () => {
        zoomLevelProperty.value += options.zoomOutDelta;
      },
      tandem: options.tandem.createTandem( 'zoomOutButton' )
    } ) );

    assert && assert( !options.children, 'ZoomButtonGroup sets children' );
    options.children = [ zoomInButton, zoomOutButton ];

    super( options );

    // disable a button if we reach the min or max
    const zoomLevelListener = zoomLevel => {
      zoomOutButton.enabled = ( zoomLevel > zoomLevelProperty.range.min );
      zoomInButton.enabled = ( zoomLevel < zoomLevelProperty.range.max );
    };
    zoomLevelProperty.link( zoomLevelListener );

    // @private
    this.disposeZoomButtonGroup = () => {
      zoomInButton.dispose();
      zoomOutButton.dispose();
      zoomLevelProperty.unlink( zoomLevelListener );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeZoomButtonGroup();
    super.dispose();
  }
}

sceneryPhet.register( 'ZoomButtonGroup', ZoomButtonGroup );
export default ZoomButtonGroup;