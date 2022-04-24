import { aiWebRestApi } from "../default_api_config/aiWebRestApi";
import { aiWebRoleApi } from "../default_api_config/aiWebRoleApi";
import { aiWebUserApi } from "../default_api_config/aiWebUserApi";
import { aiWebUserRoleApi } from "../default_api_config/aiWebUserRoleApi";

export function getDefaultConfig() {
    return [aiWebRestApi, aiWebRoleApi, aiWebUserApi, aiWebUserRoleApi];
}
