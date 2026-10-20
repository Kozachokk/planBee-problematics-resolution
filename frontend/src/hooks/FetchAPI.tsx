import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useFetchData(apiPath: string, callback: (data:any) => void){
    const navigate = useNavigate();

    useEffect(() => {
        const getUserData = () => {
            const headers: RequestInit = {
            method: "GET",
            credentials: "include"
            }

            fetch(`${import.meta.env.VITE_BASE_API_URL}${apiPath}`, headers)
            .then(async response => {
                const isJSON = response.headers.get("content-type")?.includes('application/json');
                const data = isJSON && await response.json();

                if(!response.ok){
                    return Promise.reject(await response.text())
                }

                callback(data);
            })
            .catch(error => {
                console.error(error);
                if(error == "Not logged in"){
                    refresh();
                    return;
                }

            })
        }

        const refresh = () => {
            const headers: RequestInit = {
            method: "GET",
            credentials: "include"
            }
            fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/refresh`, headers)
                .then(async response => {
                    if(!response.ok){
                        return Promise.reject(await response.text())
                    }

                    getUserData()
                    console.log(await response.text());
                })
                .catch(error => {
                    console.error("Refresh didn't work: " + error)
                    navigate("/login");
                })
        }

        getUserData();
    }, [])
}