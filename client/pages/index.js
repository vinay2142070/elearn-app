
import axios from "axios";
import CourseCard from '../components/cards/CourseCard.js'

const Index = ({ courses }) => {
    // const [courses, setCourses] = useState([]);

    // useEffect(() => {
    //   const fetchCourses = async () => {
    //     const { data } = await axios.get("/api/courses");
    //     setCourses(data);
    //   };
    //   fetchCourses();
    // }, []);

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">
                Elearn - Online Education Marketplace
            </h1>
            <title>Elearn - Online Education Marketplace </title>
            <div className="container-fluid">
                <div className="row">




                    {courses.map((course) => (
                        <div key={course._id} className="col-md-4">
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export async function getServerSideProps() {
    const { data } = await axios.get(`${process.env.API}/courses`);

    return {
        props: {
            courses: data,
        },
    };
}

export default Index;
