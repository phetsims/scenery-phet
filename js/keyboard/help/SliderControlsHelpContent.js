// Copyright 2017, University of Colorado Boulder

/**
 * Content for a KeyboardHelpDialog that describes how to use sliders.
 * 
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var EndKeyNode = require( 'SCENERY_PHET/keyboard/EndKeyNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HelpContent = require( 'SCENERY_PHET/keyboard/help/HelpContent' );
  var HomeKeyNode = require( 'SCENERY_PHET/keyboard/HomeKeyNode' );
  var PageDownKeyNode = require( 'SCENERY_PHET/keyboard/PageDownKeyNode' );
  var PageUpKeyNode = require( 'SCENERY_PHET/keyboard/PageUpKeyNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var sliderControlsString = require( 'string!SCENERY_PHET/sliderControls' );
  var moveSlidersString = require( 'string!SCENERY_PHET/moveSliders' );
  var moveInSmallerStepsString = require( 'string!SCENERY_PHET/moveInSmallerSteps' );
  var moveInLargerStepsString = require( 'string!SCENERY_PHET/moveInLargerSteps' );
  var moveToMaximumValueString = require( 'string!SCENERY_PHET/moveToMaximumValue' );
  var moveToMinimumValueString = require( 'string!SCENERY_PHET/moveToMinimumValue' );

  // constants
  var DEFAULT_LABEL_OPTIONS = {
    font: HelpContent.DEFAULT_LABEL_FONT,
    maxWidth: HelpContent.DEFAULT_TEXT_MAX_WIDTH
  };

  /**
   * @constructor
   * @param {Object} options
   */
  function SliderControlsHelpContent( options ) {

    options = _.extend( {
      tandem: Tandem.tandemRequired(),

      // icon options
      arrowKeysScale: 0.55,
      verticalIconSpacing: HelpContent.DEFAULT_VERTICAL_ICON_SPACING
    }, options );

    // 'Move sliders' content
    var moveSlidersText = new RichText( moveSlidersString, DEFAULT_LABEL_OPTIONS );
    var moveSlidersLeftRightIcon = HelpContent.leftRightArrowKeysRowIcon( {
      scale: options.arrowKeysScale
    } );
    var moveSlidersUpDownIcon = HelpContent.upDownArrowKeysRowIcon( {
      scale: options.arrowKeysScale
    } );
    var moveSlidersIcon = HelpContent.iconOrIcon( moveSlidersLeftRightIcon, moveSlidersUpDownIcon );
    var moveSlidersRow = HelpContent.labelWithIcon( moveSlidersText, moveSlidersIcon );

    // 'move in smaller steps' content
    var moveInSmallerStepsText = new RichText( moveInSmallerStepsString, DEFAULT_LABEL_OPTIONS );
    var smallStepsLeftRightIcon = HelpContent.leftRightArrowKeysRowIcon( {
      scale: options.arrowKeysScale
    } );
    var smallStepsUpDownIcon = HelpContent.upDownArrowKeysRowIcon( {
      scale: options.arrowKeysScale
    } );

    var shiftPlusLeftRightIcon = HelpContent.shiftPlusIcon( smallStepsLeftRightIcon );
    var shiftPlusUpDownIcon = HelpContent.shiftPlusIcon( smallStepsUpDownIcon );

    var moveSlidersInSmallerStepsRow = HelpContent.labelWithIconList( moveInSmallerStepsText, [
      shiftPlusLeftRightIcon,
      shiftPlusUpDownIcon
    ] );

    // 'move in larger steps' content
    var moveInLargerStepsText = new RichText( moveInLargerStepsString, DEFAULT_LABEL_OPTIONS );
    var pageUpKeyNode = new PageUpKeyNode();
    var pageDownKeyNode = new PageDownKeyNode();
    var pageUpPageDownIcon = new HBox( {
      children: [ pageUpKeyNode, pageDownKeyNode ],
      spacing: HelpContent.DEFAULT_ICON_SPACING
    } );
    var moveInLargerStepsRow = HelpContent.labelWithIcon( moveInLargerStepsText, pageUpPageDownIcon );

    // 'move to minimum value' content
    var moveToMinimumValueText = new RichText( moveToMinimumValueString, DEFAULT_LABEL_OPTIONS );
    var homeKeyNode = new HomeKeyNode();
    var moveToMinimumValueRow = HelpContent.labelWithIcon( moveToMinimumValueText, homeKeyNode );

    // 'move to maximum value' content
    var moveToMaximumValueText = new RichText( moveToMaximumValueString, DEFAULT_LABEL_OPTIONS );
    var endKeyNode = new EndKeyNode();
    var moveToMaximumValueRow = HelpContent.labelWithIcon( moveToMaximumValueText, endKeyNode );

    // content aligned in a VBox
    var content = new VBox( {
      children: [ moveSlidersRow, moveSlidersInSmallerStepsRow, moveInLargerStepsRow, moveToMinimumValueRow, moveToMaximumValueRow ],
      align: 'left',
      spacing: options.verticalIconSpacing
    } );
     
    HelpContent.call( this, sliderControlsString, content, options );
  }

  sceneryPhet.register( 'SliderControlsHelpContent', SliderControlsHelpContent );

  return inherit( HelpContent, SliderControlsHelpContent );
} );
