// Copyright 2025, University of Colorado Boulder

/**
 * Definitions for keyboard keys used when constructing help icons and descriptions. Consolidates the
 * label Properties and Node builders so both stay in sync and all are defined in one place.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../perennial-alias/js/browser-and-node/affirm.js';
import type { EnglishKeyString } from '../../../scenery/js/accessibility/EnglishStringToCodeMap.js';
import Node from '../../../scenery/js/nodes/Node.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import ArrowKeyNode from './ArrowKeyNode.js';
import LetterKeyNode from './LetterKeyNode.js';
import TextKeyNode from './TextKeyNode.js';

type KeyDisplayDefinition = {
  labelStringProperty?: TReadOnlyProperty<string>;
  buildNode?: () => Node;
};

const KeyDisplayRegistry: Partial<Record<EnglishKeyString, KeyDisplayDefinition>> = {
  shift: {
    labelStringProperty: SceneryPhetFluent.key.shiftStringProperty,
    buildNode: () => TextKeyNode.shift()
  },
  alt: {
    labelStringProperty: TextKeyNode.getAltKeyString(),
    buildNode: () => TextKeyNode.altOrOption()
  },
  escape: {
    labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.escapeStringProperty,
    buildNode: () => TextKeyNode.esc()
  },
  arrowLeft: {
    labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.leftArrowStringProperty,
    buildNode: () => new ArrowKeyNode( 'left' )
  },
  arrowRight: {
    labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.rightArrowStringProperty,
    buildNode: () => new ArrowKeyNode( 'right' )
  },
  arrowUp: {
    labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.upArrowStringProperty,
    buildNode: () => new ArrowKeyNode( 'up' )
  },
  arrowDown: {
    labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.downArrowStringProperty,
    buildNode: () => new ArrowKeyNode( 'down' )
  },
  pageUp: {
    labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.pageUpStringProperty,
    buildNode: () => TextKeyNode.pageUp()
  },
  pageDown: {
    labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.pageDownStringProperty,
    buildNode: () => TextKeyNode.pageDown()
  },
  home: {
    labelStringProperty: SceneryPhetFluent.key.homeStringProperty,
    buildNode: () => TextKeyNode.home()
  },
  end: {
    labelStringProperty: SceneryPhetFluent.key.endStringProperty,
    buildNode: () => TextKeyNode.end()
  },
  space: {
    labelStringProperty: SceneryPhetFluent.key.spaceStringProperty,
    buildNode: () => TextKeyNode.space()
  },
  tab: {
    labelStringProperty: SceneryPhetFluent.key.tabStringProperty,
    buildNode: () => TextKeyNode.tab()
  },
  enter: {
    labelStringProperty: SceneryPhetFluent.key.enterStringProperty,
    buildNode: () => TextKeyNode.enter()
  },
  backspace: {
    labelStringProperty: SceneryPhetFluent.key.backspaceStringProperty,
    buildNode: () => TextKeyNode.backspace()
  },
  delete: {
    labelStringProperty: SceneryPhetFluent.key.deleteStringProperty,
    buildNode: () => TextKeyNode.delete()
  }
};

const LETTER_KEYS = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
] as const;

const DIGIT_KEY_TO_NAME = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine'
} as const;


// Building up the registry for letter keys programmatically in an attempt to reduce manual entries.
LETTER_KEYS.forEach( letter => {
  const labelProperty = ( SceneryPhetFluent.key as Record<string, TReadOnlyProperty<string>> )[ `${letter}StringProperty` ];
  const builder = ( LetterKeyNode as unknown as Record<string, () => Node> )[ letter ];

  KeyDisplayRegistry[ letter ] = {
    labelStringProperty: labelProperty,
    buildNode: builder || undefined
  };
} );

// Building up the registry for digit keys programmatically in an attempt to reduce manual entries.
Object.entries( DIGIT_KEY_TO_NAME ).forEach( ( [ key, name ] ) => {
  const labelProperty = ( SceneryPhetFluent.key as Record<string, TReadOnlyProperty<string>> )[ `${name}StringProperty` ];
  const builder = ( LetterKeyNode as unknown as Record<string, () => Node> )[ name ];

  KeyDisplayRegistry[ key as EnglishKeyString ] = {
    labelStringProperty: labelProperty,
    buildNode: builder || undefined
  };
} );

/**
 * Retrieve the localized label Property for a given key. Asserts if the key is not configured in the registry.
 */
export const getKeyLabelProperty = ( key: EnglishKeyString ): TReadOnlyProperty<string> => {
  const labelProperty = KeyDisplayRegistry[ key ]?.labelStringProperty;
  affirm( labelProperty, `No label configured for key "${key}". Please add it to the registry.` );
  return labelProperty;
};

/**
 * Retrieve the Node builder function for a given key. Asserts if the key is not configured in the registry.
 */
export const getKeyBuilder = ( key: EnglishKeyString ): ( () => Node ) => {
  const builder = KeyDisplayRegistry[ key ]?.buildNode;
  affirm( builder, `No key builder configured for key "${key}". Please add it to the registry.` );
  return builder;
};

export default KeyDisplayRegistry;
