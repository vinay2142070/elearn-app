
import { createContext, useReducer, useEffect } from "react"
import axios from 'axios'
import { useRouter } from "next/router";


const initialState = {
    user: null
}
//create context
const AuthContext = createContext()


//create reducer 
const authReducer = (state, action) => {

    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload
            }

        case "LOGOUT":
            return {
                ...state,
                user: null
            }


        default:
            return state;
    }
}


//create provider

const AuthProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, initialState)
    const router = useRouter();

    //page refresh user details to be fetch from localstorage and put in state
    useEffect(() => {
        dispatch(
            {
                type: 'LOGIN',
                payload: JSON.parse(window.localStorage.getItem('user'))
            }
        )
    }, [])

    axios.interceptors.response.use(
        function (response) {
            // any status code that lie within the range of 2XX cause this function
            // to trigger
            return response;
        },
        function (error) {
            // any status codes that falls outside the range of 2xx cause this function
            // to trigger
            let res = error.response;

            if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
                return new Promise((resolve, reject) => {
                    axios
                        .get(`${process.env.NEXT_PUBLIC_API}/api/logout`)
                        .then((data) => {
                            console.log("/401 error > logout");
                            dispatch({ type: "LOGOUT" });
                            window.localStorage.removeItem("user");
                            router.push("/login");
                        })
                        .catch((err) => {
                            console.log("AXIOS INTERCEPTORS ERR", err);
                            reject(error);
                        });
                });
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        const getCsrfToken = async () => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/csrf-token`);
            console.log("CSRF", data);
            axios.defaults.headers["X-CSRF-Token"] = data.csrfToken;
        };
        getCsrfToken();
    }, []);


    return <AuthContext.Provider value={{ state, dispatch }}>
        {children}
    </AuthContext.Provider>

}

export { AuthContext, AuthProvider }


