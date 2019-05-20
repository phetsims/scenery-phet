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
  const VBox = require( 'SCENERY/nodes/VBox' );

  class TwoColumnKeyboardHelpContent extends Node {

    /**
     * @param {[].<Node>} leftSections
     * @param {[].<Node>} rightSections
     * @param {Object} options
     */
    constructor( leftSections, rightSections, options ) {
      assert && assert( Array.isArray( leftSections) && Array.isArray( rightSections ), 'sections must be passed in as arrays' );

      options = _.extend( {

        // spacing between the left and right columns of the help content
        columnSpacing: 30,

        // vertical spacing between KeyboardHelpSections in each column
        sectionSpacing: 30
      }, options );

      assert && assert( options.align === undefined, 'TwoColumnKeyboardHelpContent sets column alignment' );
      options.align = 'top';

      const columnOptions = {
        align: 'left',
        spacing: options.sectionSpacing
      };
      const leftColumn = new VBox( _.extend( {}, columnOptions, { children: leftSections } ) );
      const rightColumn = new VBox( _.extend( {}, columnOptions, { children: rightSections } ) );

      const hBox = new HBox( {
        children: [ leftColumn, rightColumn ],
        spacing: options.columnSpacing,
        align: 'top'
      } );

      assert && assert( !options.children, 'TwoColumnKeyboardHelpContent sets children' );
      options.children = [ hBox ];

      super( options );
    }
  }

  return sceneryPhet.register( 'TwoColumnKeyboardHelpContent', TwoColumnKeyboardHelpContent );
} );