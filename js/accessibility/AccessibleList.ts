// Copyright 2026, University of Colorado Boulder

/**
 * AccessibleList creates lit-html templates for Interactive Description. Creates a list of items that
 * organize information for the screen reader user.
 *
 * Typical usage
 * --------------
 *   const appleStringProperty = new StringProperty( 'there is 1 apple' );
 *   const orangeStringProperty = new StringProperty( 'there are 2 oranges' );
 *   const strawberryStringProperty = new StringProperty( 'there are 4 strawberries' );
 *   const strawberriesVisible = new BooleanProperty( true );
 *
 *   const listTemplateProperty = AccessibleList.createTemplate( {
 *     leadingParagraphStringProperty: new StringProperty( 'In the basket:' ),
 *     listItems: [
 *       appleStringProperty,
 *       orangeStringProperty,
 *       {
 *         stringProperty: strawberryStringProperty,
 *         visibleProperty: strawberriesVisibleProperty
 *       }
 *     ],
 *     punctuationStyle: 'semicolon'
 *   } );
 *
 *   const fruitBasketNode = new Image( src, {
 *     accessibleTemplate: listTemplateProperty
 *   } );
 * --------------
 *
 * Which will produce the following content:
 * --------------
 * In the basket:
 *   - there is 1 apple;
 *   - there are 2 oranges;
 *   - there are 4 strawberries.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../phet-core/js/optionize.js';
import type { AccessibleTemplateValue } from '../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import { html } from '../../../sherpa/lib/lit-core-3.3.1.min.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetFluent from '../SceneryPhetFluent.js';

export type AccessibleListItem = {
  stringProperty: TReadOnlyProperty<string>;

  // always visible if undefined
  visibleProperty?: TReadOnlyProperty<boolean>;
};

export type AccessibleListOptions = {
  listItems: ( TReadOnlyProperty<string> | AccessibleListItem )[];

  // Controls visibility of the entire list template. If false, returns null so no template is rendered.
  visibleProperty?: TReadOnlyProperty<boolean> | null;

  // If provided, this is a descriptive paragraph that comes before the list of items.
  leadingParagraphStringProperty?: TReadOnlyProperty<string> | null;

  // Controls the visibility of the leading paragraph.
  leadingParagraphVisibleProperty?: TReadOnlyProperty<boolean> | null;

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

export default class AccessibleList {
  public static createTemplate( providedOptions: AccessibleListOptions ): TReadOnlyProperty<AccessibleTemplateValue> {
    const options = optionize<AccessibleListOptions>()( {
      visibleProperty: null,
      leadingParagraphStringProperty: null,
      leadingParagraphVisibleProperty: null,
      listType: 'unordered',
      punctuationStyle: null
    }, providedOptions );

    // Collect all string content and Properties to make it easier to render the requested list structure and
    // punctuation.
    const collectedListItems = options.listItems.map( item => {
      const patternProperty = options.punctuationStyle === 'comma' ?
                              SceneryPhetFluent.a11y.listItemPunctuation.commaPatternStringProperty :
                              SceneryPhetFluent.a11y.listItemPunctuation.semicolonPatternStringProperty;

      // eslint-disable-next-line phet/bad-sim-text
      const contentProperty = ( 'stringProperty' in item ) ? item.stringProperty : item;
      const hasVisibleProperty = 'visibleProperty' in item && !!item.visibleProperty;
      const visibleProperty = hasVisibleProperty ? item.visibleProperty! : new BooleanProperty( true );

      return {
        visibleProperty: visibleProperty,

        // If the AccessibleList owns the Property, it must be disposed.
        ownsVisibleProperty: !hasVisibleProperty,

        // The unmodified string.
        contentProperty: contentProperty,

        // The string wrapped in the requested punctuation style.
        punctuationStringProperty: new PatternStringProperty( patternProperty, { content: contentProperty } ),

        // The string wrapped with a period for the final item.
        periodStringProperty: new PatternStringProperty( SceneryPhetFluent.a11y.listItemPunctuation.periodPatternStringProperty, { content: contentProperty } )
      };
    } );

    // Collect list of Properties to make it easy to hand off to the DerivedProperty, and manage disposal.
    const dependencySet = new Set<TReadOnlyProperty<unknown>>();
    const addDependency = ( property: TReadOnlyProperty<unknown> | null | undefined ): void => {
      if ( property ) {
        dependencySet.add( property );
      }
    };

    collectedListItems.forEach( item => {
      addDependency( item.visibleProperty );
      addDependency( item.contentProperty );
      if ( options.punctuationStyle ) {
        addDependency( item.punctuationStringProperty );
        addDependency( item.periodStringProperty );
      }
    } );
    addDependency( options.leadingParagraphStringProperty );
    addDependency( options.leadingParagraphVisibleProperty );
    addDependency( options.visibleProperty );

    const templateProperty = DerivedProperty.deriveAny( Array.from( dependencySet ), () => {
      if ( options.visibleProperty && !options.visibleProperty.value ) {
        return null;
      }

      // Collects a list of just the visible items in the list.
      const visibleItems = collectedListItems.filter( item => item.visibleProperty.value );
      const showLeadingParagraph = !!options.leadingParagraphStringProperty &&
                                   ( !options.leadingParagraphVisibleProperty || options.leadingParagraphVisibleProperty.value );

      // Render each visible list item with punctuation if requested.
      const listItemsTemplate = visibleItems.map( ( item, index ) => {
        const itemString = options.punctuationStyle ?
                           ( index === visibleItems.length - 1 ? item.periodStringProperty.value : item.punctuationStringProperty.value ) :
                           item.contentProperty.value;
        return html`
          <li>${itemString}</li>`;
      } );

      const listTemplate = options.listType === 'ordered' ?
                           html`
                             <ol>${listItemsTemplate}</ol>` :
                           html`
                             <ul>${listItemsTemplate}</ul>`;

      return html`
        ${showLeadingParagraph ? html`<p>${options.leadingParagraphStringProperty!.value}</p>` : null}
        ${listTemplate}
      `;
    } );

    // Dispose internally created Properties when the template property is disposed.
    collectedListItems.forEach( item => {
      templateProperty.addDisposable( item.punctuationStringProperty );
      templateProperty.addDisposable( item.periodStringProperty );
      if ( item.ownsVisibleProperty ) {
        templateProperty.addDisposable( item.visibleProperty );
      }
    } );

    return templateProperty;
  }
}

sceneryPhet.register( 'AccessibleList', AccessibleList );
