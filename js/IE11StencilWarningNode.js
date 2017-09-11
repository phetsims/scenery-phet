// Copyright 2015-2017, University of Colorado Boulder

/**
 * Warning displayed when we have to fall back to Canvas (not due to normal lack-of-WebGL reasons, but specifically for
 * IE11 that is too low of a version). See https://github.com/phetsims/molecule-shapes/issues/133 and
 * https://github.com/phetsims/molecule-shapes/issues/132.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var webglWarningIe11StencilBodyString = require( 'string!SCENERY_PHET/webglWarning.ie11StencilBody' );
  var webglWarningTitleString = require( 'string!SCENERY_PHET/webglWarning.title' );

  /**
   * @constructor
   */
  function IE11StencilWarningNode() {
    Tandem.indicateUninstrumentedCode();

    HBox.call( this, _.extend( {
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
        var phetWindow = window.open( 'http://windowsupdate.microsoft.com/', '_blank' );
        phetWindow.focus();
      }
    } );
  }

  sceneryPhet.register( 'IE11StencilWarningNode', IE11StencilWarningNode );

  return inherit( HBox, IE11StencilWarningNode );
} );
