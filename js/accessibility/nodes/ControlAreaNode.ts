// Copyright 2018-2022, University of Colorado Boulder

/**
 * A node that creates a "Control Area" accessible section in the PDOM. This organizational Node should have accessible
 * content to be displayed under it in the PDOM. This content can be added as a child, or added via `pdomOrder`.
 * Items in this section are designed to be secondary to that in the PlayAreaNode. See ScreenView for more documentation
 * and usage explanation.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import sceneryPhet from '../../sceneryPhet.js';
import sceneryPhetStrings from '../../sceneryPhetStrings.js';
import PDOMSectionNode, { PDOMSectionNodeOptions } from '../PDOMSectionNode.js';

type SelfOptions = EmptyObjectType;
export type ControlAreaNodeOptions = SelfOptions & PDOMSectionNodeOptions;

export default class ControlAreaNode extends PDOMSectionNode {
  public constructor( providedOptions?: ControlAreaNodeOptions ) {
    super( sceneryPhetStrings.a11y.simSection.controlArea, providedOptions );
  }
}

sceneryPhet.register( 'ControlAreaNode', ControlAreaNode );