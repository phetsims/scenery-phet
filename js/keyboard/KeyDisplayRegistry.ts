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
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';
import ArrowKeyNode from './ArrowKeyNode.js';
import LetterKeyNode from './LetterKeyNode.js';
import NumberKeyNode from './NumberKeyNode.js';
import TextKeyNode from './TextKeyNode.js';

type KeyDisplayDefinition = {
  labelStringProperty?: TReadOnlyProperty<string>;
  builder?: () => Node;
};

export default class KeyDisplayRegistry {
  private constructor() {
    // Constructor is private because this is a singleton. No need to instantiate this class.
  }

  /**
   * Retrieve the localized label Property for a given key. Asserts if the key is not configured in the registry.
   */
  public static getKeyLabelProperty( key: EnglishKeyString ): TReadOnlyProperty<string> {
    const labelProperty = KeyDisplayRegistry.registry.get( key )?.labelStringProperty;
    affirm( labelProperty, `No label configured for key "${key}". Please add it to the registry.` );
    return labelProperty;
  }

  /**
   * Retrieve the Node builder function for a given key. Asserts if the key is not configured in the registry.
   */
  public static getKeyBuilder( key: EnglishKeyString ): ( () => Node ) {
    const builder = KeyDisplayRegistry.registry.get( key )?.builder;
    affirm( builder, `No key builder configured for key "${key}". Please add it to the registry.` );
    return builder;
  }

