// Copyright 2019, University of Colorado Boulder

/**
 * An HBox with content for a KeyboardHelpDialog. Most KeyboardHelpDialogs have two columns of
 * content, each with one or more KeyboardHelpSection.
 * 
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  class TwoColumnKeyboardHelpContent extends Node {

    /**
     * @param {Node} leftNode
     * @param {Node} rightNode
     * @param {Object} options
     */
    constructor( leftNode, rightNode, options ) {

      options = _.extend( {

        // determined by inspection, but may need to be adjusted depending on content
        spacing: 30
      }, options );

      assert && assert( options.align === undefined, 'TwoColumnKeyboardHelpContent sets column alignment' );
      options.align = 'top';

      const hBox = new HBox( {
        children: [ leftNode, rightNode ],
        spacing: options.spacing,
        align: 'top'
      } );

      assert && assert( !options.children, 'TwoColumnKeyboardHelpContent sets children' );
      options.children = [ hBox ];

      super( options );
    }
  }

  return sceneryPhet.register( 'TwoColumnKeyboardHelpContent', TwoColumnKeyboardHelpContent );
} );