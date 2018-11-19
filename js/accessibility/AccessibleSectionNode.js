// Copyright 2017-2018, University of Colorado Boulder

/**
 * A container type for accessible content. The container is a Node (Scenery display object),
 * so its children will be other Nodes that may or may not have accessible content. The accessible content is a
 * 'section' element under the an 'H2' label.  Children are contained under a 'div' element, and labels will come
 * before the accessible content of the children.
 * 
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @constructor
   * @param {string} label
   * @param {Object} options
   */
  function AccessibleSectionNode( label, options ) {
    assert && assert( label && typeof label === 'string', 'Accessible section must have a label' );

    // options for accessibility, but others can be passed to Node call
    options = _.extend( {
      containerTagName: 'section',
      tagName: 'div',
      labelContent: label,
      labelTagName: 'h2'
    }, options );

    Node.call( this, options );
  }

  sceneryPhet.register( 'AccessibleSectionNode', AccessibleSectionNode );

  return inherit( Node, AccessibleSectionNode );
} );
