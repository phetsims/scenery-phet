// Copyright 2015-2020, University of Colorado Boulder

/**
 * Warning displayed when we have to fall back to Canvas
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../phet-core/js/inherit.js';
import openPopup from '../../phet-core/js/openPopup.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Text from '../../scenery/js/nodes/Text.js';
import VBox from '../../scenery/js/nodes/VBox.js';
import FontAwesomeNode from '../../sun/js/FontAwesomeNode.js';
import PhetFont from './PhetFont.js';
import sceneryPhetStrings from './scenery-phet-strings.js';
import sceneryPhet from './sceneryPhet.js';

const webglWarningBodyString = sceneryPhetStrings.webglWarning.body;
const webglWarningTitleString = sceneryPhetStrings.webglWarning.title;

/**
 * @constructor
 */
function CanvasWarningNode() {
  HBox.call( this, {
    children: [
      new FontAwesomeNode( 'warning_sign', {
        fill: '#E87600', // "safety orange", according to Wikipedia
        scale: 0.6
      } ),
      new VBox( {
        children: [
          new Text( webglWarningTitleString, {
            font: new PhetFont( 14 ),
            fill: '#ddd'
          } ),
          new Text( webglWarningBodyString, {
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
      openPopup( 'http://phet.colorado.edu/webgl-disabled-page?simLocale=' + phet.joist.sim.locale );
    }
  } );
}

sceneryPhet.register( 'CanvasWarningNode', CanvasWarningNode );

inherit( HBox, CanvasWarningNode );
export default CanvasWarningNode;