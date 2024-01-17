export default defineSitemapEventHandler(async (e) => {
    const config = useRuntimeConfig();
    const posts = await Promise.all([
        {
            _path: '/blog/post-a',
            modifiedAt: new Date(),
        },
        {
            _path: '/blog/post-b',
            modifiedAt: new Date(),
        },
        {
            _path: '/blog/post-c',
            modifiedAt: new Date(),
        },
    ]);
    let urls=[];
    for(let i=1;i<10;i++) {
        const response = await fetch(config.public.baseUrl+`/album/list?pageNum=`+i.toString()+`&pageSize=20&title=秀人网`);
        const dataJson = await response.json();
        if (dataJson.code == 200) {
            // 假设API返回的是URL数组
            urls.push(...dataJson.data.map((item: { id: any; }) => ({
                _path: `/detail?aid=${item.id}`,
                modifiedAt: new Date(),
                _sitemap: 'pages',
            })));
        } else {
            console.error('API Error:', dataJson.message);
        }
    }
    for(let i=1;i<10;i++) {
        const response = await fetch(config.public.baseUrl+`/album/list?pageNum=`+i.toString());
        const dataJson = await response.json();
        if (dataJson.code == 200) {
            // 假设API返回的是URL数组
            urls.push(...dataJson.data.map((item: { id: any; }) => ({
                _path: `/detail?aid=${item.id}`,
                modifiedAt: new Date(),
                _sitemap: 'pages',
            })));
        } else {
            console.error('API Error:', dataJson.message);
        }
    }
    for(let i=1;i<10;i++) {
        const response = await fetch(config.public.baseUrl+`/album/listSee?pageNum=`+i.toString());
        const dataJson = await response.json();
        if (dataJson.code == 200) {
            // 假设API返回的是URL数组
            urls.push(...dataJson.data.map((item: { id: any; }) => ({
                _path: `/detail?aid=${item.id}`,
                modifiedAt: new Date(),
                _sitemap: 'pages',
            })));
        } else {
            console.error('API Error:', dataJson.message);
        }
    }
    return urls.map((p) => {
        return {
            loc: p._path,
            lastmod: p.modifiedAt,
        };
    });
});
