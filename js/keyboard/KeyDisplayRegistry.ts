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
import NumberKeyNode from './NumberKeyNode.js';
import TextKeyNode from './TextKeyNode.js';

type KeyDisplayDefinition = {
  labelStringProperty?: TReadOnlyProperty<string>;
  buildNode?: () => Node;
};

/**
 * The main registry of key display definitions.
 *
 * Note that we cannot build this programmatically because PhET's build system requires static references to
 * all strings for extraction.
 */
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
  },
  a: {
    labelStringProperty: SceneryPhetFluent.key.aStringProperty,
    buildNode: LetterKeyNode.a
  },
  b: {
    labelStringProperty: SceneryPhetFluent.key.bStringProperty,
    buildNode: LetterKeyNode.b
  },
  c: {
    labelStringProperty: SceneryPhetFluent.key.cStringProperty,
    buildNode: LetterKeyNode.c
  },
  d: {
    labelStringProperty: SceneryPhetFluent.key.dStringProperty,
    buildNode: LetterKeyNode.d
  },
  e: {
    labelStringProperty: SceneryPhetFluent.key.eStringProperty,
    buildNode: LetterKeyNode.e
  },
  f: {
    labelStringProperty: SceneryPhetFluent.key.fStringProperty,
    buildNode: LetterKeyNode.f
  },
  g: {
    labelStringProperty: SceneryPhetFluent.key.gStringProperty,
    buildNode: LetterKeyNode.g
  },
  h: {
    labelStringProperty: SceneryPhetFluent.key.hStringProperty,
    buildNode: LetterKeyNode.h
  },
  i: {
    labelStringProperty: SceneryPhetFluent.key.iStringProperty,
    buildNode: LetterKeyNode.i
  },
  j: {
    labelStringProperty: SceneryPhetFluent.key.jStringProperty,
    buildNode: LetterKeyNode.j
  },
  k: {
    labelStringProperty: SceneryPhetFluent.key.kStringProperty,
    buildNode: LetterKeyNode.k
  },
  l: {
    labelStringProperty: SceneryPhetFluent.key.lStringProperty,
    buildNode: LetterKeyNode.l
  },
  m: {
    labelStringProperty: SceneryPhetFluent.key.mStringProperty,
    buildNode: LetterKeyNode.m
  },
  n: {
    labelStringProperty: SceneryPhetFluent.key.nStringProperty,
    buildNode: LetterKeyNode.n
  },
  o: {
    labelStringProperty: SceneryPhetFluent.key.oStringProperty,
    buildNode: LetterKeyNode.o
  },
  p: {
    labelStringProperty: SceneryPhetFluent.key.pStringProperty,
    buildNode: LetterKeyNode.p
  },
  q: {
    labelStringProperty: SceneryPhetFluent.key.qStringProperty,
    buildNode: LetterKeyNode.q
  },
  r: {
    labelStringProperty: SceneryPhetFluent.key.rStringProperty,
    buildNode: LetterKeyNode.r
  },
  s: {
    labelStringProperty: SceneryPhetFluent.key.sStringProperty,
    buildNode: LetterKeyNode.s
  },
  t: {
    labelStringProperty: SceneryPhetFluent.key.tStringProperty,
    buildNode: LetterKeyNode.t
  },
  u: {
    labelStringProperty: SceneryPhetFluent.key.uStringProperty,
    buildNode: LetterKeyNode.u
  },
  v: {
    labelStringProperty: SceneryPhetFluent.key.vStringProperty,
    buildNode: LetterKeyNode.v
  },
  w: {
    labelStringProperty: SceneryPhetFluent.key.wStringProperty,
    buildNode: LetterKeyNode.w
  },
  x: {
    labelStringProperty: SceneryPhetFluent.key.xStringProperty,
    buildNode: LetterKeyNode.x
  },
  y: {
    labelStringProperty: SceneryPhetFluent.key.yStringProperty,
    buildNode: LetterKeyNode.y
  },
  z: {
    labelStringProperty: SceneryPhetFluent.key.zStringProperty,
    buildNode: LetterKeyNode.z
  },
  0: {
    labelStringProperty: SceneryPhetFluent.key.zeroStringProperty,
    buildNode: () => NumberKeyNode.fromNumber( 0 )
  },
  1: {
    labelStringProperty: SceneryPhetFluent.key.oneStringProperty,
    buildNode: () => NumberKeyNode.fromNumber( 1 )
  },
  2: {
    labelStringProperty: SceneryPhetFluent.key.twoStringProperty,
    buildNode: () => NumberKeyNode.fromNumber( 2 )
  },
  3: {
    labelStringProperty: SceneryPhetFluent.key.threeStringProperty,
    buildNode: () => NumberKeyNode.fromNumber( 3 )
  },
  4: {
    labelStringProperty: SceneryPhetFluent.key.fourStringProperty,
    buildNode: () => NumberKeyNode.fromNumber( 4 )
  },
  5: {
    labelStringProperty: SceneryPhetFluent.key.fiveStringProperty,
    buildNode: () => NumberKeyNode.fromNumber( 5 )
  },
  6: {
    labelStringProperty: SceneryPhetFluent.key.sixStringProperty,
    buildNode: () => NumberKeyNode.fromNumber( 6 )
  },
  7: {
    labelStringProperty: SceneryPhetFluent.key.sevenStringProperty,
    buildNode: () => NumberKeyNode.fromNumber( 7 )
  },
  8: {
    labelStringProperty: SceneryPhetFluent.key.eightStringProperty,
    buildNode: () => NumberKeyNode.fromNumber( 8 )
  },
  9: {
    labelStringProperty: SceneryPhetFluent.key.nineStringProperty,
    buildNode: () => NumberKeyNode.fromNumber( 9 )
  }
};

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
