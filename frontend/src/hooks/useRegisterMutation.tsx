import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
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
    const [password, setPassword] = useState('');
    const [login] = useLoginMutation();

    const [mutation, mutationResults] = useMutation(REGISTER_MUTATION, {
        onCompleted: ({ createUser }) => {
            login(createUser.email, password);
        },
    });

    const register = (createUserInput: CreateUserInput) => {
        setPassword(createUserInput.password);
        return mutation({
            variables: {
                createUserInput: createUserInput,
            },
        });
    };

    return [register, mutationResults] as const;
};