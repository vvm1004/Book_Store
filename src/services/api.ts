import { UploadFile } from "antd";
import axios from "services/axios.customize";

export const loginAPI = (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";
  return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password });
};

export const registerAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user/register";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    email,
    password,
    phone,
  });
};

export const fetchAccountAPI = () => {
  const urlBackend = "/api/v1/auth/account";
  //   return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
  //     headers: {
  //       Delay: 3000,
  //     },
  //   });
  return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
};

export const logoutAPI = () => {
  const urlBackend = "/api/v1/auth/logout";
  return axios.post<IBackendRes<ILogin>>(urlBackend);
};

export const getUsersAPI = (
  current: number,
  pageSize: number,
  query: string,
  sort: string
) => {
  const urlBackend =
    `/api/v1/user?current=${current}&pageSize=${pageSize}` + query + sort;
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
};

export const createUsersAPI = (
  fullName: string,
  password: string,
  email: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user";
  return axios.post<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend, {
    fullName,
    password,
    email,
    phone,
  });
};

export const updateUsersAPI = (
  _id: string,
  fullName: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user";
  return axios.put<IBackendRes<IUserTable>>(urlBackend, {
    _id,
    fullName,
    phone,
  });
};

export const updateInfoAPI = (
  _id: string,
  fullName: string,
  phone: string,
  avatar: string
) => {
  const urlBackend = "/api/v1/user";
  return axios.put<IBackendRes<IUserTable>>(urlBackend, {
    _id,
    fullName,
    phone,
    avatar,
  });
};

export const uploadFileAvatarImg = (fileImg: UploadFile) => {
  const urlBackend = "/api/v1/file/upload";
  const formData = new FormData();
  formData.append("fileImg", fileImg.originFileObj as Blob);

  return axios<IBackendRes<IFileUploadResponse>>({
    method: "post",
    url: urlBackend,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
  });
};

export const changePasswordAPI = (
  email: string,
  oldpass: string,
  newpass: string
) => {
  const urlBackend = "/api/v1/user/change-password";
  return axios.post<IBackendRes<IUserTable>>(urlBackend, {
    email,
    oldpass,
    newpass,
  });
};

export const deleteUsersAPI = (_id: string) => {
  const urlBackend = `/api/v1/user/${_id}`;
  return axios.delete<IBackendRes<IUserTable>>(urlBackend);
};

export const bulkCreateUsersAPI = (users: IBulkCreateUserRequest[]) => {
  const urlBackend = "/api/v1/user/bulk-create";
  return axios.post<IBackendRes<IBulkCreateUserResponse>>(urlBackend, users);
};

export const getBooksAPI = (
  current: number,
  pageSize: number,
  query: string,
  sort: string
) => {
  const urlBackend =
    `/api/v1/book?current=${current}&pageSize=${pageSize}` + query + sort;
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend);
};

export const getCategoryBookAPI = () => {
  const urlBackend = "/api/v1/database/category";
  return axios.get<IBackendRes<string[]>>(urlBackend);
};

export const uploadFileBookImg = (fileImg: UploadFile) => {
  const urlBackend = "/api/v1/file/upload";
  const formData = new FormData();
  formData.append("fileImg", fileImg.originFileObj as Blob);

  return axios<IBackendRes<IFileUploadResponse>>({
    method: "post",
    url: urlBackend,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};

export const createBookAPI = (bookData: IBookData) => {
  const urlBackend = "/api/v1/book";
  return axios.post<IBackendRes<IFileUploadResponse>>(urlBackend, bookData);
};

export const updateBookAPI = (bookData: IBookData, id: string) => {
  const urlBackend = "/api/v1/book" + `/${id}`;
  return axios.put<IBackendRes<IFileUploadResponse>>(urlBackend, bookData);
};

export const deleteBookAPI = (id: string) => {
  const urlBackend = "/api/v1/book" + `/${id}`;
  return axios.delete<IBackendRes<IFileUploadResponse>>(urlBackend);
};

export const getBookAPI = (id: string) => {
  const urlBackend = "/api/v1/book" + `/${id}`;
  return axios.get<IBackendRes<IBookTable>>(urlBackend, {
    headers: {
      Delay: 0,
    },
  });
};

export const createOrderAPI = (cartRequest: ICartRequest) => {
  const urlBackend = "/api/v1/order";
  return axios.post<IBackendRes<IFileUploadResponse>>(urlBackend, cartRequest);
};

export const getHistoriesAPI = () => {
  const urlBackend = "/api/v1/history";
  return axios.get<IBackendRes<IHistoryTable[]>>(urlBackend);
};

export const getOrderAPI = (
  current: number,
  pageSize: number,
  query: string,
  sort: string
) => {
  const urlBackend =
    `/api/v1/order?current=${current}&pageSize=${pageSize}` + query + sort;
  return axios.get<IBackendRes<IModelPaginate<IHistoryTable>>>(urlBackend);
};

export const getDashboardAPI = () => {
  const urlBackend = "/api/v1/database/dashboard";
  return axios.get<IBackendRes<IDashBoard>>(urlBackend);
};
