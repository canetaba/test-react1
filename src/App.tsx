import React, {useEffect, useState} from 'react';
import axios, {CancelTokenSource} from "axios";

interface IPost {
    pulse: any;
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
            .get<IPost>('https://beacon.nist.gov/beacon/2.0/chain/last/pulse/last', {
                cancelToken: cancelTokenSource.token,
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            })
            .then((response) => {
                setPosts([response.data]);
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
                    <li key={post.pulse.outputValue}>
                        <h3>{post.pulse.outputValue}</h3>
                        <p>{post.pulse.outputValue}</p>
                    </li>
                ))}
            </ul>
            {error && <p className="error">{error}</p>}
        </div>
    );
};
function Example() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = 'You clicked ${count} times';
    });

    return (
        <div>
            <p> You clicked {count} times</p>
            <button onClick ={() => setCount(count + 1 )}>
                Click me
            </button>
        </div>
    );
}

export default App;
