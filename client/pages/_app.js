
import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.min.css'
import '../public/css/styles.css'
import TopNav from '../components/TopNav'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from '../context/auth';



const _app = ({ Component, pageProps }) => {

    return (
        <>
            <AuthProvider>
                <ToastContainer />
                <TopNav />
                <Component {...pageProps} />
            </AuthProvider>
        </>

    )
}

export default _app