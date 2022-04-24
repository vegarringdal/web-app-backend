import { ApiInterface } from "@rad-common";

export function readApiConfig(aniConfig: ApiInterface[]) {
    const apis: ApiInterface[] = aniConfig;
    const errors: [{ apiname: string; errors: string[] }] = [] as any;

    return { apis, errors };
}
