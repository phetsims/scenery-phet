// Copyright 2018-2022, University of Colorado Boulder

/**
 * A node that creates a "Play Area" accessible section in the PDOM. This organizational Node should have accessible
 * content to be displayed under it in the PDOM. This content can be added as a child, or added via `pdomOrder`.
 * Items in this section are designed to be the "main interaction and pedagogical learning" to be had for the screen.
 * See ScreenView for more documentation and usage explanation.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import PDOMSectionNode, { PDOMSectionNodeOptions } from '../PDOMSectionNode.js';

type SelfOptions = {};
export type PlayAreaNodeOptions = SelfOptions & PDOMSectionNodeOptions;

export default class PlayAreaNode extends PDOMSectionNode {
  public constructor( providedOptions?: PlayAreaNodeOptions ) {
    super( sceneryPhetStrings.a11y.simSection.playArea, providedOptions );
  }
}

sceneryPhet.register( 'PlayAreaNode', PlayAreaNode );