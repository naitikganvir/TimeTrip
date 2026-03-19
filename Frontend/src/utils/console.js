class Console {
  static log(...args) {
    if (import.meta.env.VITE_ENVIRONMENT === "development") {
      console.log(...args);
    }
  }
  
  static prod(...args) {
    if (import.meta.env.VITE_ENVIRONMENT === "production") {
      console.log(...args);
    }
  }

  static error(...args) {
    console.error(...args);
  }
}

export default Console;
