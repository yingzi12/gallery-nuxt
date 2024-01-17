export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody(event)
    // //console.log(body)

    // Use the GET parameters to make a GET request to `/album/list`
    const response = await fetch(config.public.baseUrl+`/systemUser/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }
    );
    const dataJson = await response.json();
    return {
        code:dataJson.code,
        message: dataJson.msg,
        user: dataJson.user,
        token: dataJson.token,
    };
});
