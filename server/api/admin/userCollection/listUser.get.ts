import {tansParams} from "~/server/utils/urlUtils";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event)
    // 获取请求头
    const headers = event.req.headers;
    // 从请求头中获取 token
    const token = headers.authorization ? headers.authorization.split(' ')[1] : null;
    const response = await fetch(config.public.baseUrl+`/admin/userCollection/listUser?${tansParams(query)}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    const dataJson = await response.json();
    //console.log("dataJson.data end")
    return {
        code:dataJson.code,
        message: dataJson.msg,
        data: dataJson.data,
        total: dataJson.total,
    };
});
