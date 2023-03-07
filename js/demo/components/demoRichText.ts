// Copyright 2022-2023, University of Colorado Boulder

/**
 * Demo for RichText
 *
 * @author Jonathan Olson
 */

import { HBox, Node, RichText, VBox } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

export default function demoRichText( layoutBounds: Bounds2 ): Node {
  return new VBox( {
    spacing: 15,
    children: [
      new RichText( 'RichText can have <b>bold</b> and <i>italic</i> text.' ),
      new RichText( 'Can do H<sub>2</sub>O (A<sub>sub</sub> and A<sup>sup</sup>), or nesting: x<sup>2<sup>2</sup></sup>' ),
      new RichText( 'Additionally: <span style="color: blue;">color</span>, <span style="font-size: 30px;">sizes</span>, <span style="font-family: serif;">faces</span>, <s>strikethrough</s>, and <u>underline</u>' ),
      new RichText( 'These <b><em>can</em> <u><span style="color: red;">be</span> mixed<sup>1</sup></u></b>.' ),
      new RichText( '\u202aHandles bidirectional text: \u202b<span style="color: #0a0;">مقابض</span> النص ثنائي <b>الاتجاه</b><sub>2</sub>\u202c\u202c' ),
      new RichText( '\u202b\u062a\u0633\u062a (\u0632\u0628\u0627\u0646)\u202c' ),
      new RichText( 'HTML entities need to be escaped, like &amp; and &lt;.' ),
      new RichText( 'Supports <a href="{{phetWebsite}}"><em>links</em> with <b>markup</b></a>, and <a href="{{callback}}">links that call functions</a>.', {
        links: {
          phetWebsite: 'https://phet.colorado.edu',
          callback: () => {
            console.log( 'demo' );
          }
        }
      } ),
      new RichText( 'Or also <a href="https://phet.colorado.edu">links directly in the string</a>.', {
        links: true
      } ),
      new HBox( {
        spacing: 30,
        children: [
          new RichText( 'Multi-line text with the<br>separator &lt;br&gt; and <a href="https://phet.colorado.edu">handles<br>links</a> and other <b>tags<br>across lines</b>', {
            links: true
          } ),
          new RichText( 'Supposedly RichText supports line wrapping. Here is a lineWrap of 300, which should probably wrap multiple times here', { lineWrap: 300 } )
        ]
      } )
    ],
    center: layoutBounds.center
  } );
}