import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';
import { AVATARS_BASE_PATH } from '../constants';
import { useAccessToken } from './useAccessToken';
import useAuth from './useAuth';

const LOGIN_MUTATION = gql`
    mutation SignIn($loginUserInput: LoginUserInput!) {
        loginUser(loginUserInput: $loginUserInput) {
            accessToken
            refreshToken
        }
    }
`;

export const useLoginMutation = () => {
    const { setAccessToken } = useAccessToken();
    const navigate = useNavigate();

    const [mutation, mutationResults] = useMutation(LOGIN_MUTATION, {
        onCompleted: ({ loginUser }) => {
            setAccessToken(loginUser.accessToken);
            navigate('/', { replace: true });
        },
    });

    const login = (email, password) => {
        return mutation({
            variables: {
                loginUserInput: { email, password },
            },
        });
    };

    return [login, mutationResults] as const;
};
