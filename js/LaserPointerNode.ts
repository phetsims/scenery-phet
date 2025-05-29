// Copyright 2015-2025, University of Colorado Boulder

/**
 * A laser pointer, with optional on/off button (toggle or momentary).
 * Default orientation is pointing to the right. Origin is at right center (the edge of the output nozzle).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TProperty from '../../axon/js/TProperty.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Vector2 from '../../dot/js/Vector2.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import { combineOptions, optionize3, OptionizeDefaults } from '../../phet-core/js/optionize.js';
import PickOptional from '../../phet-core/js/types/PickOptional.js';
import ParallelDOM, { TrimParallelDOMOptions } from '../../scenery/js/accessibility/pdom/ParallelDOM.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import TColor from '../../scenery/js/util/TColor.js';
import { RoundButtonOptions } from '../../sun/js/buttons/RoundButton.js';
import RoundMomentaryButton from '../../sun/js/buttons/RoundMomentaryButton.js';
import RoundStickyToggleButton from '../../sun/js/buttons/RoundStickyToggleButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from './ShadedSphereNode.js';
import { linear } from '../../dot/js/util/linear.js';

type ButtonType = 'toggle' | 'momentary';

type ButtonOptions = PickOptional<RoundButtonOptions, 'baseColor' | 'radius' | 'xMargin' |
  'yMargin' | 'touchAreaDilation' | 'mouseAreaDilation' | 'rotation' | 'accessibleName' | 'accessibleHelpText'>;

type SelfOptions = {

  // nozzle and body options
  bodySize?: Dimension2;
  nozzleSize?: Dimension2;
  topColor?: TColor;
  bottomColor?: TColor;
  highlightColor?: TColor;
  highlightColorStop?: number;  // color stop for highlight, (0,1) exclusive range
  stroke?: TColor;
  lineWidth?: number;
  cornerRadius?: number;

  // button options
  hasButton?: boolean; // other button options are ignored if this is false
  buttonType?: ButtonType;
  buttonOptions?: ButtonOptions;

  // where to position the button within the body
  getButtonLocation?: ( bodyNode: Node ) => Vector2;

  // When enabled, the glass shows a semi-circular blue-ish lens on the output of the laser pointer node.
  // It does not change the origin of the laser pointer node, which is at the center of the casing.  The glass is
  // sometimes used to help cue the user that it is a non-laser light source.
  // See https://github.com/phetsims/scenery-phet/issues/366
  hasGlass?: boolean;

  // propagated to ShadedSphereNode, used to draw the lens at the output of the laser pointer
  glassOptions?: {

    // The fraction of the nozzle height, between 0 (no height) and 1 (the nozzle height)
    heightProportion?: number;

    // The amount the glass "sticks out" between 0 (not at all) and 1 (hemisphere)
    proportionStickingOut?: number;
  } & ShadedSphereNodeOptions;
};

export type LaserPointerNodeOptions = SelfOptions & TrimParallelDOMOptions<NodeOptions>;

const DEFAULT_OPTIONS: OptionizeDefaults<SelfOptions, NodeOptions> = {

  // nozzle and body options
  bodySize: new Dimension2( 110, 78 ),
  nozzleSize: new Dimension2( 20, 60 ),
  topColor: 'rgb( 170, 170, 170 )',
  bottomColor: 'rgb( 40, 40, 40 )',
  highlightColor: 'rgb( 245, 245, 245 )',
  highlightColorStop: 0.3,  // {number} color stop for highlight, (0,1) exclusive range
  stroke: 'black',
  lineWidth: 1,
  cornerRadius: 5,

  // button options
  hasButton: true, // {boolean} other button options are ignore if this is false
  buttonType: 'toggle', // {string} 'toggle'|'momentary'
  buttonOptions: {
    baseColor: 'red',
    radius: 22,
    xMargin: 10,
    yMargin: 10,
    touchAreaDilation: 15,
    mouseAreaDilation: 0,
    rotation: 0 // {number} use this to adjust lighting on the button
  },

  // where to position the button within the body
  getButtonLocation: ( bodyNode: Node ) => bodyNode.center,

  hasGlass: false,

  // Glass options, nested as discussed in https://github.com/phetsims/tasks/issues/730
  glassOptions: {
    mainColor: 'rgb(188,225,238)',
    highlightColor: 'white',
    shadowColor: 'white',
    stroke: 'black',
    heightProportion: 0.7,
    proportionStickingOut: 0.5
  },

  tandem: Tandem.REQUIRED,
  tandemNameSuffix: [ 'LaserPointerNode', 'LightNode' ]
};
assert && Object.freeze( DEFAULT_OPTIONS );

export default class LaserPointerNode extends Node {

  private readonly disposeLaserPointerNode: () => void;

  // Read-only access to see if the pointer is over the button specifically, ok to add listeners, but do not mutate.
  public readonly onOffButton: Node | null = null;

  public static readonly DEFAULT_LASER_NODE_OPTIONS = DEFAULT_OPTIONS;

  /**
   * @param onProperty - is the laser on?
   * @param providedOptions
   */
  public constructor( onProperty: TProperty<boolean>, providedOptions?: LaserPointerNodeOptions ) {

    const options = optionize3<LaserPointerNodeOptions, SelfOptions, NodeOptions>()(
      {}, DEFAULT_OPTIONS, providedOptions );

    assert && assert( options.highlightColorStop > 0 && options.highlightColorStop < 1 );
    assert && assert( options.glassOptions.heightProportion! >= 0 && options.glassOptions.heightProportion! <= 1 );
    assert && assert( options.glassOptions.proportionStickingOut! >= 0 && options.glassOptions.proportionStickingOut! <= 1 );

    const children = [];

    // the narrow part that the light will come out of
    const nozzleNode = new Rectangle( 0, 0, options.nozzleSize.width + options.cornerRadius, options.nozzleSize.height, {
      cornerRadius: options.cornerRadius,
      fill: new LinearGradient( 0, 0, 0, options.nozzleSize.height )
        .addColorStop( 0, options.topColor )
        .addColorStop( options.highlightColorStop, options.highlightColor )
        .addColorStop( 1, options.bottomColor ),
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      right: 0,
      centerY: 0
    } );
    children.push( nozzleNode );

    // the main body of the laser pointer
    const bodyNode = new Rectangle( 0, 0, options.bodySize.width, options.bodySize.height, {
      cornerRadius: options.cornerRadius,
      fill: new LinearGradient( 0, 0, 0, options.bodySize.height )
        .addColorStop( 0, options.topColor )
        .addColorStop( options.highlightColorStop, options.highlightColor )
        .addColorStop( 1, options.bottomColor ),
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      right: nozzleNode.left + options.cornerRadius, // overlap to hide corner radius
      centerY: nozzleNode.centerY
    } );
    children.push( bodyNode );

    // the optional button that controls whether the laser is on or off
    let onOffButton: Node | null = null;
    if ( options.hasButton ) {

      const buttonOptions = combineOptions<RoundButtonOptions>( options.buttonOptions, {
        center: options.getButtonLocation( bodyNode ),
        tandem: options.tandem.createTandem( 'button' )
      } );

      onOffButton = ( options.buttonType === 'toggle' ) ?
                    new RoundStickyToggleButton( onProperty, false, true, buttonOptions ) :
                    new RoundMomentaryButton( onProperty, false, true, buttonOptions );

      children.push( onOffButton );
    }

    // optional glass (lens)
    if ( options.hasGlass ) {
      const glassDiameter = options.nozzleSize.height * options.glassOptions.heightProportion!;
      const glassOptions = merge( {}, options.glassOptions, {

        // The origin is at the output point of the nozzle, translate accordingly
        centerX: linear( 0, 1, -glassDiameter / 2, 0, options.glassOptions.proportionStickingOut! ),

        // Center vertically
        centerY: 0
      } );
      const glassNode = new ShadedSphereNode( glassDiameter, glassOptions );

      // Glass is behind everything else.
      children.unshift( glassNode );
    }

    // add any children specified by the client
    options.children = children.concat( options.children || [] );

    super( options );

    if ( onOffButton ) {
      this.onOffButton = onOffButton;
      ParallelDOM.forwardAccessibleName( this, onOffButton );
      ParallelDOM.forwardHelpText( this, onOffButton );
    }

    this.disposeLaserPointerNode = () => {
      onOffButton && onOffButton.dispose();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'LaserPointerNode', this );
  }

  public override get enabled(): boolean { return this.isEnabled(); }

  public override set enabled( value: boolean ) { this.setEnabled( value ); }

  public override dispose(): void {
    this.disposeLaserPointerNode();
    super.dispose();
  }
}

sceneryPhet.register( 'LaserPointerNode', LaserPointerNode );