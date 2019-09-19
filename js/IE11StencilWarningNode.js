// Copyright 2015-2019, University of Colorado Boulder

/**
 * Warning displayed when we have to fall back to Canvas (not due to normal lack-of-WebGL reasons, but specifically for
 * IE11 that is too low of a version). See https://github.com/phetsims/molecule-shapes/issues/133 and
 * https://github.com/phetsims/molecule-shapes/issues/132.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const openPopup = require( 'PHET_CORE/openPopup' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const webglWarningIe11StencilBodyString = require( 'string!SCENERY_PHET/webglWarning.ie11StencilBody' );
  const webglWarningTitleString = require( 'string!SCENERY_PHET/webglWarning.title' );

  /**
   * @constructor
   */
  function IE11StencilWarningNode() {
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
        openPopup( 'http://windowsupdate.microsoft.com/' );
      }
    } );
  }

  sceneryPhet.register( 'IE11StencilWarningNode', IE11StencilWarningNode );

  return inherit( HBox, IE11StencilWarningNode );
} );
