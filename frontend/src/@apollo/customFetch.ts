// const customFetch = (uri: string, options: any): Promise<Response> =>
// const {user} = useAuth()
//   let refreshingPromise: Promise<any> | null = null;

//   let request = fetch(uri, options)

//   // The apolloHttpLink expects that fetch function will return a promise.
//   return request
//     .then((response) => {
//       return ({ initialResponse: response.clone(), json: response.json() as any });
//     }).then((res) => {
//       const { initialResponse, json } = res;

//       if (json.error_code === "InvalidSession" || json.error === "invalid session: access token expired") {
//         if (!refreshingPromise) {
//           const refresh_token = user.refreshToken;

//           const address = 'http://localhost:3000/graphql'

//           refreshingPromise = fetch(address, { method: 'POST', headers: { Authorization: refresh_token ? `Bearer ${refresh_token}` : '' } })
//             .then((res) => {
//               if (res.ok) {
//                 return res.json().then((resJSON) => {
//                   let localUser = LSHelper.getLocalUser()
//                   localUser.accessToken = resJSON.access_token;

//                   // Save the new refresh token to store
//                   LSHelper.setLocalUser(localUser);

//                   // Return the new access token as a result of the promise
//                   return resJSON.access_token
//                 })
//               } else {
//                 // If the re-authorization request fails, handle it here.
//                 return res.json().then((resJSON) => {
//                   console.error(resJSON);
//                 })
//               }

//             }).catch(err => {
//               // handle error
//             })

//         }

//         return refreshingPromise.then((newAccessToken) => {
//           // After execution, set it to null
//           refreshingPromise = null;
//           options.headers.authorization = `Bearer ${newAccessToken}`

//           return fetch(uri, options);
//         })
//         .catch((err) => err)
//       }

//       return new Promise((resolve, reject) => {
//           resolve(res.initialResponse);
//         });
//     })
//   }
