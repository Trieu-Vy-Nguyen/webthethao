import { createSlice } from '@reduxjs/toolkit';

const initialState = { // Định nghĩa trạng thái khởi tạo cho slice này. Gồm:
	products: [], // : Mảng chứa danh sách sản phẩm.
	categories: [], // : Mảng chứa danh sách danh mục sản phẩm.
	fetching: false, // Biến boolean cho biết liệu có đang trong quá trình lấy dữ liệu hay không.
}; 

export const productSlice = createSlice({ // Tạo một slice mới tên là product
	name: 'product',  
	initialState, 
	reducers: { 
		getProductsRequest: (state) => {
			state.fetching = true; 
		},
		getProductsSuccess: (state, action) => {
			state.products = action.payload.products; 
			state.categories = action.payload.categories; 
			state.fetching = false; 
		},
		getProductsFailure: (state) => {
			state.products = []; 
			state.categories = []; 
			state.fetching = false; 
		},
	},
});

export const { getProductsRequest, getProductsSuccess, getProductsFailure } = productSlice.actions; // Xuất ra các action creator tương ứng với các reducer đã định nghĩa, để có thể sử dụng chúng ở nơi khác trong ứng dụng.
 
export default productSlice.reducer; 
