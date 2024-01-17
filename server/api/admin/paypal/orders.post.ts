
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    // 获取请求头
    const headers = event.req.headers;
    const change= headers.change ? headers.change:"pc";
    // 从请求头中获取 token
    const token = headers.authorization ? headers.authorization.split(' ')[1] : null;
    //console.log("----------------------token--------"+token)
    //console.log("--------------------change----------"+change)

    const body = await readBody(event)

    // Use the GET parameters to make a GET request to `/album/list`
    const response = await fetch(config.public.baseUrl+`/admin/payments/create`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'change': `${change}`,
            },
            body: JSON.stringify(body)
        }
    );
    const dataJson = await response.json();
    return {
        code:dataJson.code,
        message: dataJson.message,
        data: dataJson.data,
    };
});
