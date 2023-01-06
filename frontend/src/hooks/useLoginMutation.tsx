import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';
import { useAccessToken } from './useAccessToken';
import useAuth from './useAuth';
import { CURRENT_USER_QUERY } from './useUserQuery';

const LOGIN_MUTATION = gql`
    mutation SignIn($loginUserInput: LoginUserInput!) {
        loginUser(loginUserInput: $loginUserInput) {
            access_token
        }
    }
`;

export const useLoginMutation = () => {
    const { setAccessToken } = useAccessToken();
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [mutation, mutationResults] = useMutation(LOGIN_MUTATION, {
        onCompleted: ({ loginUser }) => {
            setAccessToken(loginUser.access_token);
        },
        // refetchQueries: [{ query: CURRENT_USER_QUERY }, 'GetUser'],
    });

    const login = (email, password) => {
        return mutation({
            variables: {
                loginUserInput: { email, password },
            },
            update(proxy, { data: { whoami: userData } }) {
                setUser(userData);
                navigate('/board/tasks', { replace: true });
            },
        });
    };

    return [login, mutationResults] as const;
};
