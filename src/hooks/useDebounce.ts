// import { useState, useEffect } from 'react';

// /**
//  * A custom hook that debounces a value.
//  * @param value The value to debounce.
//  * @param delay The debounce delay in milliseconds.
//  * @returns The debounced value.
//  */
// function useDebounce<T>(value: T, delay: number): T {
//   // State to store the debounced value
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);

//   useEffect(() => {
//     // Set up a timer to update the debounced value after the specified delay
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     // Clean up the timer if the value changes before the delay has passed
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]); // Only re-call effect if value or delay changes

//   return debouncedValue;
// }

// export default useDebounce;
import { useState, useEffect } from 'react';

/**
 * A custom hook that debounces and trims a value.
 * @param value The value to debounce. If it's a string, it will be trimmed.
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced and trimmed value.
 */
function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      // Before setting the value, check if it is a string.
      // If it is, trim the whitespace from the start and end.
      const processedValue = typeof value === 'string' ? value.trim() : value;
      
      // Update the debounced value with the processed value.
      // We cast it back to T, which is safe because if T was a string,
      // a trimmed string is still a string.
      setDebouncedValue(processedValue as T);
    }, delay);

    // Clean up the timer if the value or delay changes before the delay has passed
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect if value or delay changes

  return debouncedValue;
}

export default useDebounce;