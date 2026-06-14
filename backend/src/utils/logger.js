const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgMagenta: "\x1b[45m",
  bgGreen: "\x1b[42m",
};

export const logger = {
  error: (msg) => console.log(`${C.red}${C.bold}✗${C.reset} ${C.red}${msg}${C.reset}`),
  warn: (msg) => console.log(`${C.yellow}⚠${C.reset} ${C.yellow}${msg}${C.reset}`),
};

export function printStartup({ port, dbName, bootMs }) {
  const url = `http://localhost:${port}`;

  console.log("");
  console.log(
    `${C.magenta}${C.bold}  ⚡ System Auto API${C.reset}  ${C.dim}·${C.reset}  ${C.cyan}port ${port}${C.reset}`
  );
  console.log(
    `${C.green}  ✓${C.reset} ${C.white}MongoDB${C.reset} ${C.dim}→${C.reset} ${C.yellow}${dbName}${C.reset}  ${C.dim}(${bootMs}ms)${C.reset}`
  );
  console.log(
    `${C.green}  ✓${C.reset} ${C.white}Ready${C.reset}   ${C.dim}→${C.reset} ${C.cyan}${C.bold}${url}${C.reset}`
  );
  console.log("");
}

export function printShutdown() {
  console.log(`\n${C.yellow}  ↓ Server stopped${C.reset}\n`);
}
