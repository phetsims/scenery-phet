// Copyright 2025, University of Colorado Boulder

/**
 * A Node that displays a visual cue to use space to grab and release a component.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import TextKeyNode from '../../keyboard/TextKeyNode.js';
import sceneryPhet from '../../sceneryPhet.js';
import KeyboardCueNode, { KeyboardCueNodeOptions } from './KeyboardCueNode.js';

type SelfOptions = EmptySelfOptions;
export type GrabReleaseCueNodeOptions = SelfOptions & StrictOmit<KeyboardCueNodeOptions, 'createKeyNode'>;

export default class GrabReleaseCueNode extends KeyboardCueNode {
  public constructor( providedOptions?: GrabReleaseCueNodeOptions ) {
    const options = optionize<GrabReleaseCueNodeOptions, SelfOptions, KeyboardCueNodeOptions>()( {
      createKeyNode: TextKeyNode.space
    }, providedOptions );

    super( options );
  }
}

sceneryPhet.register( 'GrabReleaseCueNode', GrabReleaseCueNode );