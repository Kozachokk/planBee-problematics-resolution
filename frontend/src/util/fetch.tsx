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

export function post(path: string, body: string, callback: (data:any) => void, callbackFail: (error: string) => void){
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
                refresh(() => post(path, body, callback, callbackFail), callbackFail);
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
        callbackFail(error);
    })
}

export function get(path: string, callback: (data:any) => void, callbackFail: (error: string) => void){
    const headers: RequestInit = {
        method: "GET",
        credentials: "include"
    }

    fetch(import.meta.env.VITE_BASE_API_URL + path, headers)
    .then(async response => {
        if(!response.ok){
            if(response.status === 401) {
                refresh(() => get(path, callback, callbackFail), callbackFail);
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
        callbackFail(error);
    })
}