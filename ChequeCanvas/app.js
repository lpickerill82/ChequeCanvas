// Working Version 22/06/2018
//
var chequeGenerator;
(function (chequeGenerator) {
    // Define measurementUnit with a choice of measurement.
    var measurementUnit;
    (function (measurementUnit) {
        measurementUnit[measurementUnit["cm"] = 0] = "cm";
        measurementUnit[measurementUnit["mm"] = 1] = "mm";
        measurementUnit[measurementUnit["px"] = 2] = "px";
    })(measurementUnit = chequeGenerator.measurementUnit || (chequeGenerator.measurementUnit = {}));
    var chequeGeneratorStationery = /** @class */ (function () {
        function chequeGeneratorStationery() {
            this._labels = ["Select All", "Payee Name", "Amount in Words", "Amount in Numbers", "Date"];
            this._nudgeStepsLeftRight = 0;
            this._nudgeStepsUpDown = 0;
            this._nudgeSingleNumber = 1;
            this._labelObject = 'x';
            this._nudgingDefault = true;
            this._moveAllLabels = false;
            this._objectClassName = '.cheque-placeholder';
            this._coordinatesValidY = true;
            this._coordinatesValidX = true;
            this.defaults();
        }
        chequeGeneratorStationery.prototype.defaults = function () {
            this._chequeFormat = {
                width: 209,
                height: 95,
                startingCoordinatesX: 0,
                startingCoordinatesY: 0,
            };
            this._sumInWord = {
                object: 'SumInWord',
                objectTarget: '#SumInWord',
                objectClassName: '.cheque-placeholder',
                objectTitle: 'Amount In Word',
                left: 24,
                stepsLeftRight: 24,
                top: 48,
                stepsUpDown: 48,
                width: 127,
                lineHeight: 24,
                placeholder: 'Nine Hundred And Ninety Nine Thousand And Nine Hundred Ninety Nine  99p',
                unit: measurementUnit.mm
            };
            this._sumInNumber = {
                object: 'SumInNumber',
                objectTarget: '#SumInNumber',
                objectClassName: '.cheque-placeholder',
                objectTitle: 'Amount In Number',
                left: 166,
                stepsLeftRight: 166,
                top: 41,
                stepsUpDown: 41,
                placeholder: '999999-99',
                unit: measurementUnit.mm
            };
            this._dateOfCheque = {
                object: 'DateOfCheque',
                objectTarget: '#DateOfCheque',
                objectClassName: '.cheque-placeholder',
                objectTitle: 'Date of Cheque',
                left: 170,
                stepsLeftRight: 170,
                top: 25,
                stepsUpDown: 25,
                placeholder: "16 Apr 2016",
                unit: measurementUnit.mm
            };
            this._payeeName = {
                object: 'PayeeName',
                objectTarget: '#PayeeName',
                objectClassName: '.cheque-placeholder',
                objectTitle: 'Payee Name',
                left: 10,
                stepsLeftRight: 10,
                top: 41,
                stepsUpDown: 41,
                placeholder: 'Mr Joe Bloggs **',
                unit: measurementUnit.mm
            };
            this._selectAll = {
                // Dummy Object to allow a placeholder object to be selected
                object: 'Dummy',
                objectTarget: '#Dummy',
                objectClassName: '.cheque-placeholder',
                objectTitle: 'Dummy',
                left: 0,
                stepsLeftRight: 0,
                top: 0,
                stepsUpDown: 0,
                placeholder: '',
                unit: measurementUnit.mm
            };
        };
        chequeGeneratorStationery.prototype.initialise = function () {
            this.setEventHandlers();
            chequeGenerate._nudgingDefault = true;
        };
        chequeGeneratorStationery.prototype.setEventHandlers = function () {
            var timeOut = 0;
            chequeGenerate.setupController();
            $(document).on("change", "#fieldSelectorControllerDropdown", function () {
                chequeGenerate._labelSelectorControllerValue = $(this).val();
                chequeGenerate.labelSelectorController(chequeGenerate._labelSelectorControllerValue);
            });
            //Using the mousedown to allow the user to hold down the arrow button rather than to keep clicking on the button. 
            $('#BtnNudgeLeft').bind('mousedown', function (event) {
                timeOut = setInterval(function () {
                    chequeGenerate.nudgerController({
                        nudge: 'Left',
                        object: chequeGenerate._labelObject,
                        unit: measurementUnit.mm,
                    });
                }, 80);
            }).bind('mouseup mouseleave touchend', function () {
                clearInterval(timeOut);
            });
            $('#BtnNudgeRight').bind('mousedown', function (event) {
                timeOut = setInterval(function () {
                    chequeGenerate.nudgerController({
                        nudge: 'Right',
                        object: chequeGenerate._labelObject,
                        unit: measurementUnit.mm,
                    });
                }, 80);
            }).bind('mouseup mouseleave touchend', function () {
                clearInterval(timeOut);
            });
            $('#BtnNudgeUp').bind('mousedown', function (event) {
                timeOut = setInterval(function () {
                    chequeGenerate.nudgerController({
                        nudge: 'Up',
                        object: chequeGenerate._labelObject,
                        unit: measurementUnit.mm,
                    });
                }, 80);
            }).bind('mouseup mouseleave touchend', function () {
                clearInterval(timeOut);
            });
            $('#BtnNudgeDown').bind('mousedown', function (event) {
                timeOut = setInterval(function () {
                    chequeGenerate.nudgerController({
                        nudge: 'Down',
                        object: chequeGenerate._labelObject,
                        unit: measurementUnit.mm,
                    });
                }, 80);
            }).bind('mouseup mouseleave touchend', function () {
                clearInterval(timeOut);
            });
            $(document).on("click", '#btnSavedClose', function () {
                chequeGenerate.savedPositioningCloseModal();
            });
            $(document).on("click", '#btnSaved', function () {
                chequeGenerate.savedPositioning();
            });
            $(document).on("click", '#btnResetToDefault', function () {
                chequeGenerate.resetChequeNudging();
            });
        };
        chequeGeneratorStationery.prototype.setupController = function () {
            //Set up Cheque Controls
            chequeGenerate.setupLabels();
            chequeGenerate.setupLabelMeasurements();
            chequeGenerate.setupLabelSelectorController();
            $('.chosen-select-no-search').chosen({
                disable_search: true,
                allow_single_deselect: false,
            });
        };
        chequeGeneratorStationery.prototype.setupLabelSelectorController = function () {
            // Create Dropdown
            // Dropdown with a choice to select a label or select all labels
            var fieldSelector;
            var i;
            fieldSelector = '<select id="fieldSelectorControllerDropdown" data-placeholder="Select Text to Nudge" class="chosen-select-no-search">';
            fieldSelector += '<option></option>';
            for (i = 0; i < chequeGenerate._labels.length; i++) {
                fieldSelector += '<option value="' + i + '">' + chequeGenerate._labels[i] + '</option>';
            }
            fieldSelector += '</select>';
            console.log(fieldSelector);
            $('#fieldSelectorController').append(fieldSelector);
        };
        chequeGeneratorStationery.prototype.setupLabelMeasurements = function () {
            // Create Labels and measurement to display how far in millimeters how far the labels from the left and top of the canvas.
            $('#labelDetailsChequeNudgingList').append('<li id="HeaderDetails"> <span class="cheque-label-details details-header" > </span><span class="length-details-header details-header"><b>Left</b></span><span class="height-details-header details-header"><b>Top</b></span></li>');
            $('#labelDetailsChequeNudgingList').append('<li id="' + chequeGenerate._payeeName.object + 'Details">' + chequeGenerate.setupInputController(chequeGenerate._payeeName) + ' </li>');
            $('#labelDetailsChequeNudgingList').append('<li id="' + chequeGenerate._sumInWord.object + 'Details">' + chequeGenerate.setupInputController(chequeGenerate._sumInWord) + ' </li>');
            $('#labelDetailsChequeNudgingList').append('<li id="' + chequeGenerate._sumInNumber.object + 'Details">' + chequeGenerate.setupInputController(chequeGenerate._sumInNumber) + ' </li>');
            $('#labelDetailsChequeNudgingList').append('<li id="' + chequeGenerate._dateOfCheque.object + 'Details">' + chequeGenerate.setupInputController(chequeGenerate._dateOfCheque) + ' </li>');
        };
        chequeGeneratorStationery.prototype.setupInputController = function (chequeLabelObject) {
            // Returns the value of the positioning for each object (Label)
            var chequeLabel = "";
            chequeLabel += '<span class="cheque-label-details"><b>' + chequeLabelObject.objectTitle + ':</b></span>';
            chequeLabel += '<span class="length-details">   <input id="' + chequeLabelObject.object + 'DetailsInputLeft" type="number" class="form-control form-control-inline" name="PayeeNameInputLeft" value="' + chequeLabelObject.stepsLeftRight + '" disabled />' + measurementUnit[chequeLabelObject.unit] + '</span>';
            chequeLabel += '<span class="height-details">   <input id="' + chequeLabelObject.object + 'DetailsInputTop" type="number" class="form-control form-control-inline" name="PayeeNameInputTop" value="' + chequeLabelObject.stepsUpDown + '" disabled />' + measurementUnit[chequeLabelObject.unit] + '</span>';
            return chequeLabel;
        };
        chequeGeneratorStationery.prototype.setupLabels = function () {
            // Default positioning of the Labels 
            $(chequeGenerate._sumInWord.objectTarget).text(chequeGenerate._sumInWord.placeholder);
            $(chequeGenerate._sumInNumber.objectTarget).text('**' + chequeGenerate._sumInNumber.placeholder + '**');
            $(chequeGenerate._dateOfCheque.objectTarget).text(chequeGenerate._dateOfCheque.placeholder);
            $(chequeGenerate._payeeName.objectTarget).text(chequeGenerate.truncateString(chequeGenerate._payeeName.placeholder));
            $(chequeGenerate._sumInWord.objectTarget).css({
                'margin-left': chequeGenerate._sumInWord.left + measurementUnit[chequeGenerate._sumInWord.unit],
                'margin-top': chequeGenerate._sumInWord.top + measurementUnit[chequeGenerate._sumInWord.unit],
                'width': chequeGenerate._sumInWord.width + measurementUnit[chequeGenerate._sumInWord.unit],
                'line-height': chequeGenerate._sumInWord.lineHeight + 'px'
            });
            $(chequeGenerate._sumInNumber.objectTarget).css({
                'margin-left': chequeGenerate._sumInNumber.left + measurementUnit[chequeGenerate._sumInNumber.unit],
                'margin-top': chequeGenerate._sumInNumber.top + measurementUnit[chequeGenerate._sumInNumber.unit],
                'width': '40' + measurementUnit[chequeGenerate._sumInNumber.unit]
            });
            $(chequeGenerate._dateOfCheque.objectTarget).css({
                'margin-left': chequeGenerate._dateOfCheque.left + measurementUnit[chequeGenerate._dateOfCheque.unit],
                'margin-top': chequeGenerate._dateOfCheque.top + measurementUnit[chequeGenerate._dateOfCheque.unit],
                'width': '36' + measurementUnit[chequeGenerate._dateOfCheque.unit]
            });
            $(chequeGenerate._payeeName.objectTarget).css({
                'margin-left': chequeGenerate._payeeName.left + measurementUnit[chequeGenerate._payeeName.unit],
                'margin-top': chequeGenerate._payeeName.top + measurementUnit[chequeGenerate._payeeName.unit],
                'width': '154' + measurementUnit[chequeGenerate._dateOfCheque.unit],
                'max-width': '154' + measurementUnit[chequeGenerate._dateOfCheque.unit]
            });
        };
        chequeGeneratorStationery.prototype.labelSelectorController = function (labelSelectorControllerValue) {
            // When selected a label, Label gets highighted (via class name)
            chequeGenerate.getLabelFieldObject(labelSelectorControllerValue);
            if (chequeGenerate._moveAllLabels == true) {
                // Selecting All Labels
                $(chequeGenerate._objectClassName).addClass('label-active');
                chequeGenerate.activeLabel(chequeGenerate._objectClassName);
            }
            else {
                // Selecting Individual Label
                chequeGenerate.cleanLabel(chequeGenerate._objectClassName);
                chequeGenerate.activeLabel(chequeGenerate._labelSelectedToNudge);
            }
            // Activate The Nudge Controller
            chequeGenerate.activateNudgeController();
            // Nudges the label 1mm Dependant on the direction button clicked
            // Left / Right or Up / Down 
            chequeGenerate._nudgeStepsLeftRight = chequeGenerate._labelObjectSelected.stepsLeftRight;
            chequeGenerate._nudgeStepsUpDown = chequeGenerate._labelObjectSelected.stepsUpDown;
        };
        chequeGeneratorStationery.prototype.cleanLabel = function (labelTarget) {
            //Remove Highlight from all Labels
            $(labelTarget).removeClass('label-active');
        };
        chequeGeneratorStationery.prototype.activeLabel = function (labelTarget) {
            // Add Highlight to Selected Label
            $(labelTarget).addClass('label-active');
        };
        chequeGeneratorStationery.prototype.nudgerController = function (chequeLabelMove) {
            // Controller to identify which direction to move the label
            switch (chequeLabelMove.nudge) {
                case "Left":
                    chequeGenerate._labelMoveNudge = 'Left';
                    chequeGenerate._labelMove = 'marginLeft';
                    chequeGenerate._nudgeStepsLeftRight = chequeGenerate._labelObjectSelected.stepsLeftRight;
                    chequeGenerate.nudgeLeftRight(measurementUnit[chequeLabelMove.unit]);
                    break;
                case "Right":
                    chequeGenerate._labelMoveNudge = 'Right';
                    chequeGenerate._labelMove = 'marginLeft';
                    chequeGenerate._nudgeStepsLeftRight = chequeGenerate._labelObjectSelected.stepsLeftRight;
                    chequeGenerate.nudgeLeftRight(measurementUnit[chequeLabelMove.unit]);
                    break;
                case "Up":
                    chequeGenerate._labelMoveNudge = 'Up';
                    chequeGenerate._labelMove = 'marginTop';
                    chequeGenerate._nudgeStepsUpDown = chequeGenerate._labelObjectSelected.stepsUpDown;
                    chequeGenerate.nudgeUpDown(measurementUnit[chequeLabelMove.unit]);
                    break;
                case "Down":
                    chequeGenerate._labelMoveNudge = 'Down';
                    chequeGenerate._labelMove = 'marginTop';
                    chequeGenerate._nudgeStepsUpDown = chequeGenerate._labelObjectSelected.stepsUpDown;
                    chequeGenerate.nudgeUpDown(measurementUnit[chequeLabelMove.unit]);
                    break;
                default:
                    break;
            }
        };
        chequeGeneratorStationery.prototype.nudgeLeftRight = function (unit) {
            // Nudges the label Left / Right 
            chequeGenerate.checkNudgeDefault();
            if (chequeGenerate._moveAllLabels == false) {
                chequeGenerate.calculateBoundaryStepX();
                if (chequeGenerate._coordinatesValidX == true) {
                    chequeGenerate.calculateSteps();
                    chequeGenerate.moveIndividualLabel(unit, chequeGenerate._nudgeNumber);
                    chequeGenerate._labelObjectSelected.stepsLeftRight = chequeGenerate._nudgeStepsLeftRight;
                    chequeGenerate.updateLabelMeasurements();
                }
            }
            else {
                chequeGenerate.moveAllLabels(unit);
            }
            chequeGenerate._nudgingDefault = false;
        };
        chequeGeneratorStationery.prototype.nudgeUpDown = function (unit) {
            // Nudges the label Up / Down
            chequeGenerate.checkNudgeDefault();
            chequeGenerate.calculateBoundaryStepY();
            if (chequeGenerate._moveAllLabels == false) {
                if (chequeGenerate._coordinatesValidY == true) {
                    chequeGenerate.calculateSteps();
                    chequeGenerate.moveIndividualLabel(unit, chequeGenerate._nudgeNumber);
                    chequeGenerate._labelObjectSelected.stepsUpDown = chequeGenerate._nudgeStepsUpDown;
                    chequeGenerate.updateLabelMeasurements();
                }
            }
            else {
                chequeGenerate.moveAllLabels(unit);
            }
            chequeGenerate._nudgingDefault = false;
        };
        chequeGeneratorStationery.prototype.moveIndividualLabel = function (unit, nudgeNumber) {
            var margin = chequeGenerate._labelMove;
            var animateOptions = {};
            var incrementMM = 0;
            incrementMM = nudgeNumber * 0.005;
            // Fix for MM out of sync, only for screen,we may have to do something like this on the pdf. 
            var animateNudgeNumber = nudgeNumber + incrementMM + unit;
            animateOptions[chequeGenerate._labelMove] = animateNudgeNumber;
            $(chequeGenerate._labelSelectedToNudge).animate(animateOptions, 10);
        };
        chequeGeneratorStationery.prototype.moveAllLabels = function (unit) {
            var nudgeNumber;
            var i = 0;
            // Move all labels 
            $(chequeGenerate._objectClassName).each(function () {
                var LabelID = $(this).attr('id');
                var animateOptions = {};
                i++;
                chequeGenerate.getLabelFieldObjectAllLabel(LabelID);
                if (chequeGenerate._labelMoveNudge == 'Left' || chequeGenerate._labelMoveNudge == 'Right') {
                    chequeGenerate._nudgeStepsLeftRight = chequeGenerate._labelObjectSelected.stepsLeftRight;
                    chequeGenerate.calculateBoundaryStepX();
                    if (chequeGenerate._coordinatesValidX == true) {
                        chequeGenerate.calculateSteps();
                        chequeGenerate.moveIndividualLabel(unit, chequeGenerate._nudgeNumber);
                        chequeGenerate.updateLabelMeasurements();
                    }
                }
                else if (chequeGenerate._labelMoveNudge == 'Up' || chequeGenerate._labelMoveNudge == 'Down') {
                    chequeGenerate._nudgeStepsUpDown = chequeGenerate._labelObjectSelected.stepsUpDown;
                    chequeGenerate.calculateBoundaryStepY();
                    if (chequeGenerate._coordinatesValidY == true) {
                        chequeGenerate.calculateSteps();
                        chequeGenerate.moveIndividualLabel(unit, chequeGenerate._nudgeNumber);
                        chequeGenerate.updateLabelMeasurements();
                    }
                }
                $(chequeGenerate._labelSelectedToNudge).animate(animateOptions, 10);
            });
        };
        chequeGeneratorStationery.prototype.updateLabelMeasurements = function () {
            // Update Input with the new value of the positioning that the label have been moved to. 
            $(chequeGenerate._payeeName.objectTarget + 'DetailsInputLeft ').val(chequeGenerate._payeeName.stepsLeftRight);
            $(chequeGenerate._payeeName.objectTarget + 'DetailsInputTop ').val(chequeGenerate._payeeName.stepsUpDown);
            $(chequeGenerate._sumInWord.objectTarget + 'DetailsInputLeft ').val(chequeGenerate._sumInWord.stepsLeftRight);
            $(chequeGenerate._sumInWord.objectTarget + 'DetailsInputTop ').val(chequeGenerate._sumInWord.stepsUpDown);
            $(chequeGenerate._sumInNumber.objectTarget + 'DetailsInputLeft ').val(chequeGenerate._sumInNumber.stepsLeftRight);
            $(chequeGenerate._sumInNumber.objectTarget + 'DetailsInputTop ').val(chequeGenerate._sumInNumber.stepsUpDown);
            $(chequeGenerate._dateOfCheque.objectTarget + 'DetailsInputLeft ').val(chequeGenerate._dateOfCheque.stepsLeftRight);
            $(chequeGenerate._dateOfCheque.objectTarget + 'DetailsInputTop ').val(chequeGenerate._dateOfCheque.stepsUpDown);
        };
        chequeGeneratorStationery.prototype.getLabelFieldObject = function (fieldSelectorControllerValue) {
            // Label Controller Indicates which Label to Move 
            switch (chequeGenerate._labels[fieldSelectorControllerValue]) {
                case "Payee Name":
                    chequeGenerate._labelSelectedToNudge = '#PayeeName';
                    chequeGenerate._labelObjectSelected = chequeGenerate._payeeName;
                    chequeGenerate._moveAllLabels = false;
                    break;
                case "Amount in Words":
                    chequeGenerate._labelSelectedToNudge = '#SumInWord';
                    chequeGenerate._labelObjectSelected = chequeGenerate._sumInWord;
                    chequeGenerate._moveAllLabels = false;
                    break;
                case "Amount in Numbers":
                    chequeGenerate._labelSelectedToNudge = '#SumInNumber';
                    chequeGenerate._labelObjectSelected = chequeGenerate._sumInNumber;
                    chequeGenerate._moveAllLabels = false;
                    break;
                case "Date":
                    chequeGenerate._labelSelectedToNudge = '#DateOfCheque';
                    chequeGenerate._labelObjectSelected = chequeGenerate._dateOfCheque;
                    chequeGenerate._moveAllLabels = false;
                    break;
                case "Select All":
                    chequeGenerate._labelSelectedToNudge = '#Dummy';
                    chequeGenerate._labelObjectSelected = chequeGenerate._selectAll;
                    chequeGenerate._moveAllLabels = true;
                    break;
                default:
                    break;
            }
        };
        chequeGeneratorStationery.prototype.getLabelFieldObjectAllLabel = function (fieldSelectorControllerValue) {
            // Returns Value of the label to move
            switch (fieldSelectorControllerValue) {
                case "PayeeName":
                    chequeGenerate._labelSelectedToNudge = '#PayeeName';
                    chequeGenerate._labelObjectSelected = chequeGenerate._payeeName;
                    break;
                case "SumInWord":
                    chequeGenerate._labelSelectedToNudge = '#SumInWord';
                    chequeGenerate._labelObjectSelected = chequeGenerate._sumInWord;
                    break;
                case "SumInNumber":
                    chequeGenerate._labelSelectedToNudge = '#SumInNumber';
                    chequeGenerate._labelObjectSelected = chequeGenerate._sumInNumber;
                    break;
                case "DateOfCheque":
                    chequeGenerate._labelSelectedToNudge = '#DateOfCheque';
                    chequeGenerate._labelObjectSelected = chequeGenerate._dateOfCheque;
                    break;
                default:
                    break;
            }
        };
        chequeGeneratorStationery.prototype.savedPositioningCloseModal = function () {
            // Save Values upon Modal Closing
            chequeGenerate.updateChequeValues();
            $('#ChequeGenerator').modal('hide');
        };
        chequeGeneratorStationery.prototype.savedPositioning = function () {
            // Saved positioning of the cheque values
            chequeGenerate.updateChequeValues();
        };
        chequeGeneratorStationery.prototype.updateNudgingDefault = function () {
            chequeGenerate._nudgingDefault = true;
        };
        chequeGeneratorStationery.prototype.updateChequeValues = function () {
            chequeGenerate._sumInWord.left = chequeGenerate._sumInWord.stepsLeftRight;
            chequeGenerate._sumInNumber.left = chequeGenerate._sumInNumber.stepsLeftRight;
            chequeGenerate._dateOfCheque.left = chequeGenerate._dateOfCheque.stepsLeftRight;
            chequeGenerate._payeeName.left = chequeGenerate._payeeName.stepsLeftRight;
            chequeGenerate._sumInWord.top = chequeGenerate._sumInWord.stepsUpDown;
            chequeGenerate._sumInNumber.top = chequeGenerate._sumInNumber.stepsUpDown;
            chequeGenerate._dateOfCheque.top = chequeGenerate._dateOfCheque.stepsUpDown;
            chequeGenerate._payeeName.top = chequeGenerate._payeeName.stepsUpDown;
            chequeGenerate.updateNudgingDefault();
        };
        chequeGeneratorStationery.prototype.checkNudgeDefault = function () {
            if (chequeGenerate._nudgingDefault == true) {
                chequeGenerate._nudgeStepsLeftRight = chequeGenerate._labelObjectSelected.left;
            }
        };
        chequeGeneratorStationery.prototype.calculateBoundaryStepX = function () {
            if (chequeGenerate._labelMoveNudge == 'Left') {
                chequeGenerate.checkLabelWithinBoundaryX(chequeGenerate.takeway(chequeGenerate._nudgeStepsLeftRight, chequeGenerate._nudgeSingleNumber));
            }
            else {
                chequeGenerate.checkLabelWithinBoundaryX(chequeGenerate.add(chequeGenerate._nudgeStepsLeftRight, chequeGenerate._nudgeSingleNumber));
            }
        };
        chequeGeneratorStationery.prototype.calculateBoundaryStepY = function () {
            if (chequeGenerate._labelMoveNudge == 'Up') {
                chequeGenerate.checkLabelWithinBoundaryY(chequeGenerate.takeway(chequeGenerate._nudgeStepsUpDown, chequeGenerate._nudgeSingleNumber));
            }
            else {
                chequeGenerate.checkLabelWithinBoundaryY(chequeGenerate.add(chequeGenerate._nudgeStepsUpDown, chequeGenerate._nudgeSingleNumber));
            }
        };
        chequeGeneratorStationery.prototype.checkLabelWithinBoundaryX = function (stepsLeftRight) {
            if (stepsLeftRight < chequeGenerate._chequeFormat.startingCoordinatesX) {
                chequeGenerate._coordinatesValidY = true;
                chequeGenerate._coordinatesValidX = false;
            }
            else {
                chequeGenerate._coordinatesValidY = true;
                chequeGenerate._coordinatesValidX = true;
            }
        };
        chequeGeneratorStationery.prototype.checkLabelWithinBoundaryY = function (stepsUpDown) {
            if (stepsUpDown < chequeGenerate._chequeFormat.startingCoordinatesY) {
                chequeGenerate._coordinatesValidY = false;
                chequeGenerate._coordinatesValidX = true;
            }
            else {
                chequeGenerate._coordinatesValidY = true;
                chequeGenerate._coordinatesValidX = true;
            }
        };
        chequeGeneratorStationery.prototype.calculateSteps = function () {
            if (chequeGenerate._labelMoveNudge == 'Left') {
                chequeGenerate._nudgeStepsLeftRight = chequeGenerate.takeway(chequeGenerate._nudgeStepsLeftRight, chequeGenerate._nudgeSingleNumber);
                chequeGenerate._nudgeNumber = chequeGenerate._nudgeStepsLeftRight;
                chequeGenerate._labelObjectSelected.stepsLeftRight = chequeGenerate._nudgeStepsLeftRight;
            }
            else if (chequeGenerate._labelMoveNudge == 'Right') {
                chequeGenerate._nudgeStepsLeftRight = chequeGenerate.add(chequeGenerate._nudgeStepsLeftRight, chequeGenerate._nudgeSingleNumber);
                chequeGenerate._nudgeNumber = chequeGenerate._nudgeStepsLeftRight;
                chequeGenerate._labelObjectSelected.stepsLeftRight = chequeGenerate._nudgeStepsLeftRight;
            }
            else if (chequeGenerate._labelMoveNudge == 'Up') {
                chequeGenerate._nudgeStepsUpDown = chequeGenerate.takeway(chequeGenerate._nudgeStepsUpDown, chequeGenerate._nudgeSingleNumber);
                chequeGenerate._nudgeNumber = chequeGenerate._nudgeStepsUpDown;
                chequeGenerate._labelObjectSelected.stepsUpDown = chequeGenerate._nudgeStepsUpDown;
            }
            else if (chequeGenerate._labelMoveNudge == 'Down') {
                chequeGenerate._nudgeStepsUpDown = chequeGenerate.add(chequeGenerate._nudgeStepsUpDown, chequeGenerate._nudgeSingleNumber);
                chequeGenerate._nudgeNumber = chequeGenerate._nudgeStepsUpDown;
                chequeGenerate._labelObjectSelected.stepsUpDown = chequeGenerate._nudgeStepsUpDown;
            }
        };
        chequeGeneratorStationery.prototype.resetChequeNudging = function () {
            chequeGenerate = new chequeGenerator.chequeGeneratorStationery();
            chequeGenerate.returnToOrigionalState();
            chequeGenerate.cleanLabel(chequeGenerate._objectClassName);
            chequeGenerate.deactivateNudgeController();
            chequeGenerate.setupController();
        };
        chequeGeneratorStationery.prototype.deactivateNudgeController = function () {
            $('.btn-nudge').prop('disabled', true);
        };
        chequeGeneratorStationery.prototype.activateNudgeController = function () {
            $('.btn-nudge').prop('disabled', false);
        };
        chequeGeneratorStationery.prototype.returnToOrigionalState = function () {
            $('#fieldSelectorController').empty();
            $('#labelDetailsChequeNudgingList').empty();
        };
        chequeGeneratorStationery.prototype.truncateString = function (truncateString) {
            if (truncateString.length > 110) {
                return truncateString.substring(0, 110) + '...';
            }
            else {
                return truncateString;
            }
        };
        chequeGeneratorStationery.prototype.add = function (first, second) {
            return first + second;
        };
        ;
        chequeGeneratorStationery.prototype.takeway = function (first, second) {
            return first - second;
        };
        ;
        chequeGeneratorStationery.prototype.convertNegativeToPositive = function (nudgeStepsToPositive) {
            if (chequeGenerate._nudgeStepsLeftRight >= 0) {
                nudgeStepsToPositive = chequeGenerate._nudgeStepsLeftRight;
                // chequeGenerate._sumInWord.Left = chequeGenerate._sumInWord.Left + NudgestepsLeftRightToPositive;
            }
            else {
                nudgeStepsToPositive = Math.abs(chequeGenerate._nudgeStepsLeftRight);
            }
            return nudgeStepsToPositive;
        };
        return chequeGeneratorStationery;
    }());
    chequeGenerator.chequeGeneratorStationery = chequeGeneratorStationery;
})(chequeGenerator || (chequeGenerator = {}));
var chequeGenerate = new chequeGenerator.chequeGeneratorStationery();
chequeGenerate.initialise();
//# sourceMappingURL=app.js.map