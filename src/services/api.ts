import axios from 'services/axios.customize';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loginAPI = async (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";
     await delay(3000);

  return axios.post<IBackendRes<ILogin>>(
    urlBackend,
    { username, password },
    // {
    //   headers: {
    //     delay: 3000,
    //   },
    // }
  );
};

export const registerAPI = (fullName: string, email:string,  password: string, phone: string) => {
  const urlBackend = "/api/v1/user/register";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    email,
    password,
    phone,
  });
};


export const fetchAccountAPI = async() => {
  // const urlBackend = "/api/v1/auth/account";
  // return axios.get<IBackendRes<IFetchAccount>>(urlBackend,
  //   {
  //     headers: {
  //       delay: 3000,
  //     },
  //   })
   await delay(1000);
  const urlBackend = "/api/v1/auth/account";
  return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
}

export const logoutAPI = () => {
  const urlBackend = "/api/v1/auth/logout";
  return axios.post<IBackendRes<IRegister>>(urlBackend);
};