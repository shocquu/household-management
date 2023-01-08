import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';
import { useAccessToken } from './useAccessToken';
import useAuth from './useAuth';
import { useLoginMutation } from './useLoginMutation';

const REGISTER_MUTATION = gql`
    mutation SignUp($createUserInput: CreateUserInput!) {
        createUser(createUserInput: $createUserInput) {
            email
            password
            avatarUrl
            displayName
        }
    }
`;

type CreateUserInput = {
    email: string;
    password: string;
    username: string;
    displayName: string;
    avatarUrl: string;
};

export const useRegisterMutation = () => {
    const [login] = useLoginMutation();

    const [mutation, mutationResults] = useMutation(REGISTER_MUTATION, {
        onCompleted: ({ createUser }) => {
            const { email, password } = createUser;
            login(email, password);
        },
    });

    const register = (createUserInput: CreateUserInput) => {
        return mutation({
            variables: {
                createUserInput: createUserInput,
            },
        });
    };

    return [register, mutationResults] as const;
};
