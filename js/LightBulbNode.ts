// Copyright 2015-2022, University of Colorado Boulder

/**
 * Light bulb, made to 'glow' by modulating opacity of the 'on' image.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Utils from '../../dot/js/Utils.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { Image, Node, NodeOptions } from '../../scenery/js/imports.js';
import lightBulbOff_png from '../mipmaps/lightBulbOff_png.js';
import lightBulbOn_png from '../mipmaps/lightBulbOn_png.js';
import LightRaysNode, { LightRaysNodeOptions } from './LightRaysNode.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  bulbImageScale?: number;
  lightRaysNodeOptions?: LightRaysNodeOptions;
};
export type LightBulbNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class LightBulbNode extends Node {

  private readonly onNode: Node;
  private readonly raysNode: LightRaysNode;
  private readonly brightnessProperty: TReadOnlyProperty<number>;
  private readonly disposeLightBulbNode: () => void;

  /**
   * @param brightnessProperty - brightness of the bulb, 0 (off) to 1 (full brightness)
   * @param [providedOptions]
   */
  public constructor( brightnessProperty: TReadOnlyProperty<number>, providedOptions?: LightBulbNodeOptions ) {

    const options = optionize<LightBulbNodeOptions, StrictOmit<SelfOptions, 'lightRaysNodeOptions'>, NodeOptions>()( {
      bulbImageScale: 0.33
    }, providedOptions );

    const onNode = new Image( lightBulbOn_png, {
      scale: options.bulbImageScale,
      centerX: 0,
      bottom: 0
    } );

    const offNode = new Image( lightBulbOff_png, {
      scale: options.bulbImageScale,
      centerX: onNode.centerX,
      bottom: onNode.bottom
    } );

    // rays
    const bulbRadius = offNode.width / 2; // use 'off' node, the 'on' node is wider because it has a glow around it.
    const raysNode = new LightRaysNode( bulbRadius,
      optionize<LightRaysNodeOptions, EmptySelfOptions, LightRaysNodeOptions>()( {
        x: onNode.centerX,
        y: offNode.top + bulbRadius
      }, options.lightRaysNodeOptions ) );

    options.children = [ raysNode, offNode, onNode ];

    super( options );

    this.onNode = onNode;
    this.raysNode = raysNode;
    this.brightnessProperty = brightnessProperty;

    // Updates this Node when it becomes visible.
    this.visibleProperty.link( visible => visible && this.update() );

    const brightnessObserver = ( brightness: number ) => this.update();
    brightnessProperty.link( brightnessObserver );

    this.disposeLightBulbNode = () => {
      brightnessProperty.unlink( brightnessObserver );
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'LightBulbNode', this );
  }

  public override dispose(): void {
    this.disposeLightBulbNode();
    super.dispose();
  }

  /**
   * Updates the bulb. For performance, this is a no-op when the bulb is not visible.
   */
  private update(): void {
    if ( this.visible ) {
      const brightness = this.brightnessProperty.value;
      assert && assert( brightness >= 0 && brightness <= 1 );
      this.onNode.visible = ( brightness > 0 );
      if ( this.onNode.visible ) {
        this.onNode.opacity = Utils.linear( 0, 1, 0.3, 1, brightness );
      }
      this.raysNode.setBrightness( brightness );
    }
  }
}

sceneryPhet.register( 'LightBulbNode', LightBulbNode );