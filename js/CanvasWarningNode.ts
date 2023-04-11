// Copyright 2015-2023, University of Colorado Boulder

/**
 * Warning displayed when we have to fall back to Canvas
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { HBox, openPopup, Path, Text, VBox } from '../../scenery/js/imports.js';
import exclamationTriangleSolidShape from '../../sherpa/js/fontawesome-5/exclamationTriangleSolidShape.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';

export default class CanvasWarningNode extends HBox {

  private readonly disposeCanvasWarningNode: () => void;

  public constructor() {

    const titleText = new Text( SceneryPhetStrings.webglWarning.titleStringProperty, {
      font: new PhetFont( 14 ),
      fill: '#ddd'
    } );

    const bodyText = new Text( SceneryPhetStrings.webglWarning.bodyStringProperty, {
      font: new PhetFont( 10 ),
      fill: '#999'
    } );

    super( {
      children: [
        new Path( exclamationTriangleSolidShape, {
          fill: '#E87600', // "safety orange", according to Wikipedia
          scale: 0.048
        } ),
        new VBox( {
          children: [ titleText, bodyText ],
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
        const joistGlobal = _.get( window, 'phet.joist', null ); // returns null if global isn't found
        const locale = joistGlobal ? joistGlobal.sim.locale : 'en';
        openPopup( `https://phet.colorado.edu/webgl-disabled-page?simLocale=${locale}` );
      }
    } );

    this.disposeCanvasWarningNode = () => {
      titleText.dispose();
      bodyText.dispose();
    };
  }

  public override dispose(): void {
    this.disposeCanvasWarningNode();
    super.dispose();
  }
}

sceneryPhet.register( 'CanvasWarningNode', CanvasWarningNode );