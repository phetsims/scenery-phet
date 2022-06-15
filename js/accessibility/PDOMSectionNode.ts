// Copyright 2017-2022, University of Colorado Boulder

/**
 * A container type for content in the PDOM for screen reader accessibility. The container is a Node
 * (Scenery display object), so its children will be other Nodes that may or may not have accessible content.
 * The accessible content is a 'section' element under the an 'H2' label.  Children are contained under a 'div'
 * element, and labels will come before the accessible content of the children.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize from '../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../phet-core/js/types/EmptyObjectType.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import { Node, NodeOptions } from '../../../scenery/js/imports.js';
import sceneryPhet from '../sceneryPhet.js';

type SelfOptions = EmptyObjectType;
export type PDOMSectionNodeOptions = SelfOptions &
  StrictOmit<NodeOptions, 'containerTagName' | 'tagName' | 'labelContent' | 'labelTagName'>;

export default class PDOMSectionNode extends Node {

  public constructor( label: string, providedOptions?: PDOMSectionNodeOptions ) {
    super( optionize<PDOMSectionNodeOptions, SelfOptions, NodeOptions>()( {

      // accessibility options controlled by PDOMSectionNode
      containerTagName: 'section',
      tagName: 'div',
      labelContent: label,
      labelTagName: 'h2'
    }, providedOptions ) );
  }
}

sceneryPhet.register( 'PDOMSectionNode', PDOMSectionNode );