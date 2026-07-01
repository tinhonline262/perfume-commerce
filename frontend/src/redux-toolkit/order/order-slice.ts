import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LoadingStatus, OrderResponse, OrderError, OrderItemResponse } from "../../types/types";
import { addOrder, fetchOrderById, fetchOrderItemsByOrderId, updateOrderStatus } from "./order-thunks";

export interface OrderState {
    order: Partial<OrderResponse>;
    orderItems: Array<OrderItemResponse>;
    errors: Partial<OrderError>;
    errorMessage: string;
    loadingState: LoadingStatus;
    statusUpdateLoading: boolean;
    statusUpdateError: string;
}

export const initialState: OrderState = {
    order: {},
    orderItems: [],
    errors: {},
    errorMessage: "",
    loadingState: LoadingStatus.LOADING,
    statusUpdateLoading: false,
    statusUpdateError: ""
};

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrderLoadingState(state, action: PayloadAction<LoadingStatus>) {
            state.loadingState = action.payload;
        },
        resetOrderState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrderById.pending, (state) => {
            state.loadingState = LoadingStatus.LOADING;
        });
        builder.addCase(fetchOrderById.fulfilled, (state, action) => {
            state.order = action.payload;
            state.loadingState = LoadingStatus.LOADED;
        });
        builder.addCase(fetchOrderById.rejected, (state, action) => {
            state.errorMessage = action.payload!;
            state.loadingState = LoadingStatus.ERROR;
        });
        builder.addCase(fetchOrderItemsByOrderId.fulfilled, (state, action) => {
            state.orderItems = action.payload;
        });
        builder.addCase(addOrder.pending, (state) => {
            state.loadingState = LoadingStatus.LOADING;
        });
        builder.addCase(addOrder.fulfilled, (state, action) => {
            state.order = action.payload;
            state.loadingState = LoadingStatus.LOADED;
        });
        builder.addCase(addOrder.rejected, (state, action) => {
            state.errors = action.payload!;
            state.loadingState = LoadingStatus.ERROR;
        });
        builder.addCase(updateOrderStatus.pending, (state) => {
            state.statusUpdateLoading = true;
            state.statusUpdateError = "";
        });
        builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
            state.statusUpdateLoading = false;
            state.order = action.payload;
        });
        builder.addCase(updateOrderStatus.rejected, (state, action) => {
            state.statusUpdateLoading = false;
            state.statusUpdateError = action.payload || "Failed to update status";
        });
    }
});

export const { setOrderLoadingState, resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
