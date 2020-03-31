// Copyright 2019-2020, University of Colorado Boulder

/**
 * The lovechild of a ComboBox and a NumberDisplay. Allows the user to choose one of N dynamic numeric values.
 * ComboBox was designed to display static choices, so this component ensures that none of its items grow wider/taller
 * than their initial size.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import ComboBox from '../../sun/js/ComboBox.js';
import ComboBoxItem from '../../sun/js/ComboBoxItem.js';
import NumberDisplay from './NumberDisplay.js';
import PhetFont from './PhetFont.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const comboBoxDisplayValueUnitsString = sceneryPhetStrings.comboBoxDisplay.valueUnits;

class ComboBoxDisplay extends ComboBox {

  /**
   * @param {Object[]} items - describes items in the ComboBox, each Object has these fields:
   *   {*} choice - a value of choiceProperty that corresponds to the item
   *   {NumberProperty} numberProperty - the value of the item
   *   {Range} [range] - the range of the item's value, required if numberProperty.range is null
   *   {string} units - the units used to label the item's value
   *   {Object} [numberDisplayOptions] - options passed to this item's NumberDisplay
   * @param {Property} choiceProperty - determines which item is currently selected
   * @param {Node} listParent - parent for the ComboBox list
   * @param {Object} [options]
   */
  constructor( items, choiceProperty, listParent, options ) {

    options = merge( {

      numberDisplayOptions: null, // {*|null} propagated to all NumberDisplay subcomponents

      // ComboBox options
      align: 'right' // we typically want numbers to be right aligned

    }, options );

    // defaults for NumberDisplay
    options.numberDisplayOptions = merge( {
      backgroundFill: null,
      backgroundStroke: null,
      textOptions: {
        font: new PhetFont( 14 )
      },
      align: 'right',
      xMargin: 0,
      yMargin: 0
    }, options.numberDisplayOptions );

    assert && assert( !options.numberDisplayOptions.valuePattern,
      'ComboBoxDisplay sets numberDisplayOptions.valuePattern' );

    // Convert ComboBoxDisplay items to ComboBox items
    const comboBoxItems = [];
    items.forEach( item => {

      assert && assert( item.choice !== undefined, 'missing item.choice' );
      assert && assert( item.numberProperty, 'missing item.numberProperty' );
      assert && assert( item.range || item.numberProperty.range, 'range or numberProperty.range must be provided' );
      assert && assert( item.units !== undefined, 'missing item.units' );
      assert && assert( !item.numberDisplayOptions || !item.numberDisplayOptions.valuePattern,
        'ComboBoxDisplay sets item.numberDisplayOptions.valuePattern' );

      const itemNode = new NumberDisplay( item.numberProperty, item.range || item.numberProperty.range,
        merge( {}, options.numberDisplayOptions, item.numberDisplayOptions, {
          valuePattern: StringUtils.fillIn( comboBoxDisplayValueUnitsString, { units: item.units } )
        } ) );

      // Don't allow the NumberDisplay to grow, since it's in a ComboBox
      itemNode.maxWidth = itemNode.width;
      itemNode.maxHeight = itemNode.height;

      comboBoxItems.push( new ComboBoxItem( itemNode, item.choice ) );
    } );

    super( comboBoxItems, choiceProperty, listParent, options );
  }
}

sceneryPhet.register( 'ComboBoxDisplay', ComboBoxDisplay );
export default ComboBoxDisplay;