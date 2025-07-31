// src/utils/formulaEvaluator.ts

/**
 * Safely evaluates a mathematical formula string by replacing variable placeholders
 * with their numeric values.
 *
 * @param formula - The formula string to evaluate (e.g., "[CTC*50/100]", "[BASIC*12/100]").
 * @param variables - An object where keys are variable names (e.g., "CTC", "BASIC")
 * and values are their corresponding numbers.
 * @returns The calculated result as a number. Returns 0 if the formula is invalid or
 * an error occurs.
 */
export const evaluateFormula = (
    formula: string,
    variables: { [key: string]: number }
  ): number => {
    // 1. Clean the formula string by removing the square brackets.
    // Example: "[CTC*50/100]" becomes "CTC*50/100"
    let expression = formula.replace(/[\[\]]/g, "");
  
    // 2. Substitute all variable placeholders in the expression with their actual numeric values.
    // We loop through all available variables (like CTC, BASIC, etc.).
    for (const key in variables) {
      if (Object.prototype.hasOwnProperty.call(variables, key)) {
        // Using a regular expression ensures we replace all occurrences of the variable.
        const regex = new RegExp(key, "g");
        expression = expression.replace(regex, String(variables[key]));
      }
    }
  
    // 3. Safely evaluate the final mathematical expression.
    // After substitution, the expression should only contain numbers and math operators
    // (e.g., "7574*50/100" or "7574*0.12").
    // Using the `Function` constructor is a safer alternative to `eval()`. It prevents
    // the expression from accessing variables outside its own scope.
    try {
      // This creates and immediately calls a new function that returns the result of the expression.
      const result = new Function("return " + expression)();
      
      // Check if the result is a valid number; if not, return 0.
      if (isNaN(result) || !isFinite(result)) {
        return 0;
      }
  
      return result;
    } catch (error) {
      // If the expression is malformed (e.g., "5*/2"), an error will be thrown.
      console.error(`Error evaluating formula: "${formula}"`, error);
      // Return 0 to prevent the application from crashing.
      return 0;
    }
  };