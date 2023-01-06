import { gql, useQuery } from '@apollo/client';

export const CURRENT_USER_QUERY = gql`
    query GetUser {
        whoami {
            id
            name
            role
            email
            avatar_url
        }
    }
`;

export const useUserQuery = () => useQuery(CURRENT_USER_QUERY, { fetchPolicy: 'network-only' });
