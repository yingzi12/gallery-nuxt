import {tansParams} from "~/server/utils/urlUtils";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event)

    const response = await fetch(config.public.baseUrl+`/userImage/list?${tansParams(query)}`);
    const dataJson = await response.json();
    return {
        code:dataJson.code,
        message: dataJson.msg,
        data: dataJson.data,
        total: dataJson.total,
    };
});
