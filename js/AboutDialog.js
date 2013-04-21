/**
 * Shows the about dialog.
 *
 * @author Sam Reid
 */
define( function( require ) {
  "use strict";

  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayArea = require( 'SCENERY_PHET/PlayArea' );
  var PanelNode = require( 'SUN/PanelNode' );

  function AboutDialog() {
    var aboutDialog = this;

    //Use PlayArea to help center and scale content
    PlayArea.call( this );

    function text( string ) { return new Text( string, {fontSize: 24} ) }

    var content = new VBox( {spacing: 10, children: [
      text( 'About Forces and Motion: Basics' ),
      text( 'PhET Interactive Simulations' ),
      text( 'Copyright © 2004-2013 University of Colorado Boulder' ),
      text( 'Version 0.0.0' )
    ]} );

    this.addChild( new PanelNode( content ).mutate( {centerX: this.layoutBounds.centerX, centerY: this.layoutBounds.centerY} ) );

    function resize() {
      aboutDialog.layout( $( window ).width(), $( window ).height() );
    }

    this.addInputListener( {down: function() {
      aboutDialog.detach();
    }} );

    //Fit to the window and render the initial scene
    $( window ).resize( resize );
    resize();
  }

  inherit( AboutDialog, PlayArea );

  return AboutDialog;
} );