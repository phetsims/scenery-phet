// Copyright 2025, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from scenery-phet-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import type { FluentVariable } from '../../chipper/js/browser/FluentPattern.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentComment from '../../chipper/js/browser/FluentComment.js';
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
addToMapIfDefined( 'key_k', 'key.kStringProperty' );
addToMapIfDefined( 'key_l', 'key.lStringProperty' );
addToMapIfDefined( 'key_capsLock', 'key.capsLockStringProperty' );
addToMapIfDefined( 'key_enter', 'key.enterStringProperty' );
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
addToMapIfDefined( 'key_c', 'key.cStringProperty' );
addToMapIfDefined( 'key_d', 'key.dStringProperty' );
addToMapIfDefined( 'key_r', 'key.rStringProperty' );
addToMapIfDefined( 'key_s', 'key.sStringProperty' );
addToMapIfDefined( 'key_w', 'key.wStringProperty' );
addToMapIfDefined( 'key_one', 'key.oneStringProperty' );
addToMapIfDefined( 'key_two', 'key.twoStringProperty' );
addToMapIfDefined( 'key_three', 'key.threeStringProperty' );
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
addToMapIfDefined( 'speed_normal', 'speed.normalStringProperty' );
addToMapIfDefined( 'speed_slow', 'speed.slowStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_faucetControls', 'keyboardHelpDialog.faucetControls.faucetControlsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_adjustFaucetFlow', 'keyboardHelpDialog.faucetControls.adjustFaucetFlowStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_adjustInSmallerSteps', 'keyboardHelpDialog.faucetControls.adjustInSmallerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_adjustInLargerSteps', 'keyboardHelpDialog.faucetControls.adjustInLargerStepsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_closeFaucet', 'keyboardHelpDialog.faucetControls.closeFaucetStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_openFaucetFully', 'keyboardHelpDialog.faucetControls.openFaucetFullyStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_faucetControls_openFaucetBriefly', 'keyboardHelpDialog.faucetControls.openFaucetBrieflyStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_timingControls_timingControls', 'keyboardHelpDialog.timingControls.timingControlsStringProperty' );
addToMapIfDefined( 'keyboardHelpDialog_timingControls_pauseOrPlayAction', 'keyboardHelpDialog.timingControls.pauseOrPlayActionStringProperty' );
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
addToMapIfDefined( 'units_centimeters', 'units.centimetersStringProperty' );
addToMapIfDefined( 'units_centimetersSquared', 'units.centimetersSquaredStringProperty' );
addToMapIfDefined( 'units_hertz', 'units.hertzStringProperty' );
addToMapIfDefined( 'units_percent', 'units.percentStringProperty' );
addToMapIfDefined( 'units_seconds', 'units.secondsStringProperty' );
addToMapIfDefined( 'a11y_simSection_screenSummary_keyboardShortcutsHint', 'a11y.simSection.screenSummary.keyboardShortcutsHintStringProperty' );
addToMapIfDefined( 'a11y_simSection_playArea', 'a11y.simSection.playAreaStringProperty' );
addToMapIfDefined( 'a11y_simSection_controlArea', 'a11y.simSection.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_resetAll_accessibleName', 'a11y.resetAll.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_resetAll_accessibleContextResponse', 'a11y.resetAll.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_soundToggle_label', 'a11y.soundToggle.labelStringProperty' );
addToMapIfDefined( 'a11y_soundToggle_alert_simSoundOn', 'a11y.soundToggle.alert.simSoundOnStringProperty' );
addToMapIfDefined( 'a11y_soundToggle_alert_simSoundOff', 'a11y.soundToggle.alert.simSoundOffStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_slider_leftRightArrowKeys', 'a11y.keyboardHelpDialog.slider.leftRightArrowKeysStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_slider_upDownArrowKeys', 'a11y.keyboardHelpDialog.slider.upDownArrowKeysStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_slider_shiftLeftRightArrowKeys', 'a11y.keyboardHelpDialog.slider.shiftLeftRightArrowKeysStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_slider_shiftUpDownArrowKeys', 'a11y.keyboardHelpDialog.slider.shiftUpDownArrowKeysStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_tabDescription', 'a11y.keyboardHelpDialog.general.tabDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_shiftTabDescription', 'a11y.keyboardHelpDialog.general.shiftTabDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_tabGroupDescription', 'a11y.keyboardHelpDialog.general.tabGroupDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_shiftTabGroupDescription', 'a11y.keyboardHelpDialog.general.shiftTabGroupDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_pressButtonsDescription', 'a11y.keyboardHelpDialog.general.pressButtonsDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_groupNavigationDescription', 'a11y.keyboardHelpDialog.general.groupNavigationDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_setValuesInKeypadDescription', 'a11y.keyboardHelpDialog.general.setValuesInKeypadDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_exitDialogDescription', 'a11y.keyboardHelpDialog.general.exitDialogDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_general_toggleCheckboxesDescription', 'a11y.keyboardHelpDialog.general.toggleCheckboxesDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_comboBox_closeWithoutChangingDescription', 'a11y.keyboardHelpDialog.comboBox.closeWithoutChangingDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_draggableItems_moveDescription', 'a11y.keyboardHelpDialog.draggableItems.moveDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_draggableItems_moveSlowerDescription', 'a11y.keyboardHelpDialog.draggableItems.moveSlowerDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_timingControls_pauseOrPlayActionDescription', 'a11y.keyboardHelpDialog.timingControls.pauseOrPlayActionDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_adjustFaucetFlowDescription', 'a11y.keyboardHelpDialog.faucetControls.adjustFaucetFlowDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_adjustInSmallerStepsDescription', 'a11y.keyboardHelpDialog.faucetControls.adjustInSmallerStepsDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_adjustInLargerStepsDescription', 'a11y.keyboardHelpDialog.faucetControls.adjustInLargerStepsDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_closeFaucetDescription', 'a11y.keyboardHelpDialog.faucetControls.closeFaucetDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_openFaucetFullyDescription', 'a11y.keyboardHelpDialog.faucetControls.openFaucetFullyDescriptionStringProperty' );
addToMapIfDefined( 'a11y_keyboardHelpDialog_faucetControls_openFaucetBrieflyDescription', 'a11y.keyboardHelpDialog.faucetControls.openFaucetBrieflyDescriptionStringProperty' );
addToMapIfDefined( 'a11y_eraserButton_accessibleName', 'a11y.eraserButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_playControlButton_play', 'a11y.playControlButton.playStringProperty' );
addToMapIfDefined( 'a11y_playControlButton_pause', 'a11y.playControlButton.pauseStringProperty' );
addToMapIfDefined( 'a11y_playControlButton_stop', 'a11y.playControlButton.stopStringProperty' );
addToMapIfDefined( 'a11y_playPauseButton_playingAccessibleContextResponse', 'a11y.playPauseButton.playingAccessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_playPauseButton_pausedAccessibleContextResponse', 'a11y.playPauseButton.pausedAccessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_stepButton_stepForward', 'a11y.stepButton.stepForwardStringProperty' );
addToMapIfDefined( 'a11y_stepButton_playingDescription', 'a11y.stepButton.playingDescriptionStringProperty' );
addToMapIfDefined( 'a11y_stepButton_pausedDescription', 'a11y.stepButton.pausedDescriptionStringProperty' );
addToMapIfDefined( 'a11y_timeControlNode_simSpeedDescription', 'a11y.timeControlNode.simSpeedDescriptionStringProperty' );
addToMapIfDefined( 'a11y_timeControlNode_label', 'a11y.timeControlNode.labelStringProperty' );
addToMapIfDefined( 'a11y_timeControlNode_simSpeeds', 'a11y.timeControlNode.simSpeedsStringProperty' );
addToMapIfDefined( 'a11y_playPauseStepButtonGroup_playingHelpText', 'a11y.playPauseStepButtonGroup.playingHelpTextStringProperty' );
addToMapIfDefined( 'a11y_playPauseStepButtonGroup_pausedHelpText', 'a11y.playPauseStepButtonGroup.pausedHelpTextStringProperty' );
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
addToMapIfDefined( 'a11y_groupSort_grabbedAccessibleContextResponse', 'a11y.groupSort.grabbedAccessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_groupSort_releasedAccessibleContextResponse', 'a11y.groupSort.releasedAccessibleContextResponseStringProperty' );
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
addToMapIfDefined( 'a11y_stopwatch_resetButton_accessibleName', 'a11y.stopwatch.resetButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_resetButton_accessibleContextResponse', 'a11y.stopwatch.resetButton.accessibleContextResponseStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_playButton_accessibleName', 'a11y.stopwatch.playButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_pauseButton_accessibleName', 'a11y.stopwatch.pauseButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_negativeNumber', 'a11y.negativeNumberStringProperty' );
addToMapIfDefined( 'a11y_scientificNotation', 'a11y.scientificNotationStringProperty' );
addToMapIfDefined( 'a11y_units_centimetersPattern', 'a11y.units.centimetersPatternStringProperty' );
addToMapIfDefined( 'a11y_units_centimetersSquaredPattern', 'a11y.units.centimetersSquaredPatternStringProperty' );
addToMapIfDefined( 'a11y_units_hertzPattern', 'a11y.units.hertzPatternStringProperty' );
addToMapIfDefined( 'a11y_units_percentPattern', 'a11y.units.percentPatternStringProperty' );
addToMapIfDefined( 'a11y_units_secondsPattern', 'a11y.units.secondsPatternStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${stringProperty.value}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const SceneryPhetFluent = {
  "scenery-phet": {
    titleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'scenery_phet_title', _.get( SceneryPhetStrings, 'scenery-phet.titleStringProperty' ) )
  },
  screen: {
    buttonsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_buttons', _.get( SceneryPhetStrings, 'screen.buttonsStringProperty' ) ),
    componentsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_components', _.get( SceneryPhetStrings, 'screen.componentsStringProperty' ) ),
    dialogsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_dialogs', _.get( SceneryPhetStrings, 'screen.dialogsStringProperty' ) ),
    keyboardStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_keyboard', _.get( SceneryPhetStrings, 'screen.keyboardStringProperty' ) ),
    slidersStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_sliders', _.get( SceneryPhetStrings, 'screen.slidersStringProperty' ) ),
    spinnersStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'screen_spinners', _.get( SceneryPhetStrings, 'screen.spinnersStringProperty' ) )
  },
  WavelengthSlider: {
    pattern_0wavelength_1unitsStringProperty: _.get( SceneryPhetStrings, 'WavelengthSlider.pattern_0wavelength_1unitsStringProperty' )
  },
  frequencyUnitsPatternStringProperty: _.get( SceneryPhetStrings, 'frequencyUnitsPatternStringProperty' ),
  stopwatchValueUnitsPatternStringProperty: _.get( SceneryPhetStrings, 'stopwatchValueUnitsPatternStringProperty' ),
  units_nmStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'units_nm', _.get( SceneryPhetStrings, 'units_nmStringProperty' ) ),
  shortCircuitStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'shortCircuit', _.get( SceneryPhetStrings, 'shortCircuitStringProperty' ) ),
  heatStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'heat', _.get( SceneryPhetStrings, 'heatStringProperty' ) ),
  coolStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'cool', _.get( SceneryPhetStrings, 'coolStringProperty' ) ),
  key: {
    tabStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_tab', _.get( SceneryPhetStrings, 'key.tabStringProperty' ) ),
    shiftStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_shift', _.get( SceneryPhetStrings, 'key.shiftStringProperty' ) ),
    altStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_alt', _.get( SceneryPhetStrings, 'key.altStringProperty' ) ),
    optionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_option', _.get( SceneryPhetStrings, 'key.optionStringProperty' ) ),
    kStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_k', _.get( SceneryPhetStrings, 'key.kStringProperty' ) ),
    lStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_l', _.get( SceneryPhetStrings, 'key.lStringProperty' ) ),
    capsLockStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_capsLock', _.get( SceneryPhetStrings, 'key.capsLockStringProperty' ) ),
    enterStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_enter', _.get( SceneryPhetStrings, 'key.enterStringProperty' ) ),
    backspaceStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_backspace', _.get( SceneryPhetStrings, 'key.backspaceStringProperty' ) ),
    deleteStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_delete', _.get( SceneryPhetStrings, 'key.deleteStringProperty' ) ),
    spaceStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_space', _.get( SceneryPhetStrings, 'key.spaceStringProperty' ) ),
    escStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_esc', _.get( SceneryPhetStrings, 'key.escStringProperty' ) ),
    fnStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_fn', _.get( SceneryPhetStrings, 'key.fnStringProperty' ) ),
    pageUpStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_pageUp', _.get( SceneryPhetStrings, 'key.pageUpStringProperty' ) ),
    pageDownStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_pageDown', _.get( SceneryPhetStrings, 'key.pageDownStringProperty' ) ),
    homeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_home', _.get( SceneryPhetStrings, 'key.homeStringProperty' ) ),
    endStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_end', _.get( SceneryPhetStrings, 'key.endStringProperty' ) ),
    aStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_a', _.get( SceneryPhetStrings, 'key.aStringProperty' ) ),
    cStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_c', _.get( SceneryPhetStrings, 'key.cStringProperty' ) ),
    dStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_d', _.get( SceneryPhetStrings, 'key.dStringProperty' ) ),
    rStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_r', _.get( SceneryPhetStrings, 'key.rStringProperty' ) ),
    sStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_s', _.get( SceneryPhetStrings, 'key.sStringProperty' ) ),
    wStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_w', _.get( SceneryPhetStrings, 'key.wStringProperty' ) ),
    oneStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_one', _.get( SceneryPhetStrings, 'key.oneStringProperty' ) ),
    twoStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_two', _.get( SceneryPhetStrings, 'key.twoStringProperty' ) ),
    threeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_three', _.get( SceneryPhetStrings, 'key.threeStringProperty' ) ),
    toGrabOrReleaseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'key_toGrabOrRelease', _.get( SceneryPhetStrings, 'key.toGrabOrReleaseStringProperty' ) )
  },
  webglWarning: {
    titleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'webglWarning_title', _.get( SceneryPhetStrings, 'webglWarning.titleStringProperty' ) ),
    bodyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'webglWarning_body', _.get( SceneryPhetStrings, 'webglWarning.bodyStringProperty' ) ),
    contextLossFailureStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'webglWarning_contextLossFailure', _.get( SceneryPhetStrings, 'webglWarning.contextLossFailureStringProperty' ) ),
    contextLossReloadStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'webglWarning_contextLossReload', _.get( SceneryPhetStrings, 'webglWarning.contextLossReloadStringProperty' ) ),
    ie11StencilBodyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'webglWarning_ie11StencilBody', _.get( SceneryPhetStrings, 'webglWarning.ie11StencilBodyStringProperty' ) )
  },
  keyboardHelpDialog: {
    sliderControlsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_sliderControls', _.get( SceneryPhetStrings, 'keyboardHelpDialog.sliderControlsStringProperty' ) ),
    adjustSliderStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_adjustSlider', _.get( SceneryPhetStrings, 'keyboardHelpDialog.adjustSliderStringProperty' ) ),
    spinnerControlsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_spinnerControls', _.get( SceneryPhetStrings, 'keyboardHelpDialog.spinnerControlsStringProperty' ) ),
    adjustInSmallerStepsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_adjustInSmallerSteps', _.get( SceneryPhetStrings, 'keyboardHelpDialog.adjustInSmallerStepsStringProperty' ) ),
    adjustInLargerStepsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_adjustInLargerSteps', _.get( SceneryPhetStrings, 'keyboardHelpDialog.adjustInLargerStepsStringProperty' ) ),
    jumpToMinimumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_jumpToMinimum', _.get( SceneryPhetStrings, 'keyboardHelpDialog.jumpToMinimumStringProperty' ) ),
    jumpToMaximumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_jumpToMaximum', _.get( SceneryPhetStrings, 'keyboardHelpDialog.jumpToMaximumStringProperty' ) ),
    adjustStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_adjust', _.get( SceneryPhetStrings, 'keyboardHelpDialog.adjustStringProperty' ) ),
    sliderStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_slider', _.get( SceneryPhetStrings, 'keyboardHelpDialog.sliderStringProperty' ) ),
    spinnerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_spinner', _.get( SceneryPhetStrings, 'keyboardHelpDialog.spinnerStringProperty' ) ),
    heatCoolControlsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_heatCoolControls', _.get( SceneryPhetStrings, 'keyboardHelpDialog.heatCoolControlsStringProperty' ) ),
    maximumHeatStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_maximumHeat', _.get( SceneryPhetStrings, 'keyboardHelpDialog.maximumHeatStringProperty' ) ),
    maximumCoolStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_maximumCool', _.get( SceneryPhetStrings, 'keyboardHelpDialog.maximumCoolStringProperty' ) ),
    heatCoolOffStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_heatCoolOff', _.get( SceneryPhetStrings, 'keyboardHelpDialog.heatCoolOffStringProperty' ) ),
    verbSliderPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.verbSliderPatternStringProperty' ),
    verbInSmallerStepsPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.verbInSmallerStepsPatternStringProperty' ),
    verbInLargerStepsPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.verbInLargerStepsPatternStringProperty' ),
    minimumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_minimum', _.get( SceneryPhetStrings, 'keyboardHelpDialog.minimumStringProperty' ) ),
    maximumStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_maximum', _.get( SceneryPhetStrings, 'keyboardHelpDialog.maximumStringProperty' ) ),
    jumpToMinimumPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.jumpToMinimumPatternStringProperty' ),
    jumpToMaximumPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.jumpToMaximumPatternStringProperty' ),
    generalNavigationStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_generalNavigation', _.get( SceneryPhetStrings, 'keyboardHelpDialog.generalNavigationStringProperty' ) ),
    basicActionsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_basicActions', _.get( SceneryPhetStrings, 'keyboardHelpDialog.basicActionsStringProperty' ) ),
    moveToNextItemStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveToNextItem', _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveToNextItemStringProperty' ) ),
    moveToPreviousItemStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveToPreviousItem', _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveToPreviousItemStringProperty' ) ),
    moveToNextItemOrGroupStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveToNextItemOrGroup', _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveToNextItemOrGroupStringProperty' ) ),
    moveToPreviousItemOrGroupStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveToPreviousItemOrGroup', _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveToPreviousItemOrGroupStringProperty' ) ),
    pressButtonsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_pressButtons', _.get( SceneryPhetStrings, 'keyboardHelpDialog.pressButtonsStringProperty' ) ),
    moveBetweenItemsInAGroupStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveBetweenItemsInAGroup', _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveBetweenItemsInAGroupStringProperty' ) ),
    setValuesInKeypadStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_setValuesInKeypad', _.get( SceneryPhetStrings, 'keyboardHelpDialog.setValuesInKeypadStringProperty' ) ),
    resetAllStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_resetAll', _.get( SceneryPhetStrings, 'keyboardHelpDialog.resetAllStringProperty' ) ),
    exitADialogStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_exitADialog', _.get( SceneryPhetStrings, 'keyboardHelpDialog.exitADialogStringProperty' ) ),
    toggleCheckboxesStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_toggleCheckboxes', _.get( SceneryPhetStrings, 'keyboardHelpDialog.toggleCheckboxesStringProperty' ) ),
    orStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_or', _.get( SceneryPhetStrings, 'keyboardHelpDialog.orStringProperty' ) ),
    hyphenStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_hyphen', _.get( SceneryPhetStrings, 'keyboardHelpDialog.hyphenStringProperty' ) ),
    grabOrReleaseHeadingPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.grabOrReleaseHeadingPatternStringProperty' ),
    grabOrReleaseLabelPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.grabOrReleaseLabelPatternStringProperty' ),
    comboBox: {
      chooseAThingPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.chooseAThingPatternStringProperty' ),
      headingStringStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_comboBox_headingString', _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.headingStringStringProperty' ) ),
      popUpListPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.popUpListPatternStringProperty' ),
      moveThroughPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.moveThroughPatternStringProperty' ),
      chooseNewPatternStringProperty: _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.chooseNewPatternStringProperty' ),
      closeWithoutChangingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_comboBox_closeWithoutChanging', _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.closeWithoutChangingStringProperty' ) ),
      optionsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_comboBox_options', _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.optionsStringProperty' ) ),
      optionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_comboBox_option', _.get( SceneryPhetStrings, 'keyboardHelpDialog.comboBox.optionStringProperty' ) )
    },
    moveDraggableItemsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveDraggableItems', _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveDraggableItemsStringProperty' ) ),
    moveStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_move', _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveStringProperty' ) ),
    moveSlowerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_moveSlower', _.get( SceneryPhetStrings, 'keyboardHelpDialog.moveSlowerStringProperty' ) ),
    faucetControls: {
      faucetControlsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_faucetControls_faucetControls', _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.faucetControlsStringProperty' ) ),
      adjustFaucetFlowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_faucetControls_adjustFaucetFlow', _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.adjustFaucetFlowStringProperty' ) ),
      adjustInSmallerStepsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_faucetControls_adjustInSmallerSteps', _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.adjustInSmallerStepsStringProperty' ) ),
      adjustInLargerStepsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_faucetControls_adjustInLargerSteps', _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.adjustInLargerStepsStringProperty' ) ),
      closeFaucetStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_faucetControls_closeFaucet', _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.closeFaucetStringProperty' ) ),
      openFaucetFullyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_faucetControls_openFaucetFully', _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.openFaucetFullyStringProperty' ) ),
      openFaucetBrieflyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_faucetControls_openFaucetBriefly', _.get( SceneryPhetStrings, 'keyboardHelpDialog.faucetControls.openFaucetBrieflyStringProperty' ) )
    },
    timingControls: {
      timingControlsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_timingControls_timingControls', _.get( SceneryPhetStrings, 'keyboardHelpDialog.timingControls.timingControlsStringProperty' ) ),
      pauseOrPlayActionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'keyboardHelpDialog_timingControls_pauseOrPlayAction', _.get( SceneryPhetStrings, 'keyboardHelpDialog.timingControls.pauseOrPlayActionStringProperty' ) )
    }
  },
  speed: {
    normalStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'speed_normal', _.get( SceneryPhetStrings, 'speed.normalStringProperty' ) ),
    slowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'speed_slow', _.get( SceneryPhetStrings, 'speed.slowStringProperty' ) ),
    fastStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'speed_fast', _.get( SceneryPhetStrings, 'speed.fastStringProperty' ) )
  },
  symbol: {
    ohmsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'symbol_ohms', _.get( SceneryPhetStrings, 'symbol.ohmsStringProperty' ) ),
    resistivityStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'symbol_resistivity', _.get( SceneryPhetStrings, 'symbol.resistivityStringProperty' ) )
  },
  comboBoxDisplay: {
    valueUnitsStringProperty: _.get( SceneryPhetStrings, 'comboBoxDisplay.valueUnitsStringProperty' )
  },
  wavelengthNMValuePatternStringProperty: _.get( SceneryPhetStrings, 'wavelengthNMValuePatternStringProperty' ),
  measuringTapeReadoutPatternStringProperty: _.get( SceneryPhetStrings, 'measuringTapeReadoutPatternStringProperty' ),
  wavelengthStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'wavelength', _.get( SceneryPhetStrings, 'wavelengthStringProperty' ) ),
  rulerCapitalizedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'rulerCapitalized', _.get( SceneryPhetStrings, 'rulerCapitalizedStringProperty' ) ),
  rulerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'ruler', _.get( SceneryPhetStrings, 'rulerStringProperty' ) ),
  zeroStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'zero', _.get( SceneryPhetStrings, 'zeroStringProperty' ) ),
  oneStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'one', _.get( SceneryPhetStrings, 'oneStringProperty' ) ),
  twoStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'two', _.get( SceneryPhetStrings, 'twoStringProperty' ) ),
  threeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'three', _.get( SceneryPhetStrings, 'threeStringProperty' ) ),
  fourStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'four', _.get( SceneryPhetStrings, 'fourStringProperty' ) ),
  fiveStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'five', _.get( SceneryPhetStrings, 'fiveStringProperty' ) ),
  sixStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'six', _.get( SceneryPhetStrings, 'sixStringProperty' ) ),
  sevenStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'seven', _.get( SceneryPhetStrings, 'sevenStringProperty' ) ),
  eightStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'eight', _.get( SceneryPhetStrings, 'eightStringProperty' ) ),
  nineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'nine', _.get( SceneryPhetStrings, 'nineStringProperty' ) ),
  tenStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'ten', _.get( SceneryPhetStrings, 'tenStringProperty' ) ),
  offScaleIndicator: {
    pointsOffScaleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'offScaleIndicator_pointsOffScale', _.get( SceneryPhetStrings, 'offScaleIndicator.pointsOffScaleStringProperty' ) )
  },
  ResetAllButton: {
    nameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'ResetAllButton_name', _.get( SceneryPhetStrings, 'ResetAllButton.nameStringProperty' ) ),
    name__commentStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'ResetAllButton_name__comment', _.get( SceneryPhetStrings, 'ResetAllButton.name__commentStringProperty' ) ),
    name__deprecatedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'ResetAllButton_name__deprecated', _.get( SceneryPhetStrings, 'ResetAllButton.name__deprecatedStringProperty' ) )
  },
  SoundToggleButton: {
    nameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'SoundToggleButton_name', _.get( SceneryPhetStrings, 'SoundToggleButton.nameStringProperty' ) ),
    name__commentStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'SoundToggleButton_name__comment', _.get( SceneryPhetStrings, 'SoundToggleButton.name__commentStringProperty' ) ),
    name__deprecatedStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'SoundToggleButton_name__deprecated', _.get( SceneryPhetStrings, 'SoundToggleButton.name__deprecatedStringProperty' ) )
  },
  scientificNotationStringProperty: _.get( SceneryPhetStrings, 'scientificNotationStringProperty' ),
  units: {
    centimetersStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'units_centimeters', _.get( SceneryPhetStrings, 'units.centimetersStringProperty' ) ),
    centimetersPatternStringProperty: _.get( SceneryPhetStrings, 'units.centimetersPatternStringProperty' ),
    centimetersSquaredStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'units_centimetersSquared', _.get( SceneryPhetStrings, 'units.centimetersSquaredStringProperty' ) ),
    centimetersSquaredPatternStringProperty: _.get( SceneryPhetStrings, 'units.centimetersSquaredPatternStringProperty' ),
    hertzStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'units_hertz', _.get( SceneryPhetStrings, 'units.hertzStringProperty' ) ),
    hertzPatternStringProperty: _.get( SceneryPhetStrings, 'units.hertzPatternStringProperty' ),
    percentStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'units_percent', _.get( SceneryPhetStrings, 'units.percentStringProperty' ) ),
    percentPatternStringProperty: _.get( SceneryPhetStrings, 'units.percentPatternStringProperty' ),
    secondsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'units_seconds', _.get( SceneryPhetStrings, 'units.secondsStringProperty' ) ),
    secondsPatternStringProperty: _.get( SceneryPhetStrings, 'units.secondsPatternStringProperty' )
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
      slider: {
        orKeysPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.orKeysPatternStringProperty' ),
        leftRightArrowKeysStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_slider_leftRightArrowKeys', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.leftRightArrowKeysStringProperty' ) ),
        upDownArrowKeysStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_slider_upDownArrowKeys', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.upDownArrowKeysStringProperty' ) ),
        defaultStepsDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.defaultStepsDescriptionPatternStringProperty' ),
        defaultStepsAdjustSliderDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.defaultStepsAdjustSliderDescriptionPatternStringProperty' ),
        shiftLeftRightArrowKeysStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_slider_shiftLeftRightArrowKeys', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.shiftLeftRightArrowKeysStringProperty' ) ),
        shiftUpDownArrowKeysStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_slider_shiftUpDownArrowKeys', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.shiftUpDownArrowKeysStringProperty' ) ),
        smallerStepsDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.smallerStepsDescriptionPatternStringProperty' ),
        smallerStepsAdjustSliderDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.smallerStepsAdjustSliderDescriptionPatternStringProperty' ),
        largerStepsDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.largerStepsDescriptionPatternStringProperty' ),
        largerStepsAdjustSliderDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.largerStepsAdjustSliderDescriptionPatternStringProperty' ),
        jumpToMinimumDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.jumpToMinimumDescriptionPatternStringProperty' ),
        jumpToMaximumDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.slider.jumpToMaximumDescriptionPatternStringProperty' )
      },
      general: {
        resetAllDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.resetAllDescriptionPatternStringProperty' ),
        tabDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_tabDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.tabDescriptionStringProperty' ) ),
        shiftTabDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_shiftTabDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.shiftTabDescriptionStringProperty' ) ),
        tabGroupDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_tabGroupDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.tabGroupDescriptionStringProperty' ) ),
        shiftTabGroupDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_shiftTabGroupDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.shiftTabGroupDescriptionStringProperty' ) ),
        pressButtonsDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_pressButtonsDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.pressButtonsDescriptionStringProperty' ) ),
        groupNavigationDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_groupNavigationDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.groupNavigationDescriptionStringProperty' ) ),
        setValuesInKeypadDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_setValuesInKeypadDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.setValuesInKeypadDescriptionStringProperty' ) ),
        exitDialogDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_exitDialogDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.exitDialogDescriptionStringProperty' ) ),
        toggleCheckboxesDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_general_toggleCheckboxesDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.general.toggleCheckboxesDescriptionStringProperty' ) )
      },
      grabOrReleaseDescriptionPatternStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.grabOrReleaseDescriptionPatternStringProperty' ),
      comboBox: {
        popUpListPatternDescriptionStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.comboBox.popUpListPatternDescriptionStringProperty' ),
        moveThroughPatternDescriptionStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.comboBox.moveThroughPatternDescriptionStringProperty' ),
        chooseNewPatternDescriptionStringProperty: _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.comboBox.chooseNewPatternDescriptionStringProperty' ),
        closeWithoutChangingDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_comboBox_closeWithoutChangingDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.comboBox.closeWithoutChangingDescriptionStringProperty' ) )
      },
      draggableItems: {
        moveDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_draggableItems_moveDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.draggableItems.moveDescriptionStringProperty' ) ),
        moveSlowerDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_draggableItems_moveSlowerDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.draggableItems.moveSlowerDescriptionStringProperty' ) )
      },
      timingControls: {
        pauseOrPlayActionDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_timingControls_pauseOrPlayActionDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.timingControls.pauseOrPlayActionDescriptionStringProperty' ) )
      },
      faucetControls: {
        adjustFaucetFlowDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_adjustFaucetFlowDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.adjustFaucetFlowDescriptionStringProperty' ) ),
        adjustInSmallerStepsDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_adjustInSmallerStepsDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.adjustInSmallerStepsDescriptionStringProperty' ) ),
        adjustInLargerStepsDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_adjustInLargerStepsDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.adjustInLargerStepsDescriptionStringProperty' ) ),
        closeFaucetDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_closeFaucetDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.closeFaucetDescriptionStringProperty' ) ),
        openFaucetFullyDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_openFaucetFullyDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.openFaucetFullyDescriptionStringProperty' ) ),
        openFaucetBrieflyDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_keyboardHelpDialog_faucetControls_openFaucetBrieflyDescription', _.get( SceneryPhetStrings, 'a11y.keyboardHelpDialog.faucetControls.openFaucetBrieflyDescriptionStringProperty' ) )
      }
    },
    eraserButton: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_eraserButton_accessibleName', _.get( SceneryPhetStrings, 'a11y.eraserButton.accessibleNameStringProperty' ) )
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
    stepButton: {
      stepForwardStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepButton_stepForward', _.get( SceneryPhetStrings, 'a11y.stepButton.stepForwardStringProperty' ) ),
      playingDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepButton_playingDescription', _.get( SceneryPhetStrings, 'a11y.stepButton.playingDescriptionStringProperty' ) ),
      pausedDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stepButton_pausedDescription', _.get( SceneryPhetStrings, 'a11y.stepButton.pausedDescriptionStringProperty' ) )
    },
    timeControlNode: {
      simSpeedDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControlNode_simSpeedDescription', _.get( SceneryPhetStrings, 'a11y.timeControlNode.simSpeedDescriptionStringProperty' ) ),
      labelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControlNode_label', _.get( SceneryPhetStrings, 'a11y.timeControlNode.labelStringProperty' ) ),
      simSpeedsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_timeControlNode_simSpeeds', _.get( SceneryPhetStrings, 'a11y.timeControlNode.simSpeedsStringProperty' ) )
    },
    playPauseStepButtonGroup: {
      playingHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playPauseStepButtonGroup_playingHelpText', _.get( SceneryPhetStrings, 'a11y.playPauseStepButtonGroup.playingHelpTextStringProperty' ) ),
      pausedHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_playPauseStepButtonGroup_pausedHelpText', _.get( SceneryPhetStrings, 'a11y.playPauseStepButtonGroup.pausedHelpTextStringProperty' ) )
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
      grabbedAccessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_groupSort_grabbedAccessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.groupSort.grabbedAccessibleContextResponseStringProperty' ) ),
      releasedAccessibleContextResponseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_groupSort_releasedAccessibleContextResponse', _.get( SceneryPhetStrings, 'a11y.groupSort.releasedAccessibleContextResponseStringProperty' ) )
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
      centimetersPattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_centimetersPattern', _.get( SceneryPhetStrings, 'a11y.units.centimetersPatternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] ),
      centimetersSquaredPattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_centimetersSquaredPattern', _.get( SceneryPhetStrings, 'a11y.units.centimetersSquaredPatternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] ),
      hertzPattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_hertzPattern', _.get( SceneryPhetStrings, 'a11y.units.hertzPatternStringProperty' ), [{"name":"value"}] ),
      percentPattern: new FluentPattern<{ value: FluentVariable }>( fluentSupport.bundleProperty, 'a11y_units_percentPattern', _.get( SceneryPhetStrings, 'a11y.units.percentPatternStringProperty' ), [{"name":"value"}] ),
      secondsPattern: new FluentPattern<{ value: number | 'one' | number | 'other' | TReadOnlyProperty<number | 'one' | number | 'other'> }>( fluentSupport.bundleProperty, 'a11y_units_secondsPattern', _.get( SceneryPhetStrings, 'a11y.units.secondsPatternStringProperty' ), [{"name":"value","variants":[{"type":"number","value":"one"},{"type":"number","value":"other"}]}] )
    }
  }
};

export default SceneryPhetFluent;

sceneryPhet.register('SceneryPhetFluent', SceneryPhetFluent);
