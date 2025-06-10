// Copyright 2025, University of Colorado Boulder

/**
 * AccessibleListNode creates an accessible list for Interactive Description that is kept in
 * sync with a collection of Properties.
 *
 * Typical usage
 * --------------
 *   const appleStringProperty = new StringProperty( 'there is 1 apple' );
 *   const orangeStringProperty = new StringProperty( 'there are 2 oranges' );
 *   const strawberryStringProperty = new StringProperty( 'there are 4 strawberries' );
 *   const strawberriesVisible = new BooleanProperty( true );
 *
 *   const listNode = new AccessibleListNode( [
 *     appleStringProperty,
 *     orangeStringProperty,
 *     {
 *       stringProperty: strawberryStringProperty,
 *       visibleProperty: strawberriesVisibleProperty
 *     }
 *   ], {
 *     leadingParagraphStringProperty: new StringProperty( 'In the basket:' ),
 *     punctuationStyle: 'semicolon'
 *   } );
 * --------------
 *
 * Which will produce the following content:
 * --------------
 * In the basket:
 *   - there is 1 apple;
 *   - there are 2 oranges;
 *   - there are 4 strawberries.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import Multilink from '../../../axon/js/Multilink.js';
import PatternStringProperty from '../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import Node, { NodeOptions } from '../../../scenery/js/nodes/Node.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';

type ListItem = {
  stringProperty: TReadOnlyProperty<string>;
  visibleProperty: TReadOnlyProperty<boolean>;
};

type SelfOptions = {

  // If provided, this is a descriptive paragraph that comes before the list of items.
  leadingParagraphStringProperty?: TReadOnlyProperty<string> | null;

  // The list type for the accessible content.
  listType?: 'unordered' | 'ordered';

  // Automatically manage terminating punctuation for each <li>.
  //
  // Behaviour when provided:
  //   - All but the last *visible* list item end with the chosen punctuation
  //     (`comma` => ',' and `semicolon` => ';').
  //   - The last *visible* list item ends with a period.
  //
  // This option is ONLY useful when both of the following are true:
  //   (1) You want the punctuation pattern described above, and
  //   (2) The number or order of visible list items can change at runtime.
  //
  // For static lists it is clearer to include the desired punctuation directly
  // in the translation strings instead of using this option.
  //
  // Example (`punctuationStyle:'semicolon'`):
  //     In the basket:
  //       – there is 1 apple;
  //       – there are 2 oranges;
  //       – there are 4 strawberries.
  //
  // If the strawberries' item becomes invisible, the list updates to:
  //     In the basket:
  //       – there is 1 apple;
  //       – there are 2 oranges.
  punctuationStyle?: null | 'comma' | 'semicolon';
};

type ParentOptions = NodeOptions;

type AccessibleListNodeOptions = SelfOptions & Pick<ParentOptions, 'visibleProperty'>;

export default class AccessibleListNode extends Node {

  // A Property holding an equivalent single string representation of all string contents of this
  // AccessibleListNode. Used when reading with the Voicing feature.
  public readonly voicingContentStringProperty: TReadOnlyProperty<string>;

  public constructor( listItems: ( TReadOnlyProperty<string> | ListItem )[], providedOptions?: AccessibleListNodeOptions ) {

    const options = optionize<AccessibleListNodeOptions, SelfOptions, ParentOptions>()( {
      leadingParagraphStringProperty: null,
      listType: 'unordered',
      punctuationStyle: null,

      // This Node is not interactive with input.
      pickable: false

    }, providedOptions );

    super( options );

    if ( options.leadingParagraphStringProperty ) {
      const leadingParagraphNode = new Node( {
        tagName: 'p',
        innerContent: options.leadingParagraphStringProperty
      } );
      this.addChild( leadingParagraphNode );
      this.addDisposable( leadingParagraphNode );
    }

    const listParentNode = new Node( {
      tagName: options.listType === 'ordered' ? 'ol' : 'ul'
    } );
    this.addChild( listParentNode );


    // Collect all string content and scenery Nodes to make it easier to render the requested list structure and punctuation.
    const collectedListItems = listItems.map( item => {
      const patternProperty = options.punctuationStyle === 'comma' ?
                              SceneryPhetStrings.a11y.listItemPunctuation.commaPatternStringProperty :
                              SceneryPhetStrings.a11y.listItemPunctuation.semicolonPatternStringProperty;

      // eslint-disable-next-line phet/bad-sim-text
      const contentProperty = ( 'stringProperty' in item ) ? item.stringProperty : item;
      const visibleProperty = ( 'visibleProperty' in item ) ? item.visibleProperty : new BooleanProperty( true );

      return {
        node: new Node( {
          tagName: 'li',
          innerContent: contentProperty,
          visibleProperty: visibleProperty
        } ),
        visibleProperty: visibleProperty,

        // The unmodified string.
        contentProperty: contentProperty,

        // The string wrapped in the requested punctuation style.
        punctuationStringProperty: new PatternStringProperty( patternProperty, { content: contentProperty } ),

        // The string wrapped with a period for the final item.
        periodStringProperty: new PatternStringProperty( SceneryPhetStrings.a11y.listItemPunctuation.periodPatternStringProperty, { content: contentProperty } )
      };
    } );

    // Add all list item Nodes to the scene graph.
    collectedListItems.forEach( item => {
      listParentNode.addChild( item.node );
      this.addDisposable( item.node );
    } );

    const allVisibleProperties = _.uniq( collectedListItems.map( item => item.visibleProperty ) );

    // Collects a list of just the visible items in the list.
    const collectVisibleItems = () => collectedListItems.filter( itemWithNode => {
      return itemWithNode.visibleProperty.value;
    } );

    // If there is a requested punctuation style, observe any change to visibility to update the punctuation for each list item.
    if ( options.punctuationStyle ) {
      const contentMultilink = Multilink.multilinkAny( allVisibleProperties, () => {

        // Collect a list of just the visible items so we can determine punctuation based on where the item is relative to the visible items.
        const visibleItems = collectVisibleItems();

        visibleItems.forEach( ( ( visibleItem, index ) => {
          if ( index === visibleItems.length - 1 ) {
            visibleItem.node.innerContent = visibleItem.periodStringProperty;
          }
          else {
            visibleItem.node.innerContent = visibleItem.punctuationStringProperty;
          }
        } ) );
      } );
      this.addDisposable( contentMultilink );
    }

    // Assemble the equivalent string for Voicing.
    const allPunctuationStringProperties = collectedListItems.map( item => item.punctuationStringProperty );
    this.voicingContentStringProperty = DerivedProperty.deriveAny(
      [ ...allVisibleProperties, ...allPunctuationStringProperties, options.leadingParagraphStringProperty ].filter( property => !!property ),
      () => {
        const voicingStrings = [];

        if ( options.leadingParagraphStringProperty ) {
          voicingStrings.push( options.leadingParagraphStringProperty.value );
        }

        const visibleItems = collectVisibleItems();
        visibleItems.forEach( item => {
          voicingStrings.push( item.punctuationStringProperty.value );
        } );

        // Join the content into a final sentence. Note that this may not be friendly for translation. But items are simply read in order
        // so this should be equivalent to reading each as its own utterance.
        return voicingStrings
          .filter( str => !!str )
          .join( ' ' );
      }
    );
    this.addDisposable( this.voicingContentStringProperty );
  }
}

sceneryPhet.register( 'AccessibleListNode', AccessibleListNode );