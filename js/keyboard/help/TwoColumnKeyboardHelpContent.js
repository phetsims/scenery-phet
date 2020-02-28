// Copyright 2019-2020, University of Colorado Boulder

/**
 * An HBox with content for a KeyboardHelpDialog. Most KeyboardHelpDialogs have two columns of
 * content, each with one or more KeyboardHelpSection.
 *
 * @author Jesse Greenberg
 */

import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import sceneryPhet from '../../sceneryPhet.js';

class TwoColumnKeyboardHelpContent extends Node {

  /**
   * @param {[].<Node>} leftSections
   * @param {[].<Node>} rightSections
   * @param {Object} [options]
   */
  constructor( leftSections, rightSections, options ) {
    assert && assert( Array.isArray( leftSections ) && Array.isArray( rightSections ), 'sections must be passed in as arrays' );

    options = merge( {

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
    const leftColumn = new VBox( merge( {}, columnOptions, { children: leftSections } ) );
    const rightColumn = new VBox( merge( {}, columnOptions, { children: rightSections } ) );

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

sceneryPhet.register( 'TwoColumnKeyboardHelpContent', TwoColumnKeyboardHelpContent );
export default TwoColumnKeyboardHelpContent;