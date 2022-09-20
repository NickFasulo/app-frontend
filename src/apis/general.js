import callYupApi from "./base_api";

export const postEvent = async (data) =>
    callYupApi({
        url: `/events`,
        method: 'POST',
        data
    });
