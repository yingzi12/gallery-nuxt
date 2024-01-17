import {tansParams} from "~/server/utils/urlUtils";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event)
     // 获取请求头
    const headers = event.req.headers;
    // 从请求头中获取 token
    const token = headers.authorization ? headers.authorization.split(' ')[1] : null;
    // Use the GET parameters to make a GET request to `/album/list`
    const response = await fetch(config.public.baseUrl+`/admin/userVideo/list?${tansParams(query)}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    const dataJson = await response.json();
    const sourceWeb=config.public.sourceWeb;
    let list= dataJson.data;
    if(list!=null) {
        for (let image of list) {
            try {
                image.url = await getBase64FromImageUrl(sourceWeb + image.imgUrl);
            } catch (error) {
                console.error(`Error converting image:${image.url}`);
                image.url = ""; // 如果发生错误，则设置为空字符串
            }
        }
    }else{
        list=[];
    }
    // //console.log(dataJson.data)
    return {
        code:dataJson.code,
        message: "Album list retrieved!",
        data: list,
        total: dataJson.total,
    };
});
