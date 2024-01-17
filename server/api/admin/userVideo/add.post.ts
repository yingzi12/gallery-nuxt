
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
     // 获取请求头
    const headers = event.req.headers;
    // 从请求头中获取 token
    const token = headers.authorization ? headers.authorization.split(' ')[1] : null;
    const body = await readBody(event)

    // Use the GET parameters to make a GET request to `/album/list`
    const response = await fetch(config.public.baseUrl+`/admin/userVideo/add`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
