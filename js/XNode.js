// Copyright 2022, University of Colorado Boulder

// @ts-nocheck
/**
 * XNode is a specialized view for displaying a 'x'. It is used throughout the sim to indicate the center of mass
 * of a system of Balls. Generalized to appear as a icon as well.
 *
 * XNode's rendering strategy is to sub-type PlusNode and rotate the Node 45 degrees.
 *
 * @author Brandon Li
 * @author Alex Schor
 */
import sceneryPhet from './sceneryPhet.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import merge from '../../phet-core/js/merge.js';
import PlusNode from './PlusNode.js';
class XNode extends PlusNode {
  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    options = merge( {
      legThickness: 6, // {number} - thickness of the legs of the 'x'
      length: 22,      // {number} - the length of the diagonal of the 'x'.
      // super-class options
      lineWidth: 1.5
    }, options );
    //----------------------------------------------------------------------------------------
    // Set super-class options that cannot be overridden.
    assert && assert( !options.size, 'XNode sets size' );
    assert && assert( !options.rotation, 'XNode sets rotation' );
    options.size = new Dimension2( options.length, options.legThickness );
    options.rotation = Math.PI / 4;
    super( options );
  }
}
sceneryPhet.register( 'XNode', XNode );
export default XNode;