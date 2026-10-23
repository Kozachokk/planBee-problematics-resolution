export function refresh(callback: () => void, callbackFail: (error: string) => void){
    const headers: RequestInit = {
    method: "GET",
    credentials: "include"
    }
    fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/refresh`, headers)
        .then(async response => {
            if(!response.ok){
                return Promise.reject(await response.text())
            }
            callback()
        })
        .catch(error => {
            callbackFail(error);
        }
    )
}

export function fetchPost(path: string, body: string, callback: (data:any) => void, errorCallback: (error: string) => void){
    const headers: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: body
    }

    fetch(import.meta.env.VITE_BASE_API_URL + path, headers)
    .then(async response => {
        if(!response.ok){
            if(response.status == 401) {
                refresh(() => fetchPost(path, body, callback, errorCallback), errorCallback);
                return;
            }
            else{
                return Promise.reject(await response.text())
            }
        }

        const isJSON = response.headers.get('content-type')?.includes('application/json');
        const responseJson = isJSON && await response.json();

        callback(responseJson);

    })
    .catch(error => {
        errorCallback(error);
    })
}

export function fetchGet(path: string, callback: (data:any) => void, errorCallback: (error: string) => void){
    const headers: RequestInit = {
        method: "GET",
        credentials: "include"
    }

    fetch(import.meta.env.VITE_BASE_API_URL + path, headers)
    .then(async response => {
        if(!response.ok){
            if(response.status === 401) {
                refresh(() => fetchGet(path, callback, errorCallback), errorCallback);
                return;
            }
            else{
                return Promise.reject(await response.text())
            }
        }

        const isJSON = response.headers.get("content-type")?.includes('application/json');
        const responseJson = isJSON && await response.json();

        callback(responseJson);
    })
    .catch(error => {
        errorCallback(error);
    })
}

export function fetchDelete(path: string, deleteId: number, callback: (data: any) => void, errorCallback: (error: string) => void){
    const headers: RequestInit = {
        method: "DELETE",
        credentials: "include"
    }

    fetch(import.meta.env.VITE_BASE_API_URL + path + "/" + deleteId, headers)
    .then(async response => {
        if(!response.ok){
            if(response.status === 401) {
                refresh(() => fetchDelete(path, deleteId, callback, errorCallback), errorCallback);
                return;
            }
            else{
                return Promise.reject(await response.text())
            }
        }

        const isJSON = response.headers.get("content-type")?.includes('application/json');
        const responseJson = isJSON && await response.json();

        callback(responseJson)
    })
    .catch(error => {
        errorCallback(error);
    })
}