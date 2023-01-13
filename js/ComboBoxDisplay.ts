// Copyright 2019-2023, University of Colorado Boulder

/**
 * ComboBoxDisplay is the lovechild of a ComboBox and a NumberDisplay. It allows the user to choose one of N dynamic
 * numeric values. ComboBox was designed to display static choices, so this component ensures that none of its items
 * grow wider/taller than their initial size.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../dot/js/Range.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import { Node } from '../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../sun/js/ComboBox.js';
import NumberDisplay, { NumberDisplayOptions } from './NumberDisplay.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';
import Property from '../../axon/js/Property.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import StringProperty from '../../axon/js/StringProperty.js';
import PatternStringProperty from '../../axon/js/PatternStringProperty.js';

// constants
const DEFAULT_FONT = new PhetFont( 14 );

type SubsetOfNumberDisplayOptions = StrictOmit<NumberDisplayOptions, 'valuePattern'>;

// Describes an item in the ComboBoxDisplay
export type ComboBoxDisplayItem<T> = {

  // a value of choiceProperty that corresponds to the item
  choice: T;

  // the item's numeric value
  numberProperty: TReadOnlyProperty<number | null>;

  // the range of the item's numeric value
  range: Range;

  // the units used to label the item's numeric value
  units: string | TReadOnlyProperty<string>;

  // options passed to this item's NumberDisplay, these override ComboBoxDisplayOptions.numberDisplayOptions
  numberDisplayOptions?: SubsetOfNumberDisplayOptions;

  // tandem name for the item
  tandemName?: string;
};

type SelfOptions = {

  // propagated to all NumberDisplay subcomponents, will be overridden by ComboBoxDisplayItem.numberDisplayOptions
  numberDisplayOptions?: SubsetOfNumberDisplayOptions;
};

export type ComboBoxDisplayOptions = SelfOptions & ComboBoxOptions;

export default class ComboBoxDisplay<T> extends ComboBox<T> {

  private readonly disposeComboBoxDisplay: () => void;

  /**
   * @param choiceProperty - determines which item is currently selected
   * @param items - describes the items that appear in the ComboBox
   * @param listParent - parent for the ComboBox list
   * @param providedOptions?
   */
  public constructor( choiceProperty: Property<T>, items: ComboBoxDisplayItem<T>[], listParent: Node,
                      providedOptions?: ComboBoxDisplayOptions ) {

    const options = optionize<ComboBoxDisplayOptions, SelfOptions, ComboBoxOptions>()( {

      // SelfOptions
      numberDisplayOptions: {
        backgroundFill: null,
        backgroundStroke: null,
        textOptions: {
          font: DEFAULT_FONT
        },
        align: 'right',
        xMargin: 0,
        yMargin: 0
      },

      // ComboBoxOptions
      align: 'right' // we typically want numbers to be right aligned

    }, providedOptions );

    // Convert ComboBoxDisplayItems to ComboBoxItems
    const comboBoxItems: ComboBoxItem<T>[] = [];
    const valuePatternStringProperties: TReadOnlyProperty<string>[] = [];
    items.forEach( item => {

      const unitsProperty = ( typeof item.units === 'string' ) ? new StringProperty( item.units ) : item.units;
      const valuePatternStringProperty = new PatternStringProperty( SceneryPhetStrings.comboBoxDisplay.valueUnitsStringProperty, {
        units: unitsProperty
      } );
      valuePatternStringProperties.push( valuePatternStringProperty );

      const itemNode = new NumberDisplay( item.numberProperty, item.range,
        combineOptions<NumberDisplayOptions>( {
          valuePattern: valuePatternStringProperty
        }, options.numberDisplayOptions, item.numberDisplayOptions )
      );

      // Don't allow the NumberDisplay to grow, since it's in a ComboBox
      itemNode.maxWidth = itemNode.width;
      itemNode.maxHeight = itemNode.height;

      comboBoxItems.push( {
        value: item.choice,
        createNode: () => itemNode,
        tandemName: item.tandemName
      } );
    } );

    super( choiceProperty, comboBoxItems, listParent, options );

    this.disposeComboBoxDisplay = () => {
      valuePatternStringProperties.forEach( property => property.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeComboBoxDisplay();
    super.dispose();
  }
}

sceneryPhet.register( 'ComboBoxDisplay', ComboBoxDisplay );