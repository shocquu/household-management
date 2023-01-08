import { gql, useQuery } from '@apollo/client';

export const CURRENT_USER_QUERY = gql`
    query GetUser {
        whoami {
            id
            role
            email
            avatarUrl
            displayName
        }
    }
`;

export const useUserQuery = () => useQuery(CURRENT_USER_QUERY, { fetchPolicy: 'network-only' });
