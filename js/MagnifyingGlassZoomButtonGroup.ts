// Copyright 2020-2022, University of Colorado Boulder

/**
 * ZoomButtonGroup that shows magnifying glass icons
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../axon/js/NumberProperty.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import MagnifyingGlassNode, { MagnifyingGlassNodeOptions } from './MagnifyingGlassNode.js';
import MinusNode from './MinusNode.js';
import PhetColorScheme from './PhetColorScheme.js';
import PlusNode from './PlusNode.js';
import sceneryPhet from './sceneryPhet.js';
import ZoomButtonGroup, { ZoomButtonGroupOptions } from './ZoomButtonGroup.js';
import optionize from '../../phet-core/js/optionize.js';

type SelfOptions = {

  // options propagated to MagnifyingGlassNode
  magnifyingGlassNodeOptions?: Omit<MagnifyingGlassNodeOptions, 'icon'>;
};

export type MagnifyingGlassZoomButtonGroupOptions = SelfOptions & ZoomButtonGroupOptions;

class MagnifyingGlassZoomButtonGroup extends ZoomButtonGroup {

  /**
   * @param zoomLevelProperty - smaller value means more zoomed out
   * @param providedOptions
   */
  constructor( zoomLevelProperty: NumberProperty, providedOptions?: MagnifyingGlassZoomButtonGroupOptions ) {

    const options = optionize<MagnifyingGlassZoomButtonGroupOptions, SelfOptions, ZoomButtonGroupOptions>( {

      // SelfOptions
      magnifyingGlassNodeOptions: {
        glassRadius: 15 // like ZoomButton
      },

      // ZoomButtonGroupOptions
      buttonOptions: {
        baseColor: PhetColorScheme.BUTTON_YELLOW // like ZoomButton
      }
    }, providedOptions );

    const magnifyingGlassRadius = options.magnifyingGlassNodeOptions.glassRadius!;

    // options for '+' and '-' signs
    const signOptions = {
      size: new Dimension2( 1.3 * magnifyingGlassRadius, magnifyingGlassRadius / 3 )
    };

    // magnifying glass with '+'
    const zoomInIcon = new MagnifyingGlassNode( optionize<MagnifyingGlassNodeOptions, {}, MagnifyingGlassNodeOptions>( {
      icon: new PlusNode( signOptions )
    }, options.magnifyingGlassNodeOptions ) );

    // magnifying glass with '-'
    const zoomOutIcon = new MagnifyingGlassNode( optionize<MagnifyingGlassNodeOptions, {}, MagnifyingGlassNodeOptions>( {
      icon: new MinusNode( signOptions )
    }, options.magnifyingGlassNodeOptions ) );

    super( zoomInIcon, zoomOutIcon, zoomLevelProperty, options );
  }
}

sceneryPhet.register( 'MagnifyingGlassZoomButtonGroup', MagnifyingGlassZoomButtonGroup );
export default MagnifyingGlassZoomButtonGroup;