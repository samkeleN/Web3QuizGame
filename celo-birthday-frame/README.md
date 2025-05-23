## Resolving Dependency Conflicts

If you encounter a dependency conflict error during `npm install`, you can bypass peer dependency issues by using the following command:

```sh
npm install --legacy-peer-deps
```

This will allow the installation to proceed even if there are peer dependency version mismatches.

## Running the Project

After installing dependencies, start the development server with:

```sh
npm run dev
```

This will launch the app in development mode.
