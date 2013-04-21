/**
 * Shows the about dialog.
 *
 * @author Sam Reid
 */
define( function( require ) {
  "use strict";

  var Node = require( 'SCENERY/nodes/Node' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Layout = require( 'SCENERY_PHET/Layout' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function AboutDialog() {
    var aboutDialog = this;
    Node.call( this );

    this.addChild( new Rectangle( 0, 0, 400, 400, 10, 10, {fill: 'white', stroke: 'gray', lineWidth: 2, centerX: 400, centerY: 400} ) );
  }

  inherit( AboutDialog, Node );

  return AboutDialog;
} );