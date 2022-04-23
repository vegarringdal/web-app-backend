import { clearFolders, nodejs } from "esbuild-helpers";
import { config } from "dotenv";
import path from "path";

export const makeAllPackagesExternalPlugin = {
    name: "make-all-packages-external",
    setup(build) {
        const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]|^@rad-common/; // Must not start with "/" or "./" or "../"
        build.onResolve({ filter }, (args: any) => {
            switch (args.path) {
                case "@rad-common":
                    return {
                        path: path.resolve(__dirname, "../rad-common/src/index.ts"),
                        external: false
                    };
                default:
                    return {
                        path: args.path,
                        external: true
                    };
                    break;
            }
        });
    }
};

// add env files - only used in development-
config({ path: "../.env" });

// clear dist
clearFolders("dist");

/**
 * nodejs bundle
 */
nodejs(
    {
        watch: ["./src/**/*.ts", "../rad-common/**/*.ts"],
        launch: true,
        launchArg: { argsBefore: ["--inspect"] } //--inspect-brk to force debugging, PS!you need to start debugger
    },
    {
        color: true,
        define: {
            DEVELOPMENT: "true"
        },
        entryPoints: ["./src/index.ts"],
        outfile: "./dist/index.js",
        minify: false,
        target: "node14",
        bundle: true,
        plugins: [makeAllPackagesExternalPlugin],
        platform: "node",
        sourcemap: true,
        logLevel: "error",
        incremental: true
    }
);
