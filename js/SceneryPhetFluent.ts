// Copyright 2025-2026, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from scenery-phet-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentComment from '../../chipper/js/browser/FluentComment.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import type {FluentVariable} from '../../chipper/js/browser/FluentPattern.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( SceneryPhetStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'scenery_phet_title', 'scenery-phet.titleStringProperty' );
addToMapIfDefined( 'screen_buttons', 'screen.buttonsStringProperty' );
addToMapIfDefined( 'screen_components', 'screen.componentsStringProperty' );
addToMapIfDefined( 'screen_dialogs', 'screen.dialogsStringProperty' );
addToMapIfDefined( 'screen_keyboard', 'screen.keyboardStringProperty' );
addToMapIfDefined( 'screen_sliders', 'screen.slidersStringProperty' );
addToMapIfDefined( 'screen_spinners', 'screen.spinnersStringProperty' );
addToMapIfDefined( 'units_nm', 'units_nmStringProperty' );
addToMapIfDefined( 'shortCircuit', 'shortCircuitStringProperty' );
addToMapIfDefined( 'heat', 'heatStringProperty' );
addToMapIfDefined( 'cool', 'coolStringProperty' );
addToMapIfDefined( 'key_tab', 'key.tabStringProperty' );
addToMapIfDefined( 'key_shift', 'key.shiftStringProperty' );
addToMapIfDefined( 'key_alt', 'key.altStringProperty' );
addToMapIfDefined( 'key_option', 'key.optionStringProperty' );
addToMapIfDefined( 'key_capsLock', 'key.capsLockStringProperty' );
addToMapIfDefined( 'key_enter', 'key.enterStringProperty' );
addToMapIfDefined( 'key_return', 'key.returnStringProperty' );
addToMapIfDefined( 'key_backspace', 'key.backspaceStringProperty' );
addToMapIfDefined( 'key_delete', 'key.deleteStringProperty' );
addToMapIfDefined( 'key_space', 'key.spaceStringProperty' );
addToMapIfDefined( 'key_esc', 'key.escStringProperty' );
addToMapIfDefined( 'key_fn', 'key.fnStringProperty' );
addToMapIfDefined( 'key_pageUp', 'key.pageUpStringProperty' );
addToMapIfDefined( 'key_pageDown', 'key.pageDownStringProperty' );
addToMapIfDefined( 'key_home', 'key.homeStringProperty' );
addToMapIfDefined( 'key_end', 'key.endStringProperty' );
addToMapIfDefined( 'key_a', 'key.aStringProperty' );
addToMapIfDefined( 'key_b', 'key.bStringProperty' );
addToMapIfDefined( 'key_c', 'key.cStringProperty' );
addToMapIfDefined( 'key_d', 'key.dStringProperty' );
addToMapIfDefined( 'key_e', 'key.eStringProperty' );
addToMapIfDefined( 'key_f', 'key.fStringProperty' );
addToMapIfDefined( 'key_g', 'key.gStringProperty' );
addToMapIfDefined( 'key_h', 'key.hStringProperty' );
addToMapIfDefined( 'key_i', 'key.iStringProperty' );
addToMapIfDefined( 'key_j', 'key.jStringProperty' );
addToMapIfDefined( 'key_k', 'key.kStringProperty' );
addToMapIfDefined( 'key_l', 'key.lStringProperty' );
addToMapIfDefined( 'key_m', 'key.mStringProperty' );
addToMapIfDefined( 'key_n', 'key.nStringProperty' );
addToMapIfDefined( 'key_o', 'key.oStringProperty' );
addToMapIfDefined( 'key_p', 'key.pStringProperty' );
addToMapIfDefined( 'key_q', 'key.qStringProperty' );
addToMapIfDefined( 'key_r', 'key.rStringProperty' );
addToMapIfDefined( 'key_s', 'key.sStringProperty' );
addToMapIfDefined( 'key_t', 'key.tStringProperty' );
addToMapIfDefined( 'key_u', 'key.uStringProperty' );
addToMapIfDefined( 'key_v', 'key.vStringProperty' );
addToMapIfDefined( 'key_w', 'key.wStringProperty' );
addToMapIfDefined( 'key_x', 'key.xStringProperty' );
addToMapIfDefined( 'key_y', 'key.yStringProperty' );
addToMapIfDefined( 'key_z', 'key.zStringProperty' );
addToMapIfDefined( 'key_zero', 'key.zeroStringProperty' );
addToMapIfDefined( 'key_one', 'key.oneStringProperty' );
addToMapIfDefined( 'key_two', 'key.twoStringProperty' );
addToMapIfDefined( 'key_three', 'key.threeStringProperty' );
addToMapIfDefined( 'key_four', 'key.fourStringProperty' );
addToMapIfDefined( 'key_five', 'key.fiveStringProperty' );
addToMapIfDefined( 'key_six', 'key.sixStringProperty' );
addToMapIfDefined( 'key_seven', 'key.sevenStringProperty' );
addToMapIfDefined( 'key_eight', 'key.eightStringProperty' );
addToMapIfDefined( 'key_nine', 'key.nineStringProperty' );
addToMapIfDefined( 'key_toGrabOrRelease', 'key.toGrabOrReleaseStringProperty' );
addToMapIfDefined( 'webglWarning_title', 'webglWarning.titleStringProperty' );
addToMapIfDefined( 'webglWarning_body', 'webglWarning.bodyStringProperty' );
addToMapIfDefined( 'webglWarning_contextLossFailure', 'webglWarning.contextLossFailureStringProperty' );
addToMapIfDefined( 'webglWarning_contextLossReload', 'webglWarning.contextLossReloadStringProperty' );
addToMapIfDefined( 'webglWarning_ie11StencilBody', 'webglWarning.ie11StencilBodyStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_sliderControls', 'keyboardHelpDialog.sliderControlsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_adjustSlider', 'keyboardHelpDialog.adjustSliderStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_spinnerControls', 'keyboardHelpDialog.spinnerControlsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_adjustInSmallerSteps', 'keyboardHelpDialog.adjustInSmallerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_adjustInLargerSteps', 'keyboardHelpDialog.adjustInLargerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_jumpToMinimum', 'keyboardHelpDialog.jumpToMinimumStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_jumpToMaximum', 'keyboardHelpDialog.jumpToMaximumStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_adjust', 'keyboardHelpDialog.adjustStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_slider', 'keyboardHelpDialog.sliderStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_spinner', 'keyboardHelpDialog.spinnerStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_heatCoolControls', 'keyboardHelpDialog.heatCoolControlsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_maximumHeat', 'keyboardHelpDialog.maximumHeatStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_maximumCool', 'keyboardHelpDialog.maximumCoolStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_heatCoolOff', 'keyboardHelpDialog.heatCoolOffStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_minimum', 'keyboardHelpDialog.minimumStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_maximum', 'keyboardHelpDialog.maximumStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_generalNavigation', 'keyboardHelpDialog.generalNavigationStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_basicActions', 'keyboardHelpDialog.basicActionsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveToNextItem', 'keyboardHelpDialog.moveToNextItemStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveToPreviousItem', 'keyboardHelpDialog.moveToPreviousItemStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveToNextItemOrGroup', 'keyboardHelpDialog.moveToNextItemOrGroupStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveToPreviousItemOrGroup', 'keyboardHelpDialog.moveToPreviousItemOrGroupStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_pressButtons', 'keyboardHelpDialog.pressButtonsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveBetweenItemsInAGroup', 'keyboardHelpDialog.moveBetweenItemsInAGroupStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_setValuesInKeypad', 'keyboardHelpDialog.setValuesInKeypadStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_resetAll', 'keyboardHelpDialog.resetAllStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_exitADialog', 'keyboardHelpDialog.exitADialogStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_toggleCheckboxes', 'keyboardHelpDialog.toggleCheckboxesStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_or', 'keyboardHelpDialog.orStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_hyphen', 'keyboardHelpDialog.hyphenStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_comboBox_headingString', 'keyboardHelpDialog.comboBox.headingStringStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_comboBox_closeWithoutChanging', 'keyboardHelpDialog.comboBox.closeWithoutChangingStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_comboBox_options', 'keyboardHelpDialog.comboBox.optionsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_comboBox_option', 'keyboardHelpDialog.comboBox.optionStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveDraggableItems', 'keyboardHelpDialog.moveDraggableItemsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_move', 'keyboardHelpDialog.moveStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_moveSlower', 'keyboardHelpDialog.moveSlowerStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_faucetControls', 'keyboardHelpDialog.faucetControls.faucetControlsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_adjustFaucetFlow', 'keyboardHelpDialog.faucetControls.adjustFaucetFlowStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_adjustInSmallerSteps', 'keyboardHelpDialog.faucetControls.adjustInSmallerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_adjustInLargerSteps', 'keyboardHelpDialog.faucetControls.adjustInLargerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_closeFaucet', 'keyboardHelpDialog.faucetControls.closeFaucetStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_openFaucetFully', 'keyboardHelpDialog.faucetControls.openFaucetFullyStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_openFaucetBriefly', 'keyboardHelpDialog.faucetControls.openFaucetBrieflyStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_timingControls_timingControls', 'keyboardHelpDialog.timingControls.timingControlsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_timingControls_pauseOrPlayAction', 'keyboardHelpDialog.timingControls.pauseOrPlayActionStringProperty' );
addToMapIfDefined( 'speed_normal', 'speed.normalStringProperty' );
addToMapIfDefined( 'speed_slow', 'speed.slowStringProperty' );
addToMapIfDefined( 'speed_fast', 'speed.fastStringProperty' );
addToMapIfDefined( 'symbol_ohms', 'symbol.ohmsStringProperty' );
addToMapIfDefined( 'symbol_resistivity', 'symbol.resistivityStringProperty' );
addToMapIfDefined( 'wavelength', 'wavelengthStringProperty' );
addToMapIfDefined( 'rulerCapitalized', 'rulerCapitalizedStringProperty' );
addToMapIfDefined( 'ruler', 'rulerStringProperty' );
addToMapIfDefined( 'zero', 'zeroStringProperty' );
addToMapIfDefined( 'one', 'oneStringProperty' );
addToMapIfDefined( 'two', 'twoStringProperty' );
addToMapIfDefined( 'three', 'threeStringProperty' );
addToMapIfDefined( 'four', 'fourStringProperty' );
addToMapIfDefined( 'five', 'fiveStringProperty' );
addToMapIfDefined( 'six', 'sixStringProperty' );
addToMapIfDefined( 'seven', 'sevenStringProperty' );
addToMapIfDefined( 'eight', 'eightStringProperty' );
addToMapIfDefined( 'nine', 'nineStringProperty' );
addToMapIfDefined( 'ten', 'tenStringProperty' );
addToMapIfDefined( 'offScaleIndicator_pointsOffScale', 'offScaleIndicator.pointsOffScaleStringProperty' );
addToMapIfDefined( 'ResetAllButton_name', 'ResetAllButton.nameStringProperty' );
addToMapIfDefined( 'ResetAllButton_name__comment', 'ResetAllButton.name__commentStringProperty' );
addToMapIfDefined( 'ResetAllButton_name__deprecated', 'ResetAllButton.name__deprecatedStringProperty' );
addToMapIfDefined( 'SoundToggleButton_name', 'SoundToggleButton.nameStringProperty' );
addToMapIfDefined( 'SoundToggleButton_name__comment', 'SoundToggleButton.name__commentStringProperty' );
addToMapIfDefined( 'SoundToggleButton_name__deprecated', 'SoundToggleButton.name__deprecatedStringProperty' );
addToMapIfDefined( 'units_centimeters_symbol', 'units.centimeters.symbolStringProperty' );
addToMapIfDefined( 'units_centimetersSquared_symbol', 'units.centimetersSquared.symbolStringProperty' );
addToMapIfDefined( 'units_hertz_symbol', 'units.hertz.symbolStringProperty' );
addToMapIfDefined( 'units_percent_symbol', 'units.percent.symbolStringProperty' );
addToMapIfDefined( 'units_seconds_symbol', 'units.seconds.symbolStringProperty' );
addToMapIfDefined( 'units_amperes_symbol', 'units.amperes.symbolStringProperty' );
addToMapIfDefined( 'units_volts_symbol', 'units.volts.symbolStringProperty' );
addToMapIfDefined( 'units_newtons_symbol', 'units.newtons.symbolStringProperty' );
addToMapIfDefined( 'units_watts_symbol', 'units.watts.symbolStringProperty' );
addToMapIfDefined( 'units_joules_symbol', 'units.joules.symbolStringProperty' );
addToMapIfDefined( 'units_kelvin_symbol', 'units.kelvin.symbolStringProperty' );
addToMapIfDefined( 'units_degrees_symbol', 'units.degrees.symbolStringProperty' );
addToMapIfDefined( 'units_degreesCelsius_symbol', 'units.degreesCelsius.symbolStringProperty' );
addToMapIfDefined( 'units_degreesFahrenheit_symbol', 'units.degreesFahrenheit.symbolStringProperty' );
addToMapIfDefined( 'units_liters_symbol', 'units.liters.symbolStringProperty' );
addToMapIfDefined( 'units_litersPerSecond_symbol', 'units.litersPerSecond.symbolStringProperty' );
addToMapIfDefined( 'units_meters_symbol', 'units.meters.symbolStringProperty' );
addToMapIfDefined( 'units_metersPerSecond_symbol', 'units.metersPerSecond.symbolStringProperty' );
addToMapIfDefined( 'units_metersPerSecondSquared_symbol', 'units.metersPerSecondSquared.symbolStringProperty' );
addToMapIfDefined( 'units_metersPerSecondPerSecond_symbol', 'units.metersPerSecondPerSecond.symbolStringProperty' );
addToMapIfDefined( 'units_grams_symbol', 'units.grams.symbolStringProperty' );
addToMapIfDefined( 'units_kilograms_symbol', 'units.kilograms.symbolStringProperty' );
addToMapIfDefined( 'units_kilogramsPerLiter_symbol', 'units.kilogramsPerLiter.symbolStringProperty' );
addToMapIfDefined( 'units_kilogramsPerCubicMeter_symbol', 'units.kilogramsPerCubicMeter.symbolStringProperty' );
addToMapIfDefined( 'units_kilopascals_symbol', 'units.kilopascals.symbolStringProperty' );
addToMapIfDefined( 'units_nanometers_symbol', 'units.nanometers.symbolStringProperty' );
addToMapIfDefined( 'units_nanometersPerPicosecond_symbol', 'units.nanometersPerPicosecond.symbolStringProperty' );
addToMapIfDefined( 'units_kilometersPerSecond_symbol', 'units.kilometersPerSecond.symbolStringProperty' );
addToMapIfDefined( 'units_picometers_symbol', 'units.picometers.symbolStringProperty' );
addToMapIfDefined( 'units_picometersPerSecond_symbol', 'units.picometersPerSecond.symbolStringProperty' );
addToMapIfDefined( 'units_picometersPerSecondSquared_symbol', 'units.picometersPerSecondSquared.symbolStringProperty' );
addToMapIfDefined( 'units_nanoseconds_symbol', 'units.nanoseconds.symbolStringProperty' );
addToMapIfDefined( 'units_picoseconds_symbol', 'units.picoseconds.symbolStringProperty' );
addToMapIfDefined( 'units_molarAbsorptivity_symbol', 'units.molarAbsorptivity.symbolStringProperty' );
addToMapIfDefined( 'units_ohms_symbol', 'units.ohms.symbolStringProperty' );
addToMapIfDefined( 'units_ohmCentimeters_symbol', 'units.ohmCentimeters.symbolStringProperty' );
addToMapIfDefined( 'units_millivolts_symbol', 'units.millivolts.symbolStringProperty' );
addToMapIfDefined( 'units_milliamperes_symbol', 'units.milliamperes.symbolStringProperty' );
addToMapIfDefined( 'units_farads_symbol', 'units.farads.symbolStringProperty' );
addToMapIfDefined( 'units_webers_symbol', 'units.webers.symbolStringProperty' );
addToMapIfDefined( 'units_gauss_symbol', 'units.gauss.symbolStringProperty' );
addToMapIfDefined( 'units_pascalSeconds_symbol', 'units.pascalSeconds.symbolStringProperty' );
addToMapIfDefined( 'units_newtonsPerMeter_symbol', 'units.newtonsPerMeter.symbolStringProperty' );
addToMapIfDefined( 'units_newtonSecondsPerMeter_symbol', 'units.newtonSecondsPerMeter.symbolStringProperty' );
addToMapIfDefined( 'units_moles_symbol', 'units.moles.symbolStringProperty' );
addToMapIfDefined( 'units_molesPerSecond_symbol', 'units.molesPerSecond.symbolStringProperty' );
addToMapIfDefined( 'units_molar_symbol', 'units.molar.symbolStringProperty' );
addToMapIfDefined( 'units_molesPerLiter_symbol', 'units.molesPerLiter.symbolStringProperty' );
addToMapIfDefined( 'units_radians_symbol', 'units.radians.symbolStringProperty' );
addToMapIfDefined( 'units_radiansPerSecond_symbol', 'units.radiansPerSecond.symbolStringProperty' );
addToMapIfDefined( 'units_radiansPerSecondSquared_symbol', 'units.radiansPerSecondSquared.symbolStringProperty' );
addToMapIfDefined( 'units_years_symbol', 'units.years.symbolStringProperty' );
addToMapIfDefined( 'units_astronomicalUnits_symbol', 'units.astronomicalUnits.symbolStringProperty' );
addToMapIfDefined( 'units_astronomicalUnitsSquared_symbol', 'units.astronomicalUnitsSquared.symbolStringProperty' );
addToMapIfDefined( 'units_viewCoordinatesPerSecond_symbol', 'units.viewCoordinatesPerSecond.symbolStringProperty' );
addToMapIfDefined( 'units_atomicMassUnits_symbol', 'units.atomicMassUnits.symbolStringProperty' );
addToMapIfDefined( 'units_coulombs_symbol', 'units.coulombs.symbolStringProperty' );
addToMapIfDefined( 'units_cubicMeters_symbol', 'units.cubicMeters.symbolStringProperty' );
addToMapIfDefined( 'units_cubicPicometers_symbol', 'units.cubicPicometers.symbolStringProperty' );
addToMapIfDefined( 'units_electronVolt_symbol', 'units.electronVolt.symbolStringProperty' );
addToMapIfDefined( 'units_millimeters_symbol', 'units.millimeters.symbolStringProperty' );
addToMapIfDefined( 'units_particlesPerPicosecond_symbol', 'units.particlesPerPicosecond.symbolStringProperty' );
addToMapIfDefined( 'units_revolutionsPerMinute_symbol', 'units.revolutionsPerMinute.symbolStringProperty' );
addToMapIfDefined( 'units_atmospheres_symbol', 'units.atmospheres.symbolStringProperty' );
addToMapIfDefined( 'units_kilogramMetersPerSecond_symbol', 'units.kilogramMetersPerSecond.symbolStringProperty' );
addToMapIfDefined( 'units_picometersPerPicosecond_symbol', 'units.picometersPerPicosecond.symbolStringProperty' );
addToMapIfDefined( 'a11y_simSection_screenSummary_keyboardShortcutsHint', 'a11y.simSection.screenSummary.keyboardShortcutsHintStringProperty' );
addToMapIfDefined( 'a11y_simSection_playArea', 'a11y.simSection.playAreaStringProperty' );
addToMapIfDefined( 'a11y_simSection_controlArea', 'a11y.simSection.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_resetAll_accessibleName', 'a11y.resetAll.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_resetAll_accessibleContextResponse', 'a11y.resetAll.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_soundToggle_label', 'a11y.soundToggle.labelStringProperty' );
addToMapIfDefined( 'a11y_soundToggle_alert_simSoundOn', 'a11y.soundToggle.alert.simSoundOnStringProperty' );
addToMapIfDefined( 'a11y_soundToggle_alert_simSoundOff', 'a11y.soundToggle.alert.simSoundOffStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_setValuesInKeypadDescription', 'a11y.keyboardHelpDialog.general.setValuesInKeypadDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_comboBox_closeWithoutChanging', 'a11y.keyboardHelpDialog.comboBox.closeWithoutChangingStringProperty' );
addToMapIfDefined( 'a11y_keyboard_helpPatterns_actionStatement', 'a11y.keyboard.helpPatterns.actionStatementStringProperty' );
addToMapIfDefined( 'a11y_keyboard_helpPatterns_actionWithKeys', 'a11y.keyboard.helpPatterns.actionWithKeysStringProperty' );
addToMapIfDefined( 'a11y_keyboard_helpPatterns_modifiersPlusKeys', 'a11y.keyboard.helpPatterns.modifiersPlusKeysStringProperty' );
addToMapIfDefined( 'a11y_keyboard_helpPatterns_singleKey', 'a11y.keyboard.helpPatterns.singleKeyStringProperty' );
addToMapIfDefined( 'a11y_keyboard_helpPatterns_multipleKeys', 'a11y.keyboard.helpPatterns.multipleKeysStringProperty' );
addToMapIfDefined( 'a11y_keyboard_helpPatterns_twoItemList', 'a11y.keyboard.helpPatterns.twoItemListStringProperty' );
addToMapIfDefined( 'a11y_keyboard_helpPatterns_serialList', 'a11y.keyboard.helpPatterns.serialListStringProperty' );
addToMapIfDefined( 'a11y_keyboard_helpPatterns_commaSpace', 'a11y.keyboard.helpPatterns.commaSpaceStringProperty' );
addToMapIfDefined( 'a11y_keyboard_helpPatterns_spacePlusSpace', 'a11y.keyboard.helpPatterns.spacePlusSpaceStringProperty' );
addToMapIfDefined( 'a11y_keyboard_key_leftArrow', 'a11y.keyboard.key.leftArrowStringProperty' );
addToMapIfDefined( 'a11y_keyboard_key_rightArrow', 'a11y.keyboard.key.rightArrowStringProperty' );
addToMapIfDefined( 'a11y_keyboard_key_upArrow', 'a11y.keyboard.key.upArrowStringProperty' );
addToMapIfDefined( 'a11y_keyboard_key_downArrow', 'a11y.keyboard.key.downArrowStringProperty' );
addToMapIfDefined( 'a11y_keyboard_key_pageUp', 'a11y.keyboard.key.pageUpStringProperty' );
addToMapIfDefined( 'a11y_keyboard_key_pageDown', 'a11y.keyboard.key.pageDownStringProperty' );
addToMapIfDefined( 'a11y_keyboard_key_escape', 'a11y.keyboard.key.escapeStringProperty' );
addToMapIfDefined( 'a11y_keyboard_key_control', 'a11y.keyboard.key.controlStringProperty' );
addToMapIfDefined( 'a11y_keySets_arrowOrWASD', 'a11y.keySets.arrowOrWASDStringProperty' );
addToMapIfDefined( 'a11y_keySets_arrow', 'a11y.keySets.arrowStringProperty' );
addToMapIfDefined( 'a11y_keySets_leftRightOrUpDownArrows', 'a11y.keySets.leftRightOrUpDownArrowsStringProperty' );
addToMapIfDefined( 'a11y_keySets_leftRightArrows', 'a11y.keySets.leftRightArrowsStringProperty' );
addToMapIfDefined( 'a11y_keySets_leftOrRightArrows', 'a11y.keySets.leftOrRightArrowsStringProperty' );
addToMapIfDefined( 'a11y_keySets_upDownArrows', 'a11y.keySets.upDownArrowsStringProperty' );
addToMapIfDefined( 'a11y_keySets_upOrDownArrows', 'a11y.keySets.upOrDownArrowsStringProperty' );
addToMapIfDefined( 'a11y_keySets_wasd', 'a11y.keySets.wasdStringProperty' );
addToMapIfDefined( 'a11y_keySets_ad', 'a11y.keySets.adStringProperty' );
addToMapIfDefined( 'a11y_keySets_ws', 'a11y.keySets.wsStringProperty' );
addToMapIfDefined( 'a11y_keySets_leftRightOrAD', 'a11y.keySets.leftRightOrADStringProperty' );
addToMapIfDefined( 'a11y_keySets_upDownOrWS', 'a11y.keySets.upDownOrWSStringProperty' );
addToMapIfDefined( 'a11y_eraserButton_accessibleName', 'a11y.eraserButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_timerToggleButton_accessibleNameOn', 'a11y.timerToggleButton.accessibleNameOnStringProperty' );
addToMapIfDefined( 'a11y_timerToggleButton_accessibleNameOff', 'a11y.timerToggleButton.accessibleNameOffStringProperty' );
addToMapIfDefined( 'a11y_playControlButton_play', 'a11y.playControlButton.playStringProperty' );
addToMapIfDefined( 'a11y_playControlButton_pause', 'a11y.playControlButton.pauseStringProperty' );
addToMapIfDefined( 'a11y_playControlButton_stop', 'a11y.playControlButton.stopStringProperty' );
addToMapIfDefined( 'a11y_playPauseButton_playingAccessibleContextResponse', 'a11y.playPauseButton.playingAccessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_playPauseButton_pausedAccessibleContextResponse', 'a11y.playPauseButton.pausedAccessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_stepBackwardButton_accessibleName', 'a11y.stepBackwardButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_stepBackwardButton_accessibleContextResponse', 'a11y.stepBackwardButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_stepForwardButton_accessibleName', 'a11y.stepForwardButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_stepForwardButton_accessibleContextResponse', 'a11y.stepForwardButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_stepButton_playingDescription', 'a11y.stepButton.playingDescriptionStringProperty' );
addToMapIfDefined( 'a11y_stepButton_pausedDescription', 'a11y.stepButton.pausedDescriptionStringProperty' );
addToMapIfDefined( 'a11y_timeControlNode_simSpeedDescription', 'a11y.timeControlNode.simSpeedDescriptionStringProperty' );
addToMapIfDefined( 'a11y_timeControlNode_accessibleHeading', 'a11y.timeControlNode.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_timeControlNode_simSpeeds', 'a11y.timeControlNode.simSpeedsStringProperty' );
addToMapIfDefined( 'a11y_playPauseStepButtonGroup_playingHelpText', 'a11y.playPauseStepButtonGroup.playingHelpTextStringProperty' );
addToMapIfDefined( 'a11y_playPauseStepButtonGroup_pausedHelpText', 'a11y.playPauseStepButtonGroup.pausedHelpTextStringProperty' );
addToMapIfDefined( 'a11y_restartButton_accessibleName', 'a11y.restartButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_down', 'a11y.movementAlerter.downStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_left', 'a11y.movementAlerter.leftStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_right', 'a11y.movementAlerter.rightStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_up', 'a11y.movementAlerter.upStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_upAndToTheRight', 'a11y.movementAlerter.upAndToTheRightStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_upAndToTheLeft', 'a11y.movementAlerter.upAndToTheLeftStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_downAndToTheRight', 'a11y.movementAlerter.downAndToTheRightStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_downAndToTheLeft', 'a11y.movementAlerter.downAndToTheLeftStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_leftBorderAlert', 'a11y.movementAlerter.leftBorderAlertStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_rightBorderAlert', 'a11y.movementAlerter.rightBorderAlertStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_topBorderAlert', 'a11y.movementAlerter.topBorderAlertStringProperty' );
addToMapIfDefined( 'a11y_movementAlerter_bottomBorderAlert', 'a11y.movementAlerter.bottomBorderAlertStringProperty' );
addToMapIfDefined( 'a11y_grabDrag_movable', 'a11y.grabDrag.movableStringProperty' );
addToMapIfDefined( 'a11y_grabDrag_button', 'a11y.grabDrag.buttonStringProperty' );
addToMapIfDefined( 'a11y_grabDrag_defaultObjectToGrab', 'a11y.grabDrag.defaultObjectToGrabStringProperty' );
addToMapIfDefined( 'a11y_grabDrag_released', 'a11y.grabDrag.releasedStringProperty' );
addToMapIfDefined( 'a11y_grabDrag_grabbed', 'a11y.grabDrag.grabbedStringProperty' );
addToMapIfDefined( 'a11y_grabDrag_spaceToGrabOrRelease', 'a11y.grabDrag.spaceToGrabOrReleaseStringProperty' );
addToMapIfDefined( 'a11y_groupSort_sortable', 'a11y.groupSort.sortableStringProperty' );
addToMapIfDefined( 'a11y_groupSort_navigable', 'a11y.groupSort.navigableStringProperty' );
addToMapIfDefined( 'a11y_groupSort_grabbedAccessibleObjectResponse', 'a11y.groupSort.grabbedAccessibleObjectResponseStringProperty' );
addToMapIfDefined( 'a11y_groupSort_releasedAccessibleObjectResponse', 'a11y.groupSort.releasedAccessibleObjectResponseStringProperty' );
addToMapIfDefined( 'a11y_voicing_grabbedAlert', 'a11y.voicing.grabbedAlertStringProperty' );
addToMapIfDefined( 'a11y_voicing_draggableAlert', 'a11y.voicing.draggableAlertStringProperty' );
addToMapIfDefined( 'a11y_close', 'a11y.closeStringProperty' );
addToMapIfDefined( 'a11y_zoomIn', 'a11y.zoomInStringProperty' );
addToMapIfDefined( 'a11y_zoomOut', 'a11y.zoomOutStringProperty' );
addToMapIfDefined( 'a11y_measuringTape', 'a11y.measuringTapeStringProperty' );
addToMapIfDefined( 'a11y_measuringTapeTip', 'a11y.measuringTapeTipStringProperty' );
addToMapIfDefined( 'a11y_info', 'a11y.infoStringProperty' );
addToMapIfDefined( 'a11y_offScaleIndicator_pointsOffScaleUp', 'a11y.offScaleIndicator.pointsOffScaleUpStringProperty' );
addToMapIfDefined( 'a11y_offScaleIndicator_pointsOffScaleDown', 'a11y.offScaleIndicator.pointsOffScaleDownStringProperty' );
addToMapIfDefined( 'a11y_offScaleIndicator_pointsOffScaleLeft', 'a11y.offScaleIndicator.pointsOffScaleLeftStringProperty' );
addToMapIfDefined( 'a11y_offScaleIndicator_pointsOffScaleRight', 'a11y.offScaleIndicator.pointsOffScaleRightStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_accessibleName', 'a11y.stopwatch.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_accessibleHelpText', 'a11y.stopwatch.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_units_seconds_seconds', 'a11y.stopwatch.units.seconds.secondsStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_units_seconds_pattern', 'a11y.stopwatch.units.seconds.patternStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_units_minutesAndSeconds_pattern', 'a11y.stopwatch.units.minutesAndSeconds.patternStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_units_valueUnits_pattern', 'a11y.stopwatch.units.valueUnits.patternStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_resetButton_accessibleName', 'a11y.stopwatch.resetButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_resetButton_accessibleContextResponse', 'a11y.stopwatch.resetButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_playButton_accessibleName', 'a11y.stopwatch.playButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_pauseButton_accessibleName', 'a11y.stopwatch.pauseButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_negativeNumber', 'a11y.negativeNumberStringProperty' );
addToMapIfDefined( 'a11y_scientificNotation', 'a11y.scientificNotationStringProperty' );
addToMapIfDefined( 'a11y_units_centimeters_pattern', 'a11y.units.centimeters.patternStringProperty' );
addToMapIfDefined( 'a11y_units_centimetersSquared_pattern', 'a11y.units.centimetersSquared.patternStringProperty' );
addToMapIfDefined( 'a11y_units_hertz_pattern', 'a11y.units.hertz.patternStringProperty' );
addToMapIfDefined( 'a11y_units_percent_pattern', 'a11y.units.percent.patternStringProperty' );
addToMapIfDefined( 'a11y_units_seconds_pattern', 'a11y.units.seconds.patternStringProperty' );
addToMapIfDefined( 'a11y_units_kilopascals_pattern', 'a11y.units.kilopascals.patternStringProperty' );
addToMapIfDefined( 'a11y_units_amperes_pattern', 'a11y.units.amperes.patternStringProperty' );
addToMapIfDefined( 'a11y_units_volts_pattern', 'a11y.units.volts.patternStringProperty' );
addToMapIfDefined( 'a11y_units_newtons_pattern', 'a11y.units.newtons.patternStringProperty' );
addToMapIfDefined( 'a11y_units_watts_pattern', 'a11y.units.watts.patternStringProperty' );
addToMapIfDefined( 'a11y_units_joules_pattern', 'a11y.units.joules.patternStringProperty' );
addToMapIfDefined( 'a11y_units_kelvin_pattern', 'a11y.units.kelvin.patternStringProperty' );
addToMapIfDefined( 'a11y_units_degrees_pattern', 'a11y.units.degrees.patternStringProperty' );
addToMapIfDefined( 'a11y_units_degreesCelsius_pattern', 'a11y.units.degreesCelsius.patternStringProperty' );
addToMapIfDefined( 'a11y_units_degreesFahrenheit_pattern', 'a11y.units.degreesFahrenheit.patternStringProperty' );
addToMapIfDefined( 'a11y_units_liters_pattern', 'a11y.units.liters.patternStringProperty' );
addToMapIfDefined( 'a11y_units_litersPerSecond_pattern', 'a11y.units.litersPerSecond.patternStringProperty' );
addToMapIfDefined( 'a11y_units_meters_pattern', 'a11y.units.meters.patternStringProperty' );
addToMapIfDefined( 'a11y_units_metersPerSecond_pattern', 'a11y.units.metersPerSecond.patternStringProperty' );
addToMapIfDefined( 'a11y_units_metersPerSecondSquared_pattern', 'a11y.units.metersPerSecondSquared.patternStringProperty' );
addToMapIfDefined( 'a11y_units_metersPerSecondPerSecond_pattern', 'a11y.units.metersPerSecondPerSecond.patternStringProperty' );
addToMapIfDefined( 'a11y_units_grams_pattern', 'a11y.units.grams.patternStringProperty' );
addToMapIfDefined( 'a11y_units_kilograms_pattern', 'a11y.units.kilograms.patternStringProperty' );
addToMapIfDefined( 'a11y_units_kilogramsPerLiter_pattern', 'a11y.units.kilogramsPerLiter.patternStringProperty' );
addToMapIfDefined( 'a11y_units_kilogramsPerCubicMeter_pattern', 'a11y.units.kilogramsPerCubicMeter.patternStringProperty' );
addToMapIfDefined( 'a11y_units_nanometers_pattern', 'a11y.units.nanometers.patternStringProperty' );
addToMapIfDefined( 'a11y_units_nanometersPerPicosecond_pattern', 'a11y.units.nanometersPerPicosecond.patternStringProperty' );
addToMapIfDefined( 'a11y_units_kilometersPerSecond_pattern', 'a11y.units.kilometersPerSecond.patternStringProperty' );
addToMapIfDefined( 'a11y_units_picometers_pattern', 'a11y.units.picometers.patternStringProperty' );
addToMapIfDefined( 'a11y_units_picometersPerSecond_pattern', 'a11y.units.picometersPerSecond.patternStringProperty' );
addToMapIfDefined( 'a11y_units_picometersPerSecondSquared_pattern', 'a11y.units.picometersPerSecondSquared.patternStringProperty' );
addToMapIfDefined( 'a11y_units_nanoseconds_pattern', 'a11y.units.nanoseconds.patternStringProperty' );
addToMapIfDefined( 'a11y_units_picoseconds_pattern', 'a11y.units.picoseconds.patternStringProperty' );
addToMapIfDefined( 'a11y_units_molarAbsorptivity_pattern', 'a11y.units.molarAbsorptivity.patternStringProperty' );
addToMapIfDefined( 'a11y_units_ohms_pattern', 'a11y.units.ohms.patternStringProperty' );
addToMapIfDefined( 'a11y_units_ohmCentimeters_pattern', 'a11y.units.ohmCentimeters.patternStringProperty' );
addToMapIfDefined( 'a11y_units_millivolts_pattern', 'a11y.units.millivolts.patternStringProperty' );
addToMapIfDefined( 'a11y_units_milliamperes_pattern', 'a11y.units.milliamperes.patternStringProperty' );
addToMapIfDefined( 'a11y_units_farads_pattern', 'a11y.units.farads.patternStringProperty' );
addToMapIfDefined( 'a11y_units_webers_pattern', 'a11y.units.webers.patternStringProperty' );
addToMapIfDefined( 'a11y_units_gauss_pattern', 'a11y.units.gauss.patternStringProperty' );
addToMapIfDefined( 'a11y_units_pascalSeconds_pattern', 'a11y.units.pascalSeconds.patternStringProperty' );
addToMapIfDefined( 'a11y_units_newtonsPerMeter_pattern', 'a11y.units.newtonsPerMeter.patternStringProperty' );
addToMapIfDefined( 'a11y_units_newtonSecondsPerMeter_pattern', 'a11y.units.newtonSecondsPerMeter.patternStringProperty' );
addToMapIfDefined( 'a11y_units_moles_pattern', 'a11y.units.moles.patternStringProperty' );
addToMapIfDefined( 'a11y_units_molesPerSecond_pattern', 'a11y.units.molesPerSecond.patternStringProperty' );
addToMapIfDefined( 'a11y_units_molar_pattern', 'a11y.units.molar.patternStringProperty' );
addToMapIfDefined( 'a11y_units_molesPerLiter_pattern', 'a11y.units.molesPerLiter.patternStringProperty' );
addToMapIfDefined( 'a11y_units_radians_pattern', 'a11y.units.radians.patternStringProperty' );
addToMapIfDefined( 'a11y_units_radiansPerSecond_pattern', 'a11y.units.radiansPerSecond.patternStringProperty' );
addToMapIfDefined( 'a11y_units_radiansPerSecondSquared_pattern', 'a11y.units.radiansPerSecondSquared.patternStringProperty' );
addToMapIfDefined( 'a11y_units_years_pattern', 'a11y.units.years.patternStringProperty' );
addToMapIfDefined( 'a11y_units_astronomicalUnits_pattern', 'a11y.units.astronomicalUnits.patternStringProperty' );
addToMapIfDefined( 'a11y_units_astronomicalUnitsSquared_pattern', 'a11y.units.astronomicalUnitsSquared.patternStringProperty' );
addToMapIfDefined( 'a11y_units_viewCoordinatesPerSecond_pattern', 'a11y.units.viewCoordinatesPerSecond.patternStringProperty' );
addToMapIfDefined( 'a11y_units_atomicMassUnits_pattern', 'a11y.units.atomicMassUnits.patternStringProperty' );
addToMapIfDefined( 'a11y_units_coulombs_pattern', 'a11y.units.coulombs.patternStringProperty' );
addToMapIfDefined( 'a11y_units_cubicMeters_pattern', 'a11y.units.cubicMeters.patternStringProperty' );
addToMapIfDefined( 'a11y_units_cubicPicometers_pattern', 'a11y.units.cubicPicometers.patternStringProperty' );
addToMapIfDefined( 'a11y_units_electronVolt_pattern', 'a11y.units.electronVolt.patternStringProperty' );
addToMapIfDefined( 'a11y_units_millimeters_pattern', 'a11y.units.millimeters.patternStringProperty' );
addToMapIfDefined( 'a11y_units_particlesPerPicosecond_pattern', 'a11y.units.particlesPerPicosecond.patternStringProperty' );
addToMapIfDefined( 'a11y_units_revolutionsPerMinute_pattern', 'a11y.units.revolutionsPerMinute.patternStringProperty' );
addToMapIfDefined( 'a11y_units_atmospheres_pattern', 'a11y.units.atmospheres.patternStringProperty' );
addToMapIfDefined( 'a11y_units_kilogramMetersPerSecond_pattern', 'a11y.units.kilogramMetersPerSecond.patternStringProperty' );
addToMapIfDefined( 'a11y_units_picometersPerPicosecond_pattern', 'a11y.units.picometersPerPicosecond.patternStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${FluentLibrary.formatMultilineForFtl( stringProperty.value )}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const SceneryPhetFluent = {
  "scenery-phet": {
    titleStringProperty: _.get( SceneryPhetStrings, 'scenery-phet.titleStringProperty' )
  },
  screen: {
    buttonsStringProperty: _.get( SceneryPhetStrings, 'screen.buttonsStringProperty' ),
    componentsStringProperty: _.get( SceneryPhetStrings, 'screen.componentsStringProperty' ),
    dialogsStringProperty: _.get( SceneryPhetStrings, 'screen.dialogsStringProperty' ),
    keyboardStringProperty: _.get( SceneryPhetStrings, 'screen.keyboardStringProperty' ),
    slidersStringProperty: _.get( SceneryPhetStrings, 'screen.slidersStringProperty' ),
    spinnersStringProperty: _.get( SceneryPhetStrings, 'screen.spinnersStringProperty' )
  },
  WavelengthSlider: {
    pattern_0wavelength_1unitsStringProperty: _.get( SceneryPhetStrings, 'WavelengthSlider.pattern_0wavelength_1unitsStringProperty' )
  },
  frequencyUnitsPatternStringProperty: _.get( SceneryPhetStrings, 'frequencyUnitsPatternStringProperty' ),
  stopwatchValueUnitsPatternStringProperty: _.get( SceneryPhetStrings, 'stopwatchValueUnitsPatternStringProperty' ),
  units_nmStringProperty: _.get( SceneryPhetStrings, 'units_nmStringProperty' ),
  shortCircuitStringProperty: _.get( SceneryPhetStrings, 'shortCircuitStringProperty' ),
  heatStringProperty: _.get( SceneryPhetStrings, 'heatStringProperty' ),
  coolStringProperty: _.get( SceneryPhetStrings, 'coolStringProperty' ),
  key: {
    tabStringProperty: _.get( SceneryPhetStrings, 'key.tabStringProperty' ),
    shiftStringProperty: _.get( SceneryPhetStrings, 'key.shiftStringProperty' ),
    altStringProperty: _.get( SceneryPhetStrings, 'key.altStringProperty' ),
    optionStringProperty: _.get( SceneryPhetStrings, 'key.optionStringProperty' ),
    capsLockStringProperty: _.get( SceneryPhetStrings, 'key.capsLockStringProperty' ),
    enterStringProperty: _.get( SceneryPhetStrings, 'key.enterStringProperty' ),
    returnStringProperty: _.get( SceneryPhetStrings, 'key.returnStringProperty' ),
    backspaceStringProperty: _.get( SceneryPhetStrings, 'key.backspaceStringProperty' ),
    deleteStringProperty: _.get( SceneryPhetStrings, 'key.deleteStringProperty' ),
    spaceStringProperty: _.get( SceneryPhetStrings, 'key.spaceStringProperty' ),
    escStringProperty: _.get( SceneryPhetStrings, 'key.escStringProperty' ),
    fnStringProperty: _.get( SceneryPhetStrings, 'key.fnStringProperty' ),
    pageUpStringProperty: _.get( SceneryPhetStrings, 'key.pageUpStringProperty' ),
    pageDownStringProperty: _.get( SceneryPhetStrings, 'key.pageDownStringProperty' ),
    homeStringProperty: _.get( SceneryPhetStrings, 'key.homeStringProperty' ),
    endStringProperty: _.get( SceneryPhetStrings, 'key.endStringProperty' ),
    aStringProperty: _.get( SceneryPhetStrings, 'key.aStringProperty' ),
    bStringProperty: _.get( SceneryPhetStrings, 'key.bStringProperty' ),
    cStringProperty: _.get( SceneryPhetStrings, 'key.cStringProperty' ),
    dStringProperty: _.get( SceneryPhetStrings, 'key.dStringProperty' ),
    eStringProperty: _.get( SceneryPhetStrings, 'key.eStringProperty' ),
    fStringProperty: _.get( SceneryPhetStrings, 'key.fStringProperty' ),
    gStringProperty: _.get( SceneryPhetStrings, 'key.gStringProperty' ),
    hStringProperty: _.get( SceneryPhetStrings, 'key.hStringProperty' ),
    iStringProperty: _.get( SceneryPhetStrings, 'key.iStringProperty' ),
    jStringProperty: _.get( SceneryPhetStrings, 'key.jStringProperty' ),
    kStringProperty: _.get( SceneryPhetStrings, 'key.kStringProperty' ),
    lStringProperty: _.get( SceneryPhetStrings, 'key.lStringProperty' ),
    mStringProperty: _.get( SceneryPhetStrings, 'key.mStringProperty' ),
    nStringProperty: _.get( SceneryPhetStrings, 'key.nStringProperty' ),
    oStringProperty: _.get( SceneryPhetStrings, 'key.oStringProperty' ),
    pStringProperty: _.get( SceneryPhetStrings, 'key.pStringProperty' ),
    qStringProperty: _.get( SceneryPhetStrings, 'key.qStringProperty' ),
    rStringProperty: _.get( SceneryPhetStrings, 'key.rStringProperty' ),
    sStringProperty: _.get( SceneryPhetStrings, 'key.sStringProperty' ),
    tStringProperty: _.get( SceneryPhetStrings, 'key.tStringProperty' ),
    uStringProperty: _.get( SceneryPhetStrings, 'key.uStringProperty' ),
    vStringProperty: _.get( SceneryPhetStrings, 'key.vStringProperty' ),
    wStringProperty: _.get( SceneryPhetStrings, 'key.wStringProperty' ),
    xStringProperty: _.get( SceneryPhetStrings, 'key.xStringProperty' ),
    yStringProperty: _.get( SceneryPhetStrings, 'key.yStringProperty' ),
    zStringProperty: _.get( SceneryPhetStrings, 'key.zStringProperty' ),
    zeroStringProperty: _.get( SceneryPhetStrings, 'key.zeroStringProperty' ),
    oneStringProperty: _.get( SceneryPhetStrings, 'key.oneStringProperty' ),
    twoStringProperty: _.get( SceneryPhetStrings, 'key.twoStringProperty' ),
    threeStringProperty: _.get( SceneryPhetStrings, 'key.threeStringProperty' ),
    fourStringProperty: _.get( SceneryPhetStrings, 'key.fourStringProperty' ),
    fiveStringProperty: _.get( SceneryPhetStrings, 'key.fiveStringProperty' ),
    sixStringProperty: _.get( SceneryPhetStrings, 'key.sixStringProperty' ),
    sevenStringProperty: _.get( SceneryPhetStrings, 'key.sevenStringProperty' ),
    eightStringProperty: _.get( SceneryPhetStrings, 'key.eightStringProperty' ),
    nineStringProperty: _.get( SceneryPhetStrings, 'key.nineStringProperty' ),
    toGrabOrReleaseStringProperty: _.get( SceneryPhetStrings, 'key.toGrabOrReleaseStringProperty' )
  },
  webglWarning: {
    titleStringProperty: _.get( SceneryPhetStrings, 'webglWarning.titleStringProperty' ),
    bodyStringProperty: _.get( SceneryPhetStrings, 'webglWarning.bodyStringProperty' ),
    contextLossFailureStringProperty: _.get( SceneryPhetStrings, 'webglWarning.contextLossFailureStringProperty' ),
    contextLossReloadStringProperty: _.get( SceneryPhetStrings, 'webglWarning.contextLossReloadStringProperty' ),
    ie11StencilBodyStringProperty: _.get( SceneryPhetStrings, 'webglWarning.ie11StencilBodyStringProperty' )
  },
  keyboardHelpDialog: {
    sliderControlsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.sliderControlsStringProperty' ),
    adjustSliderStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.adjustSliderStringProperty' ),
    spinnerControlsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.spinnerControlsStringProperty' ),
    adjustInSmallerStepsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.adjustInSmallerStepsStringProperty' ),
    adjustInLargerStepsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.adjustInLargerStepsStringProperty' ),
    jumpToMinimumStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.jumpToMinimumStringProperty' ),
    jumpToMaximumStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.jumpToMaximumStringProperty' ),
    adjustStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.adjustStringProperty' ),
    sliderStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.sliderStringProperty' ),
    spinnerStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.spinnerStringProperty' ),
    heatCoolControlsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.heatCoolControlsStringProperty' ),
    maximumHeatStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.maximumHeatStringProperty' ),
    maximumCoolStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.maximumCoolStringProperty' ),
    heatCoolOffStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.heatCoolOffStringProperty' ),
    verbSliderPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.verbSliderPatternStringProperty' ),
    verbInSmallerStepsPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.verbInSmallerStepsPatternStringProperty' ),
    verbInLargerStepsPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.verbInLargerStepsPatternStringProperty' ),
    minimumStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.minimumStringProperty' ),
    maximumStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.maximumStringProperty' ),
    jumpToMinimumPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.jumpToMinimumPatternStringProperty' ),
    jumpToMaximumPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.jumpToMaximumPatternStringProperty' ),
    generalNavigationStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.generalNavigationStringProperty' ),
    basicActionsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.basicActionsStringProperty' ),
    moveToNextItemStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveToNextItemStringProperty' ),
    moveToPreviousItemStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveToPreviousItemStringProperty' ),
    moveToNextItemOrGroupStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveToNextItemOrGroupStringProperty' ),
    moveToPreviousItemOrGroupStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveToPreviousItemOrGroupStringProperty' ),
    pressButtonsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.pressButtonsStringProperty' ),
    moveBetweenItemsInAGroupStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveBetweenItemsInAGroupStringProperty' ),
    setValuesInKeypadStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.setValuesInKeypadStringProperty' ),
    resetAllStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.resetAllStringProperty' ),
    exitADialogStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.exitADialogStringProperty' ),
    toggleCheckboxesStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.toggleCheckboxesStringProperty' ),
    orStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.orStringProperty' ),
    hyphenStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.hyphenStringProperty' ),
    grabOrReleaseHeadingPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.grabOrReleaseHeadingPatternStringProperty' ),
    grabOrReleaseLabelPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.grabOrReleaseLabelPatternStringProperty' ),
    comboBox: {
      chooseAThingPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.chooseAThingPatternStringProperty' ),
      headingStringStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.headingStringStringProperty' ),
      _comment_0: new FluentComment( {"comment":"These descriptions are the same as the visual, but without the numbers. The numbers need to be","associatedKey":"popUpListPattern"} ),
      _comment_1: new FluentComment( {"comment":"displayed visually, but included in the string so that formatting can be localized.","associatedKey":"popUpListPattern"} ),
      _comment_2: new FluentComment( {"comment":"For the accessible content, the numbers are implicit in the accessible markup, so they are not included","associatedKey":"popUpListPattern"} ),
      _comment_3: new FluentComment( {"comment":"in the accessible descriptions. Unfortunately, this means that the strings cannot be shared.","associatedKey":"popUpListPattern"} ),
      popUpListPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.popUpListPatternStringProperty' ),
      moveThroughPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.moveThroughPatternStringProperty' ),
      chooseNewPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.chooseNewPatternStringProperty' ),
      closeWithoutChangingStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.closeWithoutChangingStringProperty' ),
      optionsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.optionsStringProperty' ),
      optionStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.optionStringProperty' )
    },
    moveDraggableItemsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveDraggableItemsStringProperty' ),
    moveStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveStringProperty' ),
    moveSlowerStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveSlowerStringProperty' ),
    faucetControls: {
      faucetControlsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.faucetControlsStringProperty' ),
      adjustFaucetFlowStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.adjustFaucetFlowStringProperty' ),
      adjustInSmallerStepsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.adjustInSmallerStepsStringProperty' ),
      adjustInLargerStepsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.adjustInLargerStepsStringProperty' ),
      closeFaucetStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.closeFaucetStringProperty' ),
      openFaucetFullyStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.openFaucetFullyStringProperty' ),
      openFaucetBrieflyStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.openFaucetBrieflyStringProperty' )
    },
    timingControls: {
      timingControlsStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.timingControls.timingControlsStringProperty' ),
      pauseOrPlayActionStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.timingControls.pauseOrPlayActionStringProperty' )
    }
  },
  speed: {
    normalStringProperty: _.get( SceneryPhetStrings, 'speed.normalStringProperty' ),
    slowStringProperty: _.get( SceneryPhetStrings, 'speed.slowStringProperty' ),
    fastStringProperty: _.get( SceneryPhetStrings, 'speed.fastStringProperty' )
  },
  symbol: {
    ohmsStringProperty: _.get( SceneryPhetStrings, 'symbol.ohmsStringProperty' ),
    resistivityStringProperty: _.get( SceneryPhetStrings, 'symbol.resistivityStringProperty' )
  },
  comboBoxDisplay: {
    valueUnitsStringProperty: _.get( SceneryPhetStrings, 'comboBoxDisplay.valueUnitsStringProperty' )
  },
  wavelengthNMValuePatternStringProperty: _.get( SceneryPhetStrings, 'wavelengthNMValuePatternStringProperty' ),
  measuringTapeReadoutPatternStringProperty: _.get( SceneryPhetStrings, 'measuringTapeReadoutPatternStringProperty' ),
  wavelengthStringProperty: _.get( SceneryPhetStrings, 'wavelengthStringProperty' ),
  rulerCapitalizedStringProperty: _.get( SceneryPhetStrings, 'rulerCapitalizedStringProperty' ),
  rulerStringProperty: _.get( SceneryPhetStrings, 'rulerStringProperty' ),
  zeroStringProperty: _.get( SceneryPhetStrings, 'zeroStringProperty' ),
  oneStringProperty: _.get( SceneryPhetStrings, 'oneStringProperty' ),
  twoStringProperty: _.get( SceneryPhetStrings, 'twoStringProperty' ),
  threeStringProperty: _.get( SceneryPhetStrings, 'threeStringProperty' ),
  fourStringProperty: _.get( SceneryPhetStrings, 'fourStringProperty' ),
  fiveStringProperty: _.get( SceneryPhetStrings, 'fiveStringProperty' ),
  sixStringProperty: _.get( SceneryPhetStrings, 'sixStringProperty' ),
  sevenStringProperty: _.get( SceneryPhetStrings, 'sevenStringProperty' ),
  eightStringProperty: _.get( SceneryPhetStrings, 'eightStringProperty' ),
  nineStringProperty: _.get( SceneryPhetStrings, 'nineStringProperty' ),
  tenStringProperty: _.get( SceneryPhetStrings, 'tenStringProperty' ),
  offScaleIndicator: {
    pointsOffScaleStringProperty: _.get( SceneryPhetStrings, 'offScaleIndicator.pointsOffScaleStringProperty' )
  },
  ResetAllButton: {
    nameStringProperty: _.get( SceneryPhetStrings, 'ResetAllButton.nameStringProperty' ),
    name__commentStringProperty: _.get( SceneryPhetStrings, 'ResetAllButton.name__commentStringProperty' ),
    name__deprecatedStringProperty: _.get( SceneryPhetStrings, 'ResetAllButton.name__deprecatedStringProperty' )
  },
  SoundToggleButton: {
    nameStringProperty: _.get( SceneryPhetStrings, 'SoundToggleButton.nameStringProperty' ),
    name__commentStringProperty: _.get( SceneryPhetStrings, 'SoundToggleButton.name__commentStringProperty' ),
    name__deprecatedStringProperty: _.get( SceneryPhetStrings, 'SoundToggleButton.name__deprecatedStringProperty' )
  },
  scientificNotationStringProperty: _.get( SceneryPhetStrings, 'scientificNotationStringProperty' ),
  units: {
    centimeters: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.centimeters.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.centimeters.symbolPatternStringProperty' )
    },
    centimetersSquared: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.centimetersSquared.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.centimetersSquared.symbolPatternStringProperty' )
    },
    hertz: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.hertz.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.hertz.symbolPatternStringProperty' )
    },
    percent: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.percent.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.percent.symbolPatternStringProperty' )
    },
    seconds: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.seconds.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.seconds.symbolPatternStringProperty' )
    },
    amperes: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.amperes.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.amperes.symbolPatternStringProperty' )
    },
    volts: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.volts.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.volts.symbolPatternStringProperty' )
    },
    newtons: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.newtons.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.newtons.symbolPatternStringProperty' )
    },
    watts: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.watts.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.watts.symbolPatternStringProperty' )
    },
    joules: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.joules.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.joules.symbolPatternStringProperty' )
    },
    kelvin: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.kelvin.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.kelvin.symbolPatternStringProperty' )
    },
    degrees: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.degrees.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.degrees.symbolPatternStringProperty' )
    },
    degreesCelsius: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.degreesCelsius.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.degreesCelsius.symbolPatternStringProperty' )
    },
    degreesFahrenheit: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.degreesFahrenheit.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.degreesFahrenheit.symbolPatternStringProperty' )
    },
    liters: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.liters.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.liters.symbolPatternStringProperty' )
    },
    litersPerSecond: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.litersPerSecond.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.litersPerSecond.symbolPatternStringProperty' )
    },
    meters: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.meters.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.meters.symbolPatternStringProperty' )
    },
    metersPerSecond: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.metersPerSecond.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.metersPerSecond.symbolPatternStringProperty' )
    },
    metersPerSecondSquared: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.metersPerSecondSquared.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.metersPerSecondSquared.symbolPatternStringProperty' )
    },
    metersPerSecondPerSecond: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.metersPerSecondPerSecond.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.metersPerSecondPerSecond.symbolPatternStringProperty' )
    },
    grams: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.grams.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.grams.symbolPatternStringProperty' )
    },
    kilograms: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.kilograms.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.kilograms.symbolPatternStringProperty' )
    },
    kilogramsPerLiter: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.kilogramsPerLiter.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.kilogramsPerLiter.symbolPatternStringProperty' )
    },
    kilogramsPerCubicMeter: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.kilogramsPerCubicMeter.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.kilogramsPerCubicMeter.symbolPatternStringProperty' )
    },
    kilopascals: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.kilopascals.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.kilopascals.symbolPatternStringProperty' )
    },
    nanometers: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.nanometers.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.nanometers.symbolPatternStringProperty' )
    },
    nanometersPerPicosecond: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.nanometersPerPicosecond.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.nanometersPerPicosecond.symbolPatternStringProperty' )
    },
    kilometersPerSecond: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.kilometersPerSecond.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.kilometersPerSecond.symbolPatternStringProperty' )
    },
    picometers: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.picometers.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.picometers.symbolPatternStringProperty' )
    },
    picometersPerSecond: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.picometersPerSecond.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.picometersPerSecond.symbolPatternStringProperty' )
    },
    picometersPerSecondSquared: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.picometersPerSecondSquared.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.picometersPerSecondSquared.symbolPatternStringProperty' )
    },
    nanoseconds: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.nanoseconds.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.nanoseconds.symbolPatternStringProperty' )
    },
    picoseconds: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.picoseconds.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.picoseconds.symbolPatternStringProperty' )
    },
    molarAbsorptivity: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.molarAbsorptivity.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.molarAbsorptivity.symbolPatternStringProperty' )
    },
    ohms: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.ohms.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.ohms.symbolPatternStringProperty' )
    },
    ohmCentimeters: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.ohmCentimeters.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.ohmCentimeters.symbolPatternStringProperty' )
    },
    millivolts: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.millivolts.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.millivolts.symbolPatternStringProperty' )
    },
    milliamperes: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.milliamperes.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.milliamperes.symbolPatternStringProperty' )
    },
    farads: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.farads.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.farads.symbolPatternStringProperty' )
    },
    webers: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.webers.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.webers.symbolPatternStringProperty' )
    },
    gauss: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.gauss.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.gauss.symbolPatternStringProperty' )
    },
    pascalSeconds: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.pascalSeconds.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.pascalSeconds.symbolPatternStringProperty' )
    },
    newtonsPerMeter: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.newtonsPerMeter.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.newtonsPerMeter.symbolPatternStringProperty' )
    },
    newtonSecondsPerMeter: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.newtonSecondsPerMeter.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.newtonSecondsPerMeter.symbolPatternStringProperty' )
    },
    moles: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.moles.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.moles.symbolPatternStringProperty' )
    },
    molesPerSecond: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.molesPerSecond.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.molesPerSecond.symbolPatternStringProperty' )
    },
    molar: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.molar.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.molar.symbolPatternStringProperty' )
    },
    molesPerLiter: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.molesPerLiter.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.molesPerLiter.symbolPatternStringProperty' )
    },
    radians: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.radians.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.radians.symbolPatternStringProperty' )
    },
    radiansPerSecond: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.radiansPerSecond.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.radiansPerSecond.symbolPatternStringProperty' )
    },
    radiansPerSecondSquared: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.radiansPerSecondSquared.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.radiansPerSecondSquared.symbolPatternStringProperty' )
    },
    years: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.years.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.years.symbolPatternStringProperty' )
    },
    astronomicalUnits: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.astronomicalUnits.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.astronomicalUnits.symbolPatternStringProperty' )
    },
    astronomicalUnitsSquared: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.astronomicalUnitsSquared.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.astronomicalUnitsSquared.symbolPatternStringProperty' )
    },
    viewCoordinatesPerSecond: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.viewCoordinatesPerSecond.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.viewCoordinatesPerSecond.symbolPatternStringProperty' )
    },
    atomicMassUnits: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.atomicMassUnits.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.atomicMassUnits.symbolPatternStringProperty' )
    },
    coulombs: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.coulombs.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.coulombs.symbolPatternStringProperty' )
    },
    cubicMeters: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.cubicMeters.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.cubicMeters.symbolPatternStringProperty' )
    },
    cubicPicometers: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.cubicPicometers.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.cubicPicometers.symbolPatternStringProperty' )
    },
    electronVolt: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.electronVolt.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.electronVolt.symbolPatternStringProperty' )
    },
    millimeters: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.millimeters.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.millimeters.symbolPatternStringProperty' )
    },
    particlesPerPicosecond: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.particlesPerPicosecond.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.particlesPerPicosecond.symbolPatternStringProperty' )
    },
    revolutionsPerMinute: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.revolutionsPerMinute.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.revolutionsPerMinute.symbolPatternStringProperty' )
    },
    atmospheres: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.atmospheres.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.atmospheres.symbolPatternStringProperty' )
    },
    kilogramMetersPerSecond: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.kilogramMetersPerSecond.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.kilogramMetersPerSecond.symbolPatternStringProperty' )
    },
    picometersPerPicosecond: {
      symbolStringProperty: _.get( SceneryPhetStrings, 'units.picometersPerPicosecond.symbolStringProperty' ),
      symbolPatternStringProperty: _.get( SceneryPhetStrings, 'units.picometersPerPicosecond.symbolPatternStringProperty' )
    }
  },
  a11y: {
    simSection: {
      screenSummary: {
        multiScreenIntroStringProperty: _.get( SceneryPhetStrings, 'a11y.simSection.screenSummary.multiScreenIntroStringProperty' ),
        singleScreenIntroPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.simSection.screenSummary.singleScreenIntroPatternStringProperty' ),
        keyboardShortcutsHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_simSection_screenSummary_keyboardShortcutsHint', _.get( SceneryPhetStrings, 'a11y.simSection.screenSummary.keyboardShortcutsHintStringProperty' ) )
      },
      playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_simSection_playArea', _.get( SceneryPhetStrings, 'a11y.simSection.playAreaStringProperty' ) ),
      controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_simSection_controlArea', _.get( SceneryPhetStrings, 'a11y.simSection.controlAreaStringProperty' ) )
    },
    resetAll: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_resetAll_accessibleName', _.get( SceneryPhetStrings, 'a11y.resetAll.accessibleNameStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_resetAll_accessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.resetAll.accessibleContextResponseStringProperty' ) )
    },
    soundToggle: {
      labelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_soundToggle_label', _.get( SceneryPhetStrings, 'a11y.soundToggle.labelStringProperty' ) ),
      alert: {
        simSoundOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_soundToggle_alert_simSoundOn', _.get( SceneryPhetStrings, 'a11y.soundToggle.alert.simSoundOnStringProperty' ) ),
        simSoundOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_soundToggle_alert_simSoundOff', _.get( SceneryPhetStrings, 'a11y.soundToggle.alert.simSoundOffStringProperty' ) )
      }
    },
    keyboardHelpDialog: {
      general: {
        setValuesInKeypadDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_setValuesInKeypadDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.setValuesInKeypadDescriptionStringProperty' ) )
      },
      comboBox: {
        _comment_0: new FluentComment( {"comment":"These descriptions are the same as the visual, but without the numbers. The numbers need to be","associatedKey":"popUpListPattern"} ),
        _comment_1: new FluentComment( {"comment":"displayed visually, but included in the string so that formatting can be localized.","associatedKey":"popUpListPattern"} ),
        _comment_2: new FluentComment( {"comment":"For the accessible content, the numbers are implicit in the accessible markup, so they are not included","associatedKey":"popUpListPattern"} ),
        _comment_3: new FluentComment( {"comment":"in the accessible descriptions. Unfortunately, this means that the strings cannot be shared.","associatedKey":"popUpListPattern"} ),
        popUpListPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.comboBox.popUpListPatternStringProperty' ),
        moveThroughPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.comboBox.moveThroughPatternStringProperty' ),
        chooseNewPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.comboBox.chooseNewPatternStringProperty' ),
        closeWithoutChangingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_comboBox_closeWithoutChanging', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.comboBox.closeWithoutChangingStringProperty' ) )
      }
    },
    keyboard: {
      helpPatterns: {
        _comment_0: new FluentComment( {"comment":"A standalone action statement without modifier keys. This should not be used, but is","associatedKey":"actionStatement"} ),
        _comment_1: new FluentComment( {"comment":"used as a fallback case.","associatedKey":"actionStatement"} ),
        actionStatement: new FluentPattern<{ action: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_keyboard_helpPatterns_actionStatement', _.get( SceneryPhetStrings, 'a11y.keyboard.helpPatterns.actionStatementStringProperty' ), [{"name":"action"}] ),
        _comment_2: new FluentComment( {"comment":"Combines an action with keys/modifiers in a single sentence.","associatedKey":"actionWithKeys"} ),
        actionWithKeys: new FluentPattern<{ action: FluentVariable, keys: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_keyboard_helpPatterns_actionWithKeys', _.get( SceneryPhetStrings, 'a11y.keyboard.helpPatterns.actionWithKeysStringProperty' ), [{"name":"action"},{"name":"keys"}] ),
        _comment_3: new FluentComment( {"comment":"Combines modifiers plus a list of keys.","associatedKey":"modifiersPlusKeys"} ),
        modifiersPlusKeys: new FluentPattern<{ keys: FluentVariable, modifiers: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_keyboard_helpPatterns_modifiersPlusKeys', _.get( SceneryPhetStrings, 'a11y.keyboard.helpPatterns.modifiersPlusKeysStringProperty' ), [{"name":"keys"},{"name":"modifiers"}] ),
        _comment_4: new FluentComment( {"comment":"Describes a single key or multiple keys. Used in other patterns, no punctuation.","associatedKey":"singleKey"} ),
        singleKey: new FluentPattern<{ keyLabel: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_keyboard_helpPatterns_singleKey', _.get( SceneryPhetStrings, 'a11y.keyboard.helpPatterns.singleKeyStringProperty' ), [{"name":"keyLabel"}] ),
        multipleKeys: new FluentPattern<{ keyLabels: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_keyboard_helpPatterns_multipleKeys', _.get( SceneryPhetStrings, 'a11y.keyboard.helpPatterns.multipleKeysStringProperty' ), [{"name":"keyLabels"}] ),
        _comment_5: new FluentComment( {"comment":"Lists of items - when there are two items there is no comma in english.","associatedKey":"twoItemList"} ),
        twoItemList: new FluentPattern<{ first: FluentVariable, second: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_keyboard_helpPatterns_twoItemList', _.get( SceneryPhetStrings, 'a11y.keyboard.helpPatterns.twoItemListStringProperty' ), [{"name":"first"},{"name":"second"}] ),
        _comment_6: new FluentComment( {"comment":"Lists of items - when there are 3+, items is the joined prefix list, last is the final item.","associatedKey":"serialList"} ),
        serialList: new FluentPattern<{ items: FluentVariable, last: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_keyboard_helpPatterns_serialList', _.get( SceneryPhetStrings, 'a11y.keyboard.helpPatterns.serialListStringProperty' ), [{"name":"items"},{"name":"last"}] ),
        _comment_7: new FluentComment( {"comment":"Punctuation for lists of keys so they can be combined into a format like: 'A, B, C, D'","associatedKey":"commaSpace"} ),
        commaSpaceStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboard_helpPatterns_commaSpace', _.get( SceneryPhetStrings, 'a11y.keyboard.helpPatterns.commaSpaceStringProperty' ) ),
        _comment_8: new FluentComment( {"comment":"For combining arbitrary items with 'plus' in between.","associatedKey":"spacePlusSpace"} ),
        spacePlusSpaceStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboard_helpPatterns_spacePlusSpace', _.get( SceneryPhetStrings, 'a11y.keyboard.helpPatterns.spacePlusSpaceStringProperty' ) )
      },
      key: {
        leftArrowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboard_key_leftArrow', _.get( SceneryPhetStrings, 'a11y.keyboard.key.leftArrowStringProperty' ) ),
        rightArrowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboard_key_rightArrow', _.get( SceneryPhetStrings, 'a11y.keyboard.key.rightArrowStringProperty' ) ),
        upArrowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboard_key_upArrow', _.get( SceneryPhetStrings, 'a11y.keyboard.key.upArrowStringProperty' ) ),
        downArrowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboard_key_downArrow', _.get( SceneryPhetStrings, 'a11y.keyboard.key.downArrowStringProperty' ) ),
        pageUpStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboard_key_pageUp', _.get( SceneryPhetStrings, 'a11y.keyboard.key.pageUpStringProperty' ) ),
        pageDownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboard_key_pageDown', _.get( SceneryPhetStrings, 'a11y.keyboard.key.pageDownStringProperty' ) ),
        escapeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboard_key_escape', _.get( SceneryPhetStrings, 'a11y.keyboard.key.escapeStringProperty' ) ),
        controlStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboard_key_control', _.get( SceneryPhetStrings, 'a11y.keyboard.key.controlStringProperty' ) )
      }
    },
    keySets: {
      arrowOrWASDStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keySets_arrowOrWASD', _.get( SceneryPhetStrings, 'a11y.keySets.arrowOrWASDStringProperty' ) ),
      arrowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keySets_arrow', _.get( SceneryPhetStrings, 'a11y.keySets.arrowStringProperty' ) ),
      leftRightOrUpDownArrowsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keySets_leftRightOrUpDownArrows', _.get( SceneryPhetStrings, 'a11y.keySets.leftRightOrUpDownArrowsStringProperty' ) ),
      leftRightArrowsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keySets_leftRightArrows', _.get( SceneryPhetStrings, 'a11y.keySets.leftRightArrowsStringProperty' ) ),
      leftOrRightArrowsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keySets_leftOrRightArrows', _.get( SceneryPhetStrings, 'a11y.keySets.leftOrRightArrowsStringProperty' ) ),
      upDownArrowsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keySets_upDownArrows', _.get( SceneryPhetStrings, 'a11y.keySets.upDownArrowsStringProperty' ) ),
      upOrDownArrowsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keySets_upOrDownArrows', _.get( SceneryPhetStrings, 'a11y.keySets.upOrDownArrowsStringProperty' ) ),
      wasdStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keySets_wasd', _.get( SceneryPhetStrings, 'a11y.keySets.wasdStringProperty' ) ),
      adStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keySets_ad', _.get( SceneryPhetStrings, 'a11y.keySets.adStringProperty' ) ),
      wsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keySets_ws', _.get( SceneryPhetStrings, 'a11y.keySets.wsStringProperty' ) ),
      leftRightOrADStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keySets_leftRightOrAD', _.get( SceneryPhetStrings, 'a11y.keySets.leftRightOrADStringProperty' ) ),
      upDownOrWSStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keySets_upDownOrWS', _.get( SceneryPhetStrings, 'a11y.keySets.upDownOrWSStringProperty' ) )
    },
    eraserButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraserButton_accessibleName', _.get( SceneryPhetStrings, 'a11y.eraserButton.accessibleNameStringProperty' ) )
    },
    timerToggleButton: {
      accessibleNameOnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timerToggleButton_accessibleNameOn', _.get( SceneryPhetStrings, 'a11y.timerToggleButton.accessibleNameOnStringProperty' ) ),
      accessibleNameOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timerToggleButton_accessibleNameOff', _.get( SceneryPhetStrings, 'a11y.timerToggleButton.accessibleNameOffStringProperty' ) )
    },
    playControlButton: {
      playStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playControlButton_play', _.get( SceneryPhetStrings, 'a11y.playControlButton.playStringProperty' ) ),
      pauseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playControlButton_pause', _.get( SceneryPhetStrings, 'a11y.playControlButton.pauseStringProperty' ) ),
      stopStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playControlButton_stop', _.get( SceneryPhetStrings, 'a11y.playControlButton.stopStringProperty' ) )
    },
    playPauseButton: {
      playingAccessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playPauseButton_playingAccessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.playPauseButton.playingAccessibleContextResponseStringProperty' ) ),
      pausedAccessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playPauseButton_pausedAccessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.playPauseButton.pausedAccessibleContextResponseStringProperty' ) )
    },
    stepBackwardButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepBackwardButton_accessibleName', _.get( SceneryPhetStrings, 'a11y.stepBackwardButton.accessibleNameStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepBackwardButton_accessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.stepBackwardButton.accessibleContextResponseStringProperty' ) )
    },
    stepForwardButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepForwardButton_accessibleName', _.get( SceneryPhetStrings, 'a11y.stepForwardButton.accessibleNameStringProperty' ) ),
      accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepForwardButton_accessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.stepForwardButton.accessibleContextResponseStringProperty' ) )
    },
    stepButton: {
      playingDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepButton_playingDescription', _.get( SceneryPhetStrings, 'a11y.stepButton.playingDescriptionStringProperty' ) ),
      pausedDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepButton_pausedDescription', _.get( SceneryPhetStrings, 'a11y.stepButton.pausedDescriptionStringProperty' ) )
    },
    timeControlNode: {
      simSpeedDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControlNode_simSpeedDescription', _.get( SceneryPhetStrings, 'a11y.timeControlNode.simSpeedDescriptionStringProperty' ) ),
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControlNode_accessibleHeading', _.get( SceneryPhetStrings, 'a11y.timeControlNode.accessibleHeadingStringProperty' ) ),
      simSpeedsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControlNode_simSpeeds', _.get( SceneryPhetStrings, 'a11y.timeControlNode.simSpeedsStringProperty' ) )
    },
    playPauseStepButtonGroup: {
      playingHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playPauseStepButtonGroup_playingHelpText', _.get( SceneryPhetStrings, 'a11y.playPauseStepButtonGroup.playingHelpTextStringProperty' ) ),
      pausedHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playPauseStepButtonGroup_pausedHelpText', _.get( SceneryPhetStrings, 'a11y.playPauseStepButtonGroup.pausedHelpTextStringProperty' ) )
    },
    restartButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_restartButton_accessibleName', _.get( SceneryPhetStrings, 'a11y.restartButton.accessibleNameStringProperty' ) )
    },
    movementAlerter: {
      downStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_down', _.get( SceneryPhetStrings, 'a11y.movementAlerter.downStringProperty' ) ),
      leftStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_left', _.get( SceneryPhetStrings, 'a11y.movementAlerter.leftStringProperty' ) ),
      rightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_right', _.get( SceneryPhetStrings, 'a11y.movementAlerter.rightStringProperty' ) ),
      upStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_up', _.get( SceneryPhetStrings, 'a11y.movementAlerter.upStringProperty' ) ),
      upAndToTheRightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_upAndToTheRight', _.get( SceneryPhetStrings, 'a11y.movementAlerter.upAndToTheRightStringProperty' ) ),
      upAndToTheLeftStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_upAndToTheLeft', _.get( SceneryPhetStrings, 'a11y.movementAlerter.upAndToTheLeftStringProperty' ) ),
      downAndToTheRightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_downAndToTheRight', _.get( SceneryPhetStrings, 'a11y.movementAlerter.downAndToTheRightStringProperty' ) ),
      downAndToTheLeftStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_downAndToTheLeft', _.get( SceneryPhetStrings, 'a11y.movementAlerter.downAndToTheLeftStringProperty' ) ),
      leftBorderAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_leftBorderAlert', _.get( SceneryPhetStrings, 'a11y.movementAlerter.leftBorderAlertStringProperty' ) ),
      rightBorderAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_rightBorderAlert', _.get( SceneryPhetStrings, 'a11y.movementAlerter.rightBorderAlertStringProperty' ) ),
      topBorderAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_topBorderAlert', _.get( SceneryPhetStrings, 'a11y.movementAlerter.topBorderAlertStringProperty' ) ),
      bottomBorderAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_movementAlerter_bottomBorderAlert', _.get( SceneryPhetStrings, 'a11y.movementAlerter.bottomBorderAlertStringProperty' ) )
    },
    grabDrag: {
      grabPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.grabDrag.grabPatternStringProperty' ),
      movableStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_grabDrag_movable', _.get( SceneryPhetStrings, 'a11y.grabDrag.movableStringProperty' ) ),
      buttonStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_grabDrag_button', _.get( SceneryPhetStrings, 'a11y.grabDrag.buttonStringProperty' ) ),
      defaultObjectToGrabStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_grabDrag_defaultObjectToGrab', _.get( SceneryPhetStrings, 'a11y.grabDrag.defaultObjectToGrabStringProperty' ) ),
      releasedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_grabDrag_released', _.get( SceneryPhetStrings, 'a11y.grabDrag.releasedStringProperty' ) ),
      grabbedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_grabDrag_grabbed', _.get( SceneryPhetStrings, 'a11y.grabDrag.grabbedStringProperty' ) ),
      gestureHelpTextPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.grabDrag.gestureHelpTextPatternStringProperty' ),
      spaceToGrabOrReleaseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_grabDrag_spaceToGrabOrRelease', _.get( SceneryPhetStrings, 'a11y.grabDrag.spaceToGrabOrReleaseStringProperty' ) )
    },
    groupSort: {
      sortableStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_groupSort_sortable', _.get( SceneryPhetStrings, 'a11y.groupSort.sortableStringProperty' ) ),
      navigableStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_groupSort_navigable', _.get( SceneryPhetStrings, 'a11y.groupSort.navigableStringProperty' ) ),
      grabbedAccessibleObjectResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_groupSort_grabbedAccessibleObjectResponse', _.get( SceneryPhetStrings, 'a11y.groupSort.grabbedAccessibleObjectResponseStringProperty' ) ),
      releasedAccessibleObjectResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_groupSort_releasedAccessibleObjectResponse', _.get( SceneryPhetStrings, 'a11y.groupSort.releasedAccessibleObjectResponseStringProperty' ) )
    },
    listItemPunctuation: {
      semicolonPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.listItemPunctuation.semicolonPatternStringProperty' ),
      commaPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.listItemPunctuation.commaPatternStringProperty' ),
      periodPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.listItemPunctuation.periodPatternStringProperty' )
    },
    voicing: {
      simSection: {
        screenSummary: {
          singleScreenIntroPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.voicing.simSection.screenSummary.singleScreenIntroPatternStringProperty' )
        }
      },
      grabDragHintPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.voicing.grabDragHintPatternStringProperty' ),
      grabbedAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voicing_grabbedAlert', _.get( SceneryPhetStrings, 'a11y.voicing.grabbedAlertStringProperty' ) ),
      draggableAlertStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voicing_draggableAlert', _.get( SceneryPhetStrings, 'a11y.voicing.draggableAlertStringProperty' ) )
    },
    closeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_close', _.get( SceneryPhetStrings, 'a11y.closeStringProperty' ) ),
    zoomInStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_zoomIn', _.get( SceneryPhetStrings, 'a11y.zoomInStringProperty' ) ),
    zoomOutStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_zoomOut', _.get( SceneryPhetStrings, 'a11y.zoomOutStringProperty' ) ),
    measuringTapeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_measuringTape', _.get( SceneryPhetStrings, 'a11y.measuringTapeStringProperty' ) ),
    measuringTapeTipStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_measuringTapeTip', _.get( SceneryPhetStrings, 'a11y.measuringTapeTipStringProperty' ) ),
    infoStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_info', _.get( SceneryPhetStrings, 'a11y.infoStringProperty' ) ),
    offScaleIndicator: {
      pointsOffScaleUpStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_offScaleIndicator_pointsOffScaleUp', _.get( SceneryPhetStrings, 'a11y.offScaleIndicator.pointsOffScaleUpStringProperty' ) ),
      pointsOffScaleDownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_offScaleIndicator_pointsOffScaleDown', _.get( SceneryPhetStrings, 'a11y.offScaleIndicator.pointsOffScaleDownStringProperty' ) ),
      pointsOffScaleLeftStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_offScaleIndicator_pointsOffScaleLeft', _.get( SceneryPhetStrings, 'a11y.offScaleIndicator.pointsOffScaleLeftStringProperty' ) ),
      pointsOffScaleRightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_offScaleIndicator_pointsOffScaleRight', _.get( SceneryPhetStrings, 'a11y.offScaleIndicator.pointsOffScaleRightStringProperty' ) )
    },
    stopwatch: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_accessibleName', _.get( SceneryPhetStrings, 'a11y.stopwatch.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_accessibleHelpText', _.get( SceneryPhetStrings, 'a11y.stopwatch.accessibleHelpTextStringProperty' ) ),
      units: {
        seconds: {
          secondsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_units_seconds_seconds', _.get( SceneryPhetStrings, 'a11y.stopwatch.units.seconds.secondsStringProperty' ) ),
          pattern: new FluentPattern<{ seconds: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_stopwatch_units_seconds_pattern', _.get( SceneryPhetStrings, 'a11y.stopwatch.units.seconds.patternStringProperty' ), [{"name":"seconds"}] )
        },
        minutesAndSeconds: {
          pattern: new FluentPattern<{ minutes: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'>, seconds: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_stopwatch_units_minutesAndSeconds_pattern', _.get( SceneryPhetStrings, 'a11y.stopwatch.units.minutesAndSeconds.patternStringProperty' ), [{"name":"minutes","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]},{"name":"seconds"}] )
        },
        valueUnits: {
          pattern: new FluentPattern<{ units: FluentVariable, value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_stopwatch_units_valueUnits_pattern', _.get( SceneryPhetStrings, 'a11y.stopwatch.units.valueUnits.patternStringProperty' ), [{"name":"units"},{"name":"value"}] )
        }
      },
      resetButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_resetButton_accessibleName', _.get( SceneryPhetStrings, 'a11y.stopwatch.resetButton.accessibleNameStringProperty' ) ),
        accessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_resetButton_accessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.stopwatch.resetButton.accessibleContextResponseStringProperty' ) )
      },
      playButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_playButton_accessibleName', _.get( SceneryPhetStrings, 'a11y.stopwatch.playButton.accessibleNameStringProperty' ) )
      },
      pauseButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_pauseButton_accessibleName', _.get( SceneryPhetStrings, 'a11y.stopwatch.pauseButton.accessibleNameStringProperty' ) )
      }
    },
    negativeNumber: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_negativeNumber', _.get( SceneryPhetStrings, 'a11y.negativeNumberStringProperty' ), [{"name":"value"}] ),
    scientificNotation: new FluentPattern<{ base: FluentVariable, exponent: FluentVariable, value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_scientificNotation', _.get( SceneryPhetStrings, 'a11y.scientificNotationStringProperty' ), [{"name":"base"},{"name":"exponent"},{"name":"value"}] ),
    units: {
      centimeters: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_centimeters_pattern', _.get( SceneryPhetStrings, 'a11y.units.centimeters.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      centimetersSquared: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_centimetersSquared_pattern', _.get( SceneryPhetStrings, 'a11y.units.centimetersSquared.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      hertz: {
        pattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_hertz_pattern', _.get( SceneryPhetStrings, 'a11y.units.hertz.patternStringProperty' ), [{"name":"value"}] )
      },
      percent: {
        pattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_percent_pattern', _.get( SceneryPhetStrings, 'a11y.units.percent.patternStringProperty' ), [{"name":"value"}] )
      },
      seconds: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_seconds_pattern', _.get( SceneryPhetStrings, 'a11y.units.seconds.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      kilopascals: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_kilopascals_pattern', _.get( SceneryPhetStrings, 'a11y.units.kilopascals.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      amperes: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_amperes_pattern', _.get( SceneryPhetStrings, 'a11y.units.amperes.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      volts: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_volts_pattern', _.get( SceneryPhetStrings, 'a11y.units.volts.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      newtons: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_newtons_pattern', _.get( SceneryPhetStrings, 'a11y.units.newtons.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      watts: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_watts_pattern', _.get( SceneryPhetStrings, 'a11y.units.watts.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      joules: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_joules_pattern', _.get( SceneryPhetStrings, 'a11y.units.joules.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      kelvin: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_kelvin_pattern', _.get( SceneryPhetStrings, 'a11y.units.kelvin.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      degrees: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_degrees_pattern', _.get( SceneryPhetStrings, 'a11y.units.degrees.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      degreesCelsius: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_degreesCelsius_pattern', _.get( SceneryPhetStrings, 'a11y.units.degreesCelsius.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      degreesFahrenheit: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_degreesFahrenheit_pattern', _.get( SceneryPhetStrings, 'a11y.units.degreesFahrenheit.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      liters: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_liters_pattern', _.get( SceneryPhetStrings, 'a11y.units.liters.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      litersPerSecond: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_litersPerSecond_pattern', _.get( SceneryPhetStrings, 'a11y.units.litersPerSecond.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      meters: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_meters_pattern', _.get( SceneryPhetStrings, 'a11y.units.meters.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      metersPerSecond: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_metersPerSecond_pattern', _.get( SceneryPhetStrings, 'a11y.units.metersPerSecond.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      metersPerSecondSquared: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_metersPerSecondSquared_pattern', _.get( SceneryPhetStrings, 'a11y.units.metersPerSecondSquared.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      metersPerSecondPerSecond: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_metersPerSecondPerSecond_pattern', _.get( SceneryPhetStrings, 'a11y.units.metersPerSecondPerSecond.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      grams: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_grams_pattern', _.get( SceneryPhetStrings, 'a11y.units.grams.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      kilograms: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_kilograms_pattern', _.get( SceneryPhetStrings, 'a11y.units.kilograms.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      kilogramsPerLiter: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_kilogramsPerLiter_pattern', _.get( SceneryPhetStrings, 'a11y.units.kilogramsPerLiter.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      kilogramsPerCubicMeter: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_kilogramsPerCubicMeter_pattern', _.get( SceneryPhetStrings, 'a11y.units.kilogramsPerCubicMeter.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      nanometers: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_nanometers_pattern', _.get( SceneryPhetStrings, 'a11y.units.nanometers.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      nanometersPerPicosecond: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_nanometersPerPicosecond_pattern', _.get( SceneryPhetStrings, 'a11y.units.nanometersPerPicosecond.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      kilometersPerSecond: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_kilometersPerSecond_pattern', _.get( SceneryPhetStrings, 'a11y.units.kilometersPerSecond.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      picometers: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_picometers_pattern', _.get( SceneryPhetStrings, 'a11y.units.picometers.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      picometersPerSecond: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_picometersPerSecond_pattern', _.get( SceneryPhetStrings, 'a11y.units.picometersPerSecond.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      picometersPerSecondSquared: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_picometersPerSecondSquared_pattern', _.get( SceneryPhetStrings, 'a11y.units.picometersPerSecondSquared.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      nanoseconds: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_nanoseconds_pattern', _.get( SceneryPhetStrings, 'a11y.units.nanoseconds.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      picoseconds: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_picoseconds_pattern', _.get( SceneryPhetStrings, 'a11y.units.picoseconds.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      molarAbsorptivity: {
        pattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_molarAbsorptivity_pattern', _.get( SceneryPhetStrings, 'a11y.units.molarAbsorptivity.patternStringProperty' ), [{"name":"value"}] )
      },
      ohms: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_ohms_pattern', _.get( SceneryPhetStrings, 'a11y.units.ohms.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      ohmCentimeters: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_ohmCentimeters_pattern', _.get( SceneryPhetStrings, 'a11y.units.ohmCentimeters.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      millivolts: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_millivolts_pattern', _.get( SceneryPhetStrings, 'a11y.units.millivolts.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      milliamperes: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_milliamperes_pattern', _.get( SceneryPhetStrings, 'a11y.units.milliamperes.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      farads: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_farads_pattern', _.get( SceneryPhetStrings, 'a11y.units.farads.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      webers: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_webers_pattern', _.get( SceneryPhetStrings, 'a11y.units.webers.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      gauss: {
        pattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_gauss_pattern', _.get( SceneryPhetStrings, 'a11y.units.gauss.patternStringProperty' ), [{"name":"value"}] )
      },
      pascalSeconds: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_pascalSeconds_pattern', _.get( SceneryPhetStrings, 'a11y.units.pascalSeconds.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      newtonsPerMeter: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_newtonsPerMeter_pattern', _.get( SceneryPhetStrings, 'a11y.units.newtonsPerMeter.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      newtonSecondsPerMeter: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_newtonSecondsPerMeter_pattern', _.get( SceneryPhetStrings, 'a11y.units.newtonSecondsPerMeter.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      moles: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_moles_pattern', _.get( SceneryPhetStrings, 'a11y.units.moles.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      molesPerSecond: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_molesPerSecond_pattern', _.get( SceneryPhetStrings, 'a11y.units.molesPerSecond.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      molar: {
        pattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_molar_pattern', _.get( SceneryPhetStrings, 'a11y.units.molar.patternStringProperty' ), [{"name":"value"}] )
      },
      molesPerLiter: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_molesPerLiter_pattern', _.get( SceneryPhetStrings, 'a11y.units.molesPerLiter.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      radians: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_radians_pattern', _.get( SceneryPhetStrings, 'a11y.units.radians.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      radiansPerSecond: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_radiansPerSecond_pattern', _.get( SceneryPhetStrings, 'a11y.units.radiansPerSecond.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      radiansPerSecondSquared: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_radiansPerSecondSquared_pattern', _.get( SceneryPhetStrings, 'a11y.units.radiansPerSecondSquared.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      years: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_years_pattern', _.get( SceneryPhetStrings, 'a11y.units.years.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      astronomicalUnits: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_astronomicalUnits_pattern', _.get( SceneryPhetStrings, 'a11y.units.astronomicalUnits.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      astronomicalUnitsSquared: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_astronomicalUnitsSquared_pattern', _.get( SceneryPhetStrings, 'a11y.units.astronomicalUnitsSquared.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      viewCoordinatesPerSecond: {
        pattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_viewCoordinatesPerSecond_pattern', _.get( SceneryPhetStrings, 'a11y.units.viewCoordinatesPerSecond.patternStringProperty' ), [{"name":"value"}] )
      },
      atomicMassUnits: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_atomicMassUnits_pattern', _.get( SceneryPhetStrings, 'a11y.units.atomicMassUnits.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      coulombs: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_coulombs_pattern', _.get( SceneryPhetStrings, 'a11y.units.coulombs.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      cubicMeters: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_cubicMeters_pattern', _.get( SceneryPhetStrings, 'a11y.units.cubicMeters.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      cubicPicometers: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_cubicPicometers_pattern', _.get( SceneryPhetStrings, 'a11y.units.cubicPicometers.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      electronVolt: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_electronVolt_pattern', _.get( SceneryPhetStrings, 'a11y.units.electronVolt.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      millimeters: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_millimeters_pattern', _.get( SceneryPhetStrings, 'a11y.units.millimeters.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      particlesPerPicosecond: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_particlesPerPicosecond_pattern', _.get( SceneryPhetStrings, 'a11y.units.particlesPerPicosecond.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      revolutionsPerMinute: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_revolutionsPerMinute_pattern', _.get( SceneryPhetStrings, 'a11y.units.revolutionsPerMinute.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      atmospheres: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_atmospheres_pattern', _.get( SceneryPhetStrings, 'a11y.units.atmospheres.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      kilogramMetersPerSecond: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_kilogramMetersPerSecond_pattern', _.get( SceneryPhetStrings, 'a11y.units.kilogramMetersPerSecond.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      },
      picometersPerPicosecond: {
        pattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_picometersPerPicosecond_pattern', _.get( SceneryPhetStrings, 'a11y.units.picometersPerPicosecond.patternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
      }
    }
  }
};

export default SceneryPhetFluent;

sceneryPhet.register('SceneryPhetFluent', SceneryPhetFluent);
