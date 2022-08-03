import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
    AppstoreOutlined,
    CoffeeOutlined,
    LoginOutlined,
    LogoutOutlined,
    UserAddOutlined,
    CarryOutOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../context/auth.js";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
    const [current, setCurrent] = useState("");

    const { state, dispatch } = useContext(AuthContext);
    const { user } = state;

    const router = useRouter();

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    const logout = async () => {
        dispatch({ type: "LOGOUT" });
        window.localStorage.removeItem("user");
        const { data } = await axios.get("/api/logout");
        toast.success(data.message);
        router.push("/login");
    };

    return (
        <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[current]}
            className="d-flex sticky-top"
        >
            <Item
                key="/"
                onClick={(e) => setCurrent(e.key)}
                icon={<AppstoreOutlined />}
            >
                <Link href="/">
                    <a>Elearn</a>
                </Link>
            </Item>

            {user && user.role && user.role.includes("Instructor") ? (
                <Item
                    // className="ml-auto"
                    key="/instructor/course/create"
                    onClick={(e) => setCurrent(e.key)}
                    icon={<CarryOutOutlined />}
                >
                    <Link href="/instructor/course/create">
                        <a>Create Course</a>
                    </Link>
                </Item>
            ) : (
                <Item

                    key="/user/become-instructor"
                    onClick={(e) => setCurrent(e.key)}
                    icon={<TeamOutlined />}
                >
                    <Link href="/user/become-instructor">
                        <a>Become Instructor</a>
                    </Link>
                </Item>
            )}

            {user === null && (
                <>

                    <Item
                        className="ml-auto"
                        key="/login"
                        onClick={(e) => setCurrent(e.key)}
                        icon={<LoginOutlined />}
                    >
                        <Link href="/login">
                            <a>Login</a>
                        </Link>
                    </Item>
                    <Item

                        key="/register"
                        onClick={(e) => setCurrent(e.key)}
                        icon={<UserAddOutlined />}
                    >
                        <Link href="/register">
                            <a>Register</a>
                        </Link>
                    </Item>


                </>
            )}



            {user && user.role && user.role.includes("Instructor") && (
                <Item

                    key="/instructor"
                    onClick={(e) => setCurrent(e.key)}
                    icon={<TeamOutlined />}
                // className="ml-auto"
                >
                    <Link href="/instructor">
                        <a>Instructor</a>
                    </Link>
                </Item>
            )}

            {user !== null && (
                <SubMenu
                    icon={<CoffeeOutlined />}
                    title={user && user.name}
                    className='ml-auto'

                >
                    <ItemGroup>
                        <Item key="/user">
                            <Link href="/user">
                                <a>My Learning</a>
                            </Link>
                        </Item>
                        <Item onClick={logout}>Logout</Item>
                    </ItemGroup>
                </SubMenu>
            )}
        </Menu>
    );
};

export default TopNav;
