export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const query = getQuery(event)

    // Use the GET parameters to make a GET request to `/album/list`
    const response = await fetch(config.public.baseUrl+`/systemUser/logout`);
    const dataJson = await response.json();
    // //console.log(dataJson.data)
    return {
        code:dataJson.code,
        message: dataJson.message,
        data: dataJson.data,
    };
});