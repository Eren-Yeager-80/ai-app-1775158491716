import React, { useState, useCallback } from 'react';
    import { Delete } from 'lucide-react';

    const App = () => {
      const [displayValue, setDisplayValue] = useState('0');
      const [firstOperand, setFirstOperand] = useState<number | null>(null);
      const [operator, setOperator] = useState<string | null>(null);
      const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

      const inputDigit = useCallback((digit: string) => {
        if (waitingForSecondOperand) {
          setDisplayValue(digit);
          setWaitingForSecondOperand(false);
        } else {
          setDisplayValue(prev => (prev === '0' ? digit : prev + digit));
        }
      }, [waitingForSecondOperand]);

      const inputDecimal = useCallback(() => {
        if (waitingForSecondOperand) {
          setDisplayValue('0.');
          setWaitingForSecondOperand(false);
          return;
        }
        if (!displayValue.includes('.')) {
          setDisplayValue(prev => prev + '.');
        }
      }, [displayValue, waitingForSecondOperand]);

      const clearAll = useCallback(() => {
        setDisplayValue('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
      }, []);

      const clearEntry = useCallback(() => {
        setDisplayValue('0');
      }, []);

      const performOperation = useCallback((nextOperator: string) => {
        const inputValue = parseFloat(displayValue);

        if (firstOperand === null && !isNaN(inputValue)) {
          setFirstOperand(inputValue);
        } else if (operator) {
          const result = calculate(firstOperand!, inputValue, operator);
          setDisplayValue(String(result));
          setFirstOperand(result);
        }

        setWaitingForSecondOperand(true);
        setOperator(nextOperator);
      }, [displayValue, firstOperand, operator]);

      const calculate = (first: number, second: number, op: string) => {
        switch (op) {
          case '+':
            return first + second;
          case '-':
            return first - second;
          case '*':
            return first * second;
          case '/':
            return first / second;
          default:
            return second;
        }
      };

      const handleEquals = useCallback(() => {
        const inputValue = parseFloat(displayValue);

        if (firstOperand === null || operator === null || waitingForSecondOperand) {
          return;
        }

        const result = calculate(firstOperand, inputValue, operator);
        setDisplayValue(String(result));
        setFirstOperand(result);
        setOperator(null);
        setWaitingForSecondOperand(true); // Ready for a new calculation or chain operation
      }, [displayValue, firstOperand, operator, waitingForSecondOperand]);

      const toggleSign = useCallback(() => {
        setDisplayValue(prev => String(parseFloat(prev) * -1));
      }, []);

      const backspace = useCallback(() => {
        setDisplayValue(prev => {
          if (prev.length === 1 || (prev.length === 2 && prev.startsWith('-'))) {
            return '0';
          }
          return prev.slice(0, -1);
        });
      }, []);

      const renderButton = (label: string, className = '', onClick: () => void, icon?: React.ElementType) => (
        <button
          key={label}
          className={`
            flex items-center justify-center
            text-2xl font-semibold p-4 rounded-xl
            bg-gray-700 text-white
            hover:bg-gray-600 active:bg-gray-500
            transition-colors duration-200 ease-in-out
            ${className}
          `}
          onClick={onClick}
        >
          {icon ? React.createElement(icon, { size: 28 }) : label}
        </button>
      );

      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl shadow-2xl bg-gray-900 p-6 space-y-4 border border-purple-700/50">
            {/* Display */}
            <div className="relative h-24 bg-purple-900/40 rounded-xl flex items-center justify-end px-6 text-white text-5xl font-light overflow-hidden shadow-inner-lg border border-purple-500/30">
              <span className="truncate">{displayValue}</span>
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-4 gap-3">
              {renderButton('C', 'bg-purple-600 hover:bg-purple-500', clearAll)}
              {renderButton('CE', 'bg-purple-600 hover:bg-purple-500', clearEntry)}
              {renderButton('±', 'bg-purple-600 hover:bg-purple-500', toggleSign)}
              {renderButton('/', 'bg-pink-600 hover:bg-pink-500', () => performOperation('/'))}

              {renderButton('7', '', () => inputDigit('7'))}
              {renderButton('8', '', () => inputDigit('8'))}
              {renderButton('9', '', () => inputDigit('9'))}
              {renderButton('*', 'bg-pink-600 hover:bg-pink-500', () => performOperation('*'))}

              {renderButton('4', '', () => inputDigit('4'))}
              {renderButton('5', '', () => inputDigit('5'))}
              {renderButton('6', '', () => inputDigit('6'))}
              {renderButton('-', 'bg-pink-600 hover:bg-pink-500', () => performOperation('-'))}

              {renderButton('1', '', () => inputDigit('1'))}
              {renderButton('2', '', () => inputDigit('2'))}
              {renderButton('3', '', () => inputDigit('3'))}
              {renderButton('+', 'bg-pink-600 hover:bg-pink-500', () => performOperation('+'))}

              {renderButton('0', 'col-span-2', () => inputDigit('0'))}
              {renderButton('.', '', inputDecimal)}
              {renderButton('=', 'bg-indigo-600 hover:bg-indigo-500', handleEquals)}
            </div>
             {/* Backspace Button outside the main grid for distinct look */}
            <div className="flex justify-center mt-4">
              {renderButton('DEL', 'bg-gray-800 hover:bg-gray-700 w-full', backspace, Delete)}
            </div>
          </div>
        </div>
      );
    };

    export default App;