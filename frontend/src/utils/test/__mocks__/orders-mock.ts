import { OrderError, OrderItemResponse, OrderRequest, OrderResponse } from "../../../types/types";

export const mockOrderRequest: OrderRequest = {
    firstName: "Mara",
    lastName: "Ellison",
    city: "New York",
    address: "Wall Street1",
    postIndex: "1234567890",
    phoneNumber: "1234567890",
    email: "test123@test.com",
    perfumesId: [33, 34],
    totalPrice: 840
};

export const mockOrder: OrderResponse = {
    id: 1,
    totalPrice: 21000000,
    date: "2021-04-07",
    firstName: "Mara",
    lastName: "Ellison",
    city: "New York",
    address: "Wall Street1",
    email: "test123@test.com",
    phoneNumber: "1234567890",
    postIndex: 1234567890
};

export const mockOrderItems: Array<OrderItemResponse> = [
    {
        id: 1,
        amount: 9600000,
        quantity: 2,
        perfume: {
            id: 33,
            perfumeTitle: "Chanel N5",
            perfumer: "Chanel",
            price: 4800000,
            perfumeRating: 0,
            filename: "4b51181b-5551-4321-b5e7-f7612584c9b2.Chanel N5.jpg",
            reviewsCount: 0,
            volume: "200"
        }
    },
    {
        id: 2,
        amount: 11400000,
        quantity: 3,
        perfume: {
            id: 34,
            perfumeTitle: "Aventus",
            perfumer: "Creed",
            price: 3800000,
            perfumeRating: 0,
            filename: "bdb203a9-0725-4ed4-a71a-db7eeb915fae.Creed Aventus.jpg",
            reviewsCount: 0,
            volume: "100"
        }
    }
];

export const mockOrders: Array<OrderResponse> = [
    {
        id: 1,
        totalPrice: 21000000,
        date: "2021-04-07",
        firstName: "Mara",
        lastName: "Ellison",
        city: "New York",
        address: "Wall Street1",
        email: "test123@test.com",
        phoneNumber: "1234567890",
        postIndex: 1234567890
    },
    {
        id: 2,
        totalPrice: 6000000,
        date: "2021-04-07",
        firstName: "Celia",
        lastName: "Nguyen",
        city: "New York",
        address: "Wall Street1",
        email: "test123@test.com",
        phoneNumber: "1234567890",
        postIndex: 1234567890
    },
    {
        id: 3,
        totalPrice: 4075000,
        date: "2021-04-07",
        firstName: "Ivan",
        lastName: "Ivanov",
        city: "Moscow",
        address: "Tverskaya street 1",
        email: "ivan123@test.com",
        phoneNumber: "1234567890",
        postIndex: 1234567890
    },
    {
        id: 4,
        totalPrice: 19500000,
        date: "2021-04-07",
        firstName: "Ivan",
        lastName: "Ivanov",
        city: "Moscow",
        address: "Tverskaya street 1",
        email: "ivan123@test.com",
        phoneNumber: "1234567890",
        postIndex: 1234567890
    },
    {
        id: 5,
        totalPrice: 4900000,
        date: "2021-04-07",
        firstName: "Ivan",
        lastName: "Ivanov",
        city: "Moscow",
        address: "Tverskaya street 1",
        email: "ivan123@test.com",
        phoneNumber: "1234567890",
        postIndex: 1234567890
    }
];

export const mockOrderErrors: OrderError = {
    emailError: "Email cannot be empty",
    firstNameError: "Fill in the input field",
    lastNameError: "Fill in the input field",
    cityError: "Fill in the input field",
    addressError: "Fill in the input field",
    postIndexError: "Post index cannot be empty",
    phoneNumberError: "Phone number cannot be empty"
};
