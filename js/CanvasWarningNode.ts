// Copyright 2015-2022, University of Colorado Boulder

/**
 * Warning displayed when we have to fall back to Canvas
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { HBox, openPopup, Path, Text, VBox } from '../../scenery/js/imports.js';
import exclamationTriangleSolidShape from '../../sherpa/js/fontawesome-5/exclamationTriangleSolidShape.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';

export default class CanvasWarningNode extends HBox {

  public constructor() {

    super( {
      children: [
        new Path( exclamationTriangleSolidShape, {
          fill: '#E87600', // "safety orange", according to Wikipedia
          scale: 0.048
        } ),
        new VBox( {
          children: [
            new Text( sceneryPhetStrings.webglWarning.title, {
              font: new PhetFont( 14 ),
              fill: '#ddd'
            } ),
            new Text( sceneryPhetStrings.webglWarning.body, {
              font: new PhetFont( 10 ),
              fill: '#999'
            } )
          ],
          spacing: 3,
          align: 'left'
        } )
      ],
      spacing: 12,
      align: 'center',
      cursor: 'pointer'
    } );

    this.mouseArea = this.touchArea = this.localBounds;

    this.addInputListener( {
      up: function() {
        openPopup( `https://phet.colorado.edu/webgl-disabled-page?simLocale=${phet.joist.sim.locale}` );
      }
    } );
  }
}

sceneryPhet.register( 'CanvasWarningNode', CanvasWarningNode );