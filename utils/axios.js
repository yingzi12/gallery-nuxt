// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL:"https://gallery-nuxt.vercel.app",
    baseURL:"https://www.51x.uk",
    withCredentials: true
});

// 请求拦截器
axiosInstance.interceptors.request.use(config => {
    
    const tokenCookie = useCookie('token');
    const token = tokenCookie.value;
    //console.log(`-------------------请求---${config.url}----token:-${token}---userStore:${tokenCookie}-`)
    // //console.log(!token)
    if (config.url.startsWith('/api/admin')) {
        // router.push("/login")
        // 清空 cookie
        // 注：这里的具体实现取决于您如何管理 cookie
        // 例如：document.cookie = 'token=; Max-Age=0';

        if(!token){
            // 重定向到登录页面
            // 注：这里的重定向实现取决于您的路由设置
            // 例如：window.location.href = '/login';
            // 清空 token 或其他认证数据
            // 
            // userStore.clearUser();  // 假设 clearToken 是清空 token 的方法
            // 重定向到登录页面
            window.location.href = '/login';
            // //console.log(`-----------login--------请求---${config.url}-----${token}----`)
        }
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
axiosInstance.interceptors.response.use(response => {

    //console.log("-------------------处理响应数据------------")
    //console.log(response.data.code === 401)
    const tokenCookie = useCookie('token');
    const token = tokenCookie.value;
    //console.log(`-----------处理响应数据--------请求---${response.config.url}---------`)

    // 检查错误响应并执行特定操作
    if (response.config.url.startsWith('/api/admin') && response.data.code === 401) {
        // router.push("/login")
        // 清空 cookie
        // 注：这里的具体实现取决于您如何管理 cookie
        // 例如：document.cookie = 'token=; Max-Age=0';

        // 重定向到登录页面
        // 注：这里的重定向实现取决于您的路由设置
        // 例如：window.location.href = '/login';
        // 清空 token 或其他认证数据
        
        // userStore.clearUser();  // 假设 clearToken 是清空 token 的方法

        const tokenCookie = useCookie('token');
        tokenCookie.value=null;
        const idCookie = useCookie('id');
        idCookie.value=null;
        const userCookie = useCookie('userInfo');
        userCookie.value=null;
        //重定向到登录页面
        window.location.href = '/login';
        //console.log(`-----------处理响应数据--------请求---${response.config.url}-----${token}----`)

    }
    // 处理响应数据
    return response;
}, error => {
    // 处理响应错误
    // 可以在这里处理 401 等错误状态
    return Promise.reject(error);
});

export default axiosInstance;
