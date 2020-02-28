// Copyright 2015-2020, University of Colorado Boulder

/**
 * Warning displayed when we have to fall back to Canvas (not due to normal lack-of-WebGL reasons, but specifically for
 * IE11 that is too low of a version). See https://github.com/phetsims/molecule-shapes/issues/133 and
 * https://github.com/phetsims/molecule-shapes/issues/132.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import openPopup from '../../phet-core/js/openPopup.js';
import HBox from '../../scenery/js/nodes/HBox.js';
import Text from '../../scenery/js/nodes/Text.js';
import VBox from '../../scenery/js/nodes/VBox.js';
import FontAwesomeNode from '../../sun/js/FontAwesomeNode.js';
import PhetFont from './PhetFont.js';
import sceneryPhetStrings from './scenery-phet-strings.js';
import sceneryPhet from './sceneryPhet.js';

const webglWarningIe11StencilBodyString = sceneryPhetStrings.webglWarning.ie11StencilBody;
const webglWarningTitleString = sceneryPhetStrings.webglWarning.title;

/**
 * @constructor
 */
function IE11StencilWarningNode() {
  HBox.call( this, merge( {
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
          new Text( webglWarningIe11StencilBodyString, {
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
  } ) );

  this.mouseArea = this.touchArea = this.localBounds;

  this.addInputListener( {
    up: function() {
      openPopup( 'http://windowsupdate.microsoft.com/' );
    }
  } );
}

sceneryPhet.register( 'IE11StencilWarningNode', IE11StencilWarningNode );

inherit( HBox, IE11StencilWarningNode );
export default IE11StencilWarningNode;