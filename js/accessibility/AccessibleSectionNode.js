// Copyright 2017-2020, University of Colorado Boulder

/**
 * A container type for accessible content. The container is a Node (Scenery display object),
 * so its children will be other Nodes that may or may not have accessible content. The accessible content is a
 * 'section' element under the an 'H2' label.  Children are contained under a 'div' element, and labels will come
 * before the accessible content of the children.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import Node from '../../../scenery/js/nodes/Node.js';
import sceneryPhet from '../sceneryPhet.js';

class AccessibleSectionNode extends Node {

  /**
   * @param {string} label
   * @param {Object} [options]
   */
  constructor( label, options ) {
    assert && assert( label && typeof label === 'string', 'Accessible section must have a label' );

    // options for accessibility, but others can be passed to Node call
    options = merge( {
      containerTagName: 'section',
      tagName: 'div',
      labelContent: label,
      labelTagName: 'h2'
    }, options );

    super( options );
  }
}

sceneryPhet.register( 'AccessibleSectionNode', AccessibleSectionNode );
export default AccessibleSectionNode;