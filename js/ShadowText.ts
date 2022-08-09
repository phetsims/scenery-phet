// Copyright 2014-2022, University of Colorado Boulder

/**
 * Text with a drop shadow.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import { Font, TPaint, Node, NodeOptions, Text } from '../../scenery/js/imports.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

type SelfOptions = {

  font?: Font;

  // for foreground Text node
  fill?: TPaint;
  stroke?: TPaint;

  // for background (shadow) Text node
  shadowFill?: TPaint;
  shadowXOffset?: number;
  shadowYOffset?: number;
};

export type ShadowTextOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class ShadowText extends Node {

  public constructor( text: string, providedOptions?: ShadowTextOptions ) {

    const options = optionize<ShadowTextOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      font: new PhetFont( 24 ),
      fill: 'lightGray',
      stroke: null,
      shadowFill: 'black',
      shadowXOffset: 3,
      shadowYOffset: 1
    }, providedOptions );

    options.children = [

      // background (shadow)
      new Text( text, {
        font: options.font,
        fill: options.shadowFill,
        x: options.shadowXOffset,
        y: options.shadowYOffset
      } ),

      // foreground
      new Text( text, {
        font: options.font,
        fill: options.fill,
        stroke: options.stroke
      } )
    ];

    super( options );
  }
}

sceneryPhet.register( 'ShadowText', ShadowText );