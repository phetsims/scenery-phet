// Copyright 2024-2026, University of Colorado Boulder

/**
 * BatteryNode is the view of a battery.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import TColor from '../../scenery/js/util/TColor.js';
import sceneryPhet from './sceneryPhet.js';

const DEFAULT_SIZE = new Dimension2( 165, 85 );

type SelfOptions = {
  size?: Dimension2; // dimensions of the battery
  stroke?: TColor; // stroke used for all elements of the battery
  lineWidth?: number; // lineWidth used for all elements of the battery
  terminalWidth?: number; // width of the positive terminal
};

export type BatteryNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class BatteryNode extends Node {

  public constructor( providedOptions?: BatteryNodeOptions ) {

    const options = optionize<BatteryNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      size: DEFAULT_SIZE,
      stroke: 'black',
      lineWidth: 1,
      terminalWidth: 7
    }, providedOptions );

    const negativeEndHeight = options.size.height;

    const negativeEndGradient = new LinearGradient( 0, 0, 0, negativeEndHeight )
      .addColorStop( 0.05, 'rgb( 102, 102, 102 )' )
      .addColorStop( 0.3, 'rgb( 173, 173, 173 )' )
      .addColorStop( 0.7, 'rgb( 40, 40, 40 )' );

    const negativeEndNode = new Rectangle( 0, 0, options.size.width, negativeEndHeight, {
      fill: negativeEndGradient,
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    const positiveEndHeight = options.size.height;

    const positiveEndGradient = new LinearGradient( 0, 0, 0, positiveEndHeight )
      .addColorStop( 0.05, 'rgb( 182, 103, 48 )' )
      .addColorStop( 0.3, 'rgb( 222, 218, 215 )' )
      .addColorStop( 0.7, 'rgb( 200, 99, 38 )' );

    const positiveEndNode = new Rectangle( 0, 0, 0.4 * options.size.width, positiveEndHeight, {
      fill: positiveEndGradient,
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      rightCenter: negativeEndNode.rightCenter
    } );

    const terminalHeight = 0.3 * options.size.height;

    const terminalGradient = new LinearGradient( 0, 0, 0, terminalHeight )
      .addColorStop( 0.05, 'rgb( 150, 150, 150 )' )
      .addColorStop( 0.3, 'rgb( 244, 244, 244 )' )
      .addColorStop( 0.7, 'rgb( 170, 170, 170 )' );

    const terminalNode = new Rectangle( 0, 0, options.terminalWidth, terminalHeight, {
      fill: terminalGradient,
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      left: negativeEndNode.right - options.lineWidth,
      centerY: negativeEndNode.centerY
    } );

    options.children = [ negativeEndNode, positiveEndNode, terminalNode ];

    super( options );
  }
}

sceneryPhet.register( 'BatteryNode', BatteryNode );
