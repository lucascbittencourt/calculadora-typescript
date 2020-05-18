var Calculator = /** @class */ (function () {
    function Calculator() {
        this._audio = new Audio('./assets/click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._display = document.querySelector("#display-operation");
        this._date = document.querySelector('#display-date');
        this._hour = document.querySelector('#display-hour');
        this.initialize();
        this.initButtonsEvents();
    }
    Calculator.prototype.initialize = function () {
        var _this = this;
        this.setDisplayDateTime();
        setInterval(function () { return _this.setDisplayDateTime(); }, 1000);
        this.setNumberToDisplay();
        document.querySelectorAll('#btn-ac').forEach(function (btn) {
            btn.addEventListener('dblclick', function () { return _this.toggleAudio(); });
        });
    };
    Calculator.prototype.toggleAudio = function () {
        this._audioOnOff = !this._audioOnOff;
    };
    Calculator.prototype.playAudio = function () {
        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    };
    Calculator.prototype.addEventListenerAll = function (element, events, fn) {
        events.split(" ").forEach(function (event) {
            element.addEventListener(event, fn, false);
        });
    };
    Calculator.prototype.clearAll = function () {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setNumberToDisplay();
    };
    Calculator.prototype.clearEntry = function () {
        this._operation.pop();
        this.setNumberToDisplay();
    };
    Calculator.prototype.getLastOperation = function () {
        return this._operation[this._operation.length - 1];
    };
    Calculator.prototype.setLastOperation = function (value) {
        this._operation[this._operation.length - 1] = value;
    };
    Calculator.prototype.isOperator = function (value) {
        return ['+', '-', '*', '%', '/'].indexOf(value) > -1;
    };
    Calculator.prototype.pushOperation = function (value) {
        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc();
        }
    };
    Calculator.prototype.getResult = function () {
        var _this = this;
        try {
            return eval(this._operation.join(''));
        }
        catch (e) {
            setTimeout(function () { return _this.setError(); }, 1);
        }
    };
    Calculator.prototype.calc = function () {
        var last = '';
        this._lastOperator = this.getLastItem();
        if (this._operation.length < 3) {
            var firstNumber = this._operation[0];
            this._operation = [firstNumber, this._lastOperator, this._lastNumber];
        }
        if (this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        }
        else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);
        }
        var result = this.getResult();
        if (last == '%') {
            result /= 100;
            this._operation = [result];
        }
        else {
            this._operation = [result];
            if (last)
                this._operation.push(last);
        }
        this.setNumberToDisplay();
    };
    Calculator.prototype.getLastItem = function (isOperator) {
        if (isOperator === void 0) { isOperator = true; }
        var lastItem;
        for (var i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }
        if (!lastItem) {
            lastItem = isOperator ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    };
    Calculator.prototype.setNumberToDisplay = function () {
        var lastNumber = this.getLastItem(false);
        if (!lastNumber)
            lastNumber = 0;
        this.display = lastNumber;
    };
    Calculator.prototype.addOperation = function (value) {
        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            }
            else {
                this.pushOperation(value);
                this.setNumberToDisplay();
            }
        }
        else {
            var newValue = this.getLastOperation().toString() + value;
            this.isOperator(value) ? this.pushOperation(value) : this.setLastOperation(newValue);
            this.setNumberToDisplay();
        }
    };
    Calculator.prototype.setError = function () {
        this._display.innerHTML = 'Error';
    };
    Calculator.prototype.addDot = function () {
        var lastOperation = this.getLastOperation();
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1)
            return;
        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        }
        else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setNumberToDisplay();
    };
    Calculator.prototype.execBtn = function (value) {
        this.playAudio();
        switch (value) {
            case 'AC':
                this.clearAll();
                break;
            case 'CE':
                this.clearEntry();
                break;
            case '+':
                this.addOperation('+');
                break;
            case '-':
                this.addOperation('-');
                break;
            case '/':
                this.addOperation('/');
                break;
            case 'X':
                this.addOperation('*');
                break;
            case '%':
                this.addOperation('%');
                break;
            case '=':
                this.calc();
                break;
            case '.':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(value);
                break;
            default:
                this.setError();
                break;
        }
    };
    Calculator.prototype.initButtonsEvents = function () {
        var _this = this;
        var buttons = document.querySelectorAll(".buttons");
        buttons.forEach(function (btn) {
            _this.addEventListenerAll(btn, 'click drag ', function () {
                var textBtn = btn.innerHTML;
                if (textBtn == '÷')
                    textBtn = '/';
                _this.execBtn(textBtn);
            });
            _this.addEventListenerAll(btn, 'mouseover mouseup mousedown', function () {
                btn.style.cursor = 'pointer';
            });
        });
    };
    Calculator.prototype.setDisplayDateTime = function () {
        this.date = this.currentDate.toLocaleDateString(this._locale);
        this.hour = this.currentDate.toLocaleTimeString(this._locale);
    };
    Object.defineProperty(Calculator.prototype, "display", {
        // Getters & Setters
        get: function () {
            var _a;
            return (_a = this._display) === null || _a === void 0 ? void 0 : _a.innerHTML;
        },
        set: function (value) {
            this._display.innerHTML = (value.length > 9) ? 'Error' : value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Calculator.prototype, "currentDate", {
        get: function () {
            return new Date();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Calculator.prototype, "date", {
        get: function () {
            return this._date.innerHTML;
        },
        set: function (value) {
            this._date.innerHTML = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Calculator.prototype, "hour", {
        get: function () {
            return this._hour.innerHTML;
        },
        set: function (value) {
            this._hour.innerHTML = value;
        },
        enumerable: true,
        configurable: true
    });
    return Calculator;
}());
var calc = new Calculator;
