import {tansParams} from "~/server/utils/urlUtils";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const response = await fetch(config.public.baseUrl+`/album/random`);
    const dataJson = await response.json();
     // //console.log(dataJson.data)
    return {
        code:dataJson.code,
        message: "Album list retrieved!",
        data: dataJson.data,
        total: dataJson.total,
    };
});
