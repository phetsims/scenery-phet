// Copyright 2019-2022, University of Colorado Boulder

/**
 * BannedNode is the universal "no" symbol, which shows a circle with a line through it, see
 * https://en.wikipedia.org/wiki/No_symbol. It's known by a number of  different emoji names, include "banned", see
 * https://emojipedia.org/no-entry-sign/.  It is also referred to as a prohibition sign.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import PickOptional from '../../phet-core/js/types/PickOptional.js';
import { Circle, Line, Node, NodeOptions, PaintableOptions } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {
  radius?: number;
} & PickOptional<PaintableOptions, 'lineWidth' | 'stroke' | 'fill'>;

export type BannedNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class BannedNode extends Node {

  public constructor( providedOptions?: BannedNodeOptions ) {

    const options = optionize<BannedNodeOptions, SelfOptions, NodeOptions>()( {
      radius: 20,
      lineWidth: 5,
      stroke: 'red',
      fill: null
    }, providedOptions );

    const circleNode = new Circle( options.radius, {
      lineWidth: options.lineWidth,
      stroke: options.stroke,
      fill: options.fill
    } );

    const slashNode = new Line( 0, 0, 2 * options.radius, 0, {
      lineWidth: options.lineWidth,
      stroke: options.stroke,
      rotation: Math.PI / 4,
      center: circleNode.center
    } );

    options.children = [ circleNode, slashNode ];

    super( options );
  }
}

sceneryPhet.register( 'BannedNode', BannedNode );