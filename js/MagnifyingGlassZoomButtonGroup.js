// Copyright 2020, University of Colorado Boulder

import Dimension2 from '../../dot/js/Dimension2.js';
import merge from '../../phet-core/js/merge.js';
import MagnifyingGlassNode from './MagnifyingGlassNode.js';
import MinusNode from './MinusNode.js';
import PhetColorScheme from './PhetColorScheme.js';
import PlusNode from './PlusNode.js';
import sceneryPhet from './sceneryPhet.js';
import ZoomButtonGroup from './ZoomButtonGroup.js';

/**
 * ZoomButtonGroup that shows magnifying glass icons
 * @author Sam Reid (PhET Interactive Simulations)
 */
class MagnifyingGlassZoomButtonGroup extends ZoomButtonGroup {

  /**
   * @param {NumberProperty} zoomLevelProperty - smaller value means more zoomed out
   * @param {Object} [options]
   */
  constructor( zoomLevelProperty, options ) {

    options = merge( {
      buttonOptions: {
        baseColor: PhetColorScheme.BUTTON_YELLOW // like ZoomButton
      },
      magnifyingGlassNodeOptions: {
        glassRadius: 15 // like ZoomButton
      }
    }, options );

    // plus or minus sign in middle of magnifying glass
    const signOptions = {
      size: new Dimension2(
        1.3 * options.magnifyingGlassNodeOptions.glassRadius,
        options.magnifyingGlassNodeOptions.glassRadius / 3
      )
    };

    assert && assert( !options.magnifyingGlassNodeOptions.icon, 'MagnifyingGlassZoomButtonGroup sets magnifyingGlassNodeOptions.icon' );
    const zoomInIcon = new MagnifyingGlassNode( merge( {}, options.magnifyingGlassNodeOptions, { icon: new PlusNode( signOptions ) } ) );
    const zoomOutIcon = new MagnifyingGlassNode( merge( {}, options.magnifyingGlassNodeOptions, { icon: new MinusNode( signOptions ) } ) );
    super( zoomInIcon, zoomOutIcon, zoomLevelProperty, options );
  }
}

sceneryPhet.register( 'MagnifyingGlassZoomButtonGroup', MagnifyingGlassZoomButtonGroup );
export default MagnifyingGlassZoomButtonGroup;