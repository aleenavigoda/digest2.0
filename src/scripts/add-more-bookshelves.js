
// Compiled version of the TS script for easier execution
const { exec } = require('child_process');

console.log('Compiling and running the add-more-bookshelves.ts script...');

// First compile the TypeScript file using the project's tsconfig
exec('npx tsc -p tsconfig-scripts.json src/scripts/add-more-bookshelves.ts --outDir dist', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error compiling script: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Compilation stderr: ${stderr}`);
  }
  
  // Now run the compiled JavaScript file with Node
  console.log('Running the script to add more bookshelves...');
  exec('node dist/scripts/add-more-bookshelves.js', (err, out, stdErr) => {
    if (err) {
      console.error(`Error running script: ${err.message}`);
      return;
    }
    console.log(out);
    if (stdErr) {
      console.error(`Runtime stderr: ${stdErr}`);
    }
    console.log('Script execution completed.');
  });
});
