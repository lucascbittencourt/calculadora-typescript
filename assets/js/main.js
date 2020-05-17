"use strict";
class Calculator {
    constructor() {
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
    initialize() {
        this.setDisplayDateTime();
        setInterval(() => this.setDisplayDateTime(), 1000);
        this.setNumberToDisplay();
        document.querySelectorAll('#btn-ac').forEach((btn) => {
            btn.addEventListener('dblclick', () => this.toggleAudio());
        });
    }
    toggleAudio() {
        this._audioOnOff = !this._audioOnOff;
    }
    playAudio() {
        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }
    addEventListenerAll(element, events, fn) {
        events.split(" ").forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }
    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setNumberToDisplay();
    }
    clearEntry() {
        this._operation.pop();
        this.setNumberToDisplay();
    }
    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }
    isOperator(value) {
        return ['+', '-', '*', '%', '/'].indexOf(value) > -1;
    }
    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc();
        }
    }
    getResult() {
        try {
            return eval(this._operation.join(''));
        }
        catch (e) {
            setTimeout(() => this.setError(), 1);
        }
    }
    calc() {
        let last = '';
        this._lastOperator = this.getLastItem();
        if (this._operation.length < 3) {
            let firstNumber = this._operation[0];
            this._operation = [firstNumber, this._lastOperator, this._lastNumber];
        }
        if (this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        }
        else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);
        }
        let result = this.getResult();
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
    }
    getLastItem(isOperator = true) {
        let lastItem;
        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }
        if (!lastItem) {
            lastItem = isOperator ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }
    setNumberToDisplay() {
        let lastNumber = this.getLastItem(false);
        if (!lastNumber)
            lastNumber = 0;
        this.display = lastNumber;
    }
    addOperation(value) {
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
            let newValue = this.getLastOperation().toString() + value;
            this.isOperator(value) ? this.pushOperation(value) : this.setLastOperation(newValue);
            this.setNumberToDisplay();
        }
    }
    setError() {
        this._display.innerHTML = 'Error';
    }
    addDot() {
        let lastOperation = this.getLastOperation();
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1)
            return;
        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        }
        else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setNumberToDisplay();
    }
    execBtn(value) {
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
    }
    initButtonsEvents() {
        let buttons = document.querySelectorAll(".buttons");
        buttons.forEach((btn) => {
            this.addEventListenerAll(btn, 'click drag ', () => {
                let textBtn = btn.innerHTML;
                this.execBtn(textBtn);
            });
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', () => {
                btn.style.cursor = 'pointer';
            });
        });
    }
    setDisplayDateTime() {
        this.date = this.currentDate.toLocaleDateString(this._locale);
        this.hour = this.currentDate.toLocaleTimeString(this._locale);
    }
    // Getters & Setters
    get display() {
        var _a;
        return (_a = this._display) === null || _a === void 0 ? void 0 : _a.innerHTML;
    }
    set display(value) {
        this._display.innerHTML = (value.length > 9) ? 'Error' : value;
    }
    get currentDate() {
        return new Date();
    }
    get date() {
        return this._date.innerHTML;
    }
    set date(value) {
        this._date.innerHTML = value;
    }
    get hour() {
        return this._hour.innerHTML;
    }
    set hour(value) {
        this._hour.innerHTML = value;
    }
}
const calc = new Calculator;
//# sourceMappingURL=main.js.map