import { clearFolders, nodejs } from "esbuild-helpers";
import path from "path";

export const makeAllPackagesExternalPlugin = {
    name: "make-all-packages-external",
    setup(build) {
        const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]|^@rad-common|^@rad-api/; // Must not start with "/" or "./" or "../"
        build.onResolve({ filter }, (args: any) => {
            switch (args.path) {
                case "@rad-common":
                    return {
                        path: path.resolve(__dirname, "../rad-common/src/index.ts"),
                        external: false
                    };
                case "@rad-api":
                    return {
                        path: path.resolve(__dirname, "../rad-common/src/default_api_config/getDefaultConfig.ts"),
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

clearFolders("dist");

/**
 * nodejs bundle
 */
nodejs(null, {
    color: true,
    define: {
        DEVELOPMENT: "false"
    },
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/index.js",
    minify: true,
    target: "node14",
    bundle: true,
    plugins: [makeAllPackagesExternalPlugin],
    platform: "node",
    sourcemap: false,
    logLevel: "error",
    incremental: false
});
