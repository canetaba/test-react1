import React from 'react';
import axios, {CancelTokenSource} from "axios";

/*
import HelloWorld from "./components/HelloWorld";
function App() {
  return (
    <div className="App">
      <HelloWorld />
    </div>
  );
}
 */

interface IPost {
    pulse: Pulse[];

}
interface Pulse {
    outputValue: String;

}

const defaultPosts: IPost[] = [];

const App = () => {
    const [posts, setPosts]: [IPost[], (posts: IPost[]) => void] = React.useState(
        defaultPosts
    );

    const [loading, setLoading]: [
        boolean,
        (loading: boolean) => void
    ] = React.useState<boolean>(true);

    const [error, setError]: [string, (error: string) => void] = React.useState(
        ''
    );

    const cancelToken = axios.CancelToken; //create cancel token
    const [cancelTokenSource, setCancelTokenSource]: [
        CancelTokenSource,
        (cancelTokenSource: CancelTokenSource) => void
    ] = React.useState(cancelToken.source());

    const handleCancelClick = () => {
        if (cancelTokenSource) {
            cancelTokenSource.cancel('User cancelled operation');
        }
    };

    React.useEffect(() => {
        axios
            .get<IPost[]>('https://beacon.nist.gov/beacon/2.0/chain/last/pulse/last', {
                cancelToken: cancelTokenSource.token,
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            })
            .then((response) => {
                setPosts(response.data);
                setLoading(false);
            })
            .catch((ex) => {
                let error = axios.isCancel(ex)
                    ? 'Request Cancelled'
                    : ex.code === 'ECONNABORTED'
                        ? 'A timeout has occurred'
                        : ex.response.status === 404
                            ? 'Resource Not Found'
                            : 'An unexpected error has occurred';

                setError(error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="App">
            {loading && <button onClick={handleCancelClick}>Cancel</button>}
            <ul className="posts">
                {posts.map((post) => (
                    <li key={post.pulse}>
                        <h3>{post.pulse}</h3>
                        <p>{post.pulse}</p>
                    </li>
                ))}
            </ul>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default App;
