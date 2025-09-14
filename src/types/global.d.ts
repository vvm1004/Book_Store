export {};

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  interface ILogin {
    access_token: string;
    user: IUser;
  }

  interface IRegister {
    email: string;
    fullName: string;
    _id: string;
  }

  interface IUser {
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    id: string;
    role: string;
  }

  interface IFetchAccount {
    user: IUser;
  }

  interface IUserTable {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IBulkCreateUserRequest {
    fullName: string;
    password: string;
    email: string;
    phone: string;
  }

  interface IBulkCreateUserResponse {
    countSuccess: number;
    countError: number;
  }

  interface IBookTable {
    _id: string;
    thumbnail: string;
    slider: string[];
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IBookData {
    thumbnail?: string;
    slider?: string[];
    mainText?: string;
    author?: string;
    price?: number;
    quantity?: number;
    category?: string;
  }

  interface IFileUploadResponse {
    fileUploaded: string;
  }

  interface ICartData {
    detail: IBookTable;
    quantity: number;
    _id: string;
  }

  interface ICartRequest {
    address?: string;
    name?: string;
    phone?: string;
    totalPrice?: number;
    type?: string;
    detail?: {
      _id?: string;
      quantity?: number;
      bookName?: string;
    }[];
  }

  interface IHistoryTable {
    _id: string;
    name: string;
    type: string;
    email: string;
    phone: string;
    userId: string;
    detail: {
      _id: string;
      quantity: number;
      bookName: string;
    }[];
    totalPrice: number;
    paymentStatus: string;
    paymentRef: string;
    createdAt: string;
    updatedAt: string;
    __v: 0;
  }

  interface IDashBoard {
    countUser: number;
    countOrder: number;
    countBook: number;
  }
}
