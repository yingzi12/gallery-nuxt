
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
     // 获取请求头
    const headers = event.req.headers;
    // 从请求头中获取 token
    const token = headers.authorization ? headers.authorization.split(' ')[1] : null;
    const query = getQuery(event)

    // Use the GET parameters to make a GET request to `/album/list`
    const response = await fetch(config.public.baseUrl+`/admin/userVip/getInfo/`+query.id, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }
        );
    const dataJson = await response.json();
    // //console.log(dataJson.data)
    return {
        code:dataJson.code,
        message: dataJson.message,
        data: dataJson.data,
    };
});
