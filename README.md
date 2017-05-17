# electron-with-nextjs

A project that spawns a Next.JS app from Electron and uses it to serve it's 
content.

## How To Run

**NOTE**: `next build` does not seem to work when using `material-ui` from a Windows command prompt. In order to make the build succeed you'll need to use the cygwin bash shell instead.

I'll revise this later but want to get something here quickly. The instructions 
to run 'electron-with-nextjs' are almost entirely the same as with my other 
project [electron-with-express](https://github.com/frankhale/electron-with-express#how-to-run).

What differs is that for a production build you need to run 'next build' and
change the the 'production' key in the 'node' section of package.json to true.

For instance (for running in production):

```
  "node": {
    "exe": ".\\node.exe",
    "args": ["server.js"],
    "production": true
  },
```

Then to run you type: `npm run start`

If you just want to run in dev make sure the 'production' key is set to false and then just run it with `npm run start`

## Author(s)

Frank Hale &lt;frankhale@gmail.com&gt;  
17 May 2017

## License

GNU GPL v3 - see [LICENSE](LICENSE)