  /**
   * The main registry of key display definitions.
   *
   * Note that we cannot build this programmatically because PhET's build system requires static references to
   * all strings for extraction.
   */
  private static readonly registry = new Map<EnglishKeyString, KeyDisplayDefinition>( [
    [ 'shift', {
      labelStringProperty: SceneryPhetFluent.key.shiftStringProperty,
      builder: () => TextKeyNode.shift()
    } ],
    [ 'alt', {
      labelStringProperty: TextKeyNode.getAltKeyString(),
      builder: () => TextKeyNode.altOrOption()
    } ],
    [ 'escape', {
      labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.escapeStringProperty,
      builder: () => TextKeyNode.esc()
    } ],
    [ 'arrowLeft', {
      labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.leftArrowStringProperty,
      builder: () => new ArrowKeyNode( 'left' )
    } ],
    [ 'arrowRight', {
      labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.rightArrowStringProperty,
      builder: () => new ArrowKeyNode( 'right' )
    } ],
    [ 'arrowUp', {
      labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.upArrowStringProperty,
      builder: () => new ArrowKeyNode( 'up' )
    } ],
    [ 'arrowDown', {
      labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.downArrowStringProperty,
      builder: () => new ArrowKeyNode( 'down' )
    } ],
    [ 'pageUp', {
      labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.pageUpStringProperty,
      builder: () => TextKeyNode.pageUp()
    } ],
    [ 'pageDown', {
      labelStringProperty: SceneryPhetFluent.a11y.keyboard.key.pageDownStringProperty,
      builder: () => TextKeyNode.pageDown()
    } ],
    [ 'home', {
      labelStringProperty: SceneryPhetFluent.key.homeStringProperty,
      builder: () => TextKeyNode.home()
    } ],
    [ 'end', {
      labelStringProperty: SceneryPhetFluent.key.endStringProperty,
      builder: () => TextKeyNode.end()
    } ],
    [ 'space', {
      labelStringProperty: SceneryPhetFluent.key.spaceStringProperty,
      builder: () => TextKeyNode.space()
    } ],
    [ 'tab', {
      labelStringProperty: SceneryPhetFluent.key.tabStringProperty,
      builder: () => TextKeyNode.tab()
    } ],
    [ 'enter', {
      labelStringProperty: TextKeyNode.getEnterKeyString(),
      builder: () => TextKeyNode.enter()
    } ],
    [ 'backspace', {
      labelStringProperty: SceneryPhetFluent.key.backspaceStringProperty,
      builder: () => TextKeyNode.backspace()
    } ],
    [ 'delete', {
      labelStringProperty: SceneryPhetFluent.key.deleteStringProperty,
      builder: () => TextKeyNode.delete()
    } ],
    [ 'a', {
      labelStringProperty: SceneryPhetFluent.key.aStringProperty,
      builder: LetterKeyNode.a
    } ],
    [ 'b', {
      labelStringProperty: SceneryPhetFluent.key.bStringProperty,
      builder: LetterKeyNode.b
    } ],
    [ 'c', {
      labelStringProperty: SceneryPhetFluent.key.cStringProperty,
      builder: LetterKeyNode.c
    } ],
    [ 'd', {
      labelStringProperty: SceneryPhetFluent.key.dStringProperty,
      builder: LetterKeyNode.d
    } ],
    [ 'e', {
      labelStringProperty: SceneryPhetFluent.key.eStringProperty,
      builder: LetterKeyNode.e
    } ],
    [ 'f', {
      labelStringProperty: SceneryPhetFluent.key.fStringProperty,
      builder: LetterKeyNode.f
    } ],
    [ 'g', {
      labelStringProperty: SceneryPhetFluent.key.gStringProperty,
      builder: LetterKeyNode.g
    } ],
    [ 'h', {
      labelStringProperty: SceneryPhetFluent.key.hStringProperty,
      builder: LetterKeyNode.h
    } ],
    [ 'i', {
      labelStringProperty: SceneryPhetFluent.key.iStringProperty,
      builder: LetterKeyNode.i
    } ],
    [ 'j', {
      labelStringProperty: SceneryPhetFluent.key.jStringProperty,
      builder: LetterKeyNode.j
    } ],
    [ 'k', {
      labelStringProperty: SceneryPhetFluent.key.kStringProperty,
      builder: LetterKeyNode.k
    } ],
    [ 'l', {
      labelStringProperty: SceneryPhetFluent.key.lStringProperty,
      builder: LetterKeyNode.l
    } ],
    [ 'm', {
      labelStringProperty: SceneryPhetFluent.key.mStringProperty,
      builder: LetterKeyNode.m
    } ],
    [ 'n', {
      labelStringProperty: SceneryPhetFluent.key.nStringProperty,
      builder: LetterKeyNode.n
    } ],
    [ 'o', {
      labelStringProperty: SceneryPhetFluent.key.oStringProperty,
      builder: LetterKeyNode.o
    } ],
    [ 'p', {
      labelStringProperty: SceneryPhetFluent.key.pStringProperty,
      builder: LetterKeyNode.p
    } ],
    [ 'q', {
      labelStringProperty: SceneryPhetFluent.key.qStringProperty,
      builder: LetterKeyNode.q
    } ],
    [ 'r', {
      labelStringProperty: SceneryPhetFluent.key.rStringProperty,
      builder: LetterKeyNode.r
    } ],
    [ 's', {
      labelStringProperty: SceneryPhetFluent.key.sStringProperty,
      builder: LetterKeyNode.s
    } ],
    [ 't', {
      labelStringProperty: SceneryPhetFluent.key.tStringProperty,
      builder: LetterKeyNode.t
    } ],
    [ 'u', {
      labelStringProperty: SceneryPhetFluent.key.uStringProperty,
      builder: LetterKeyNode.u
    } ],
    [ 'v', {
      labelStringProperty: SceneryPhetFluent.key.vStringProperty,
      builder: LetterKeyNode.v
    } ],
    [ 'w', {
      labelStringProperty: SceneryPhetFluent.key.wStringProperty,
      builder: LetterKeyNode.w
    } ],
    [ 'x', {
      labelStringProperty: SceneryPhetFluent.key.xStringProperty,
      builder: LetterKeyNode.x
    } ],
    [ 'y', {
      labelStringProperty: SceneryPhetFluent.key.yStringProperty,
      builder: LetterKeyNode.y
    } ],
    [ 'z', {
      labelStringProperty: SceneryPhetFluent.key.zStringProperty,
      builder: LetterKeyNode.z
    } ],
    [ '0', {
      labelStringProperty: SceneryPhetFluent.key.zeroStringProperty,
      builder: () => NumberKeyNode.fromNumber( 0 )
    } ],
    [ '1', {
      labelStringProperty: SceneryPhetFluent.key.oneStringProperty,
      builder: () => NumberKeyNode.fromNumber( 1 )
    } ],
    [ '2', {
      labelStringProperty: SceneryPhetFluent.key.twoStringProperty,
      builder: () => NumberKeyNode.fromNumber( 2 )
    } ],
    [ '3', {
      labelStringProperty: SceneryPhetFluent.key.threeStringProperty,
      builder: () => NumberKeyNode.fromNumber( 3 )
    } ],
    [ '4', {
      labelStringProperty: SceneryPhetFluent.key.fourStringProperty,
      builder: () => NumberKeyNode.fromNumber( 4 )
    } ],
    [ '5', {
      labelStringProperty: SceneryPhetFluent.key.fiveStringProperty,
      builder: () => NumberKeyNode.fromNumber( 5 )
    } ],
    [ '6', {
      labelStringProperty: SceneryPhetFluent.key.sixStringProperty,
      builder: () => NumberKeyNode.fromNumber( 6 )
    } ],
    [ '7', {
      labelStringProperty: SceneryPhetFluent.key.sevenStringProperty,
      builder: () => NumberKeyNode.fromNumber( 7 )
    } ],
    [ '8', {
      labelStringProperty: SceneryPhetFluent.key.eightStringProperty,
      builder: () => NumberKeyNode.fromNumber( 8 )
    } ],
    [ '9', {
      labelStringProperty: SceneryPhetFluent.key.nineStringProperty,
      builder: () => NumberKeyNode.fromNumber( 9 )
    } ]
  ] );
}

sceneryPhet.register( 'KeyDisplayRegistry', KeyDisplayRegistry );