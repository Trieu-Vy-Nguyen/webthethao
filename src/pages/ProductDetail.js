import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addProductToCart } from '../store/redux/CartSlice';

function ProductDetail() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState(1); 
	const [selectedSize, setSelectedSize] = useState(null); 
	const [successMessage, setSuccessMessage] = useState(""); 
	const dispatch = useDispatch();

	useEffect(() => {
		
		fetch(`${process.env.REACT_APP_API_URL}/products/${id}`)   
			.then((response) => response.json())
			.then((data) => setProduct(data)) 
			.catch((error) => console.error('Lỗi khi lấy chi tiết sản phẩm:', error)); 
	}, [id]);

	const handleQuantityChange = (change) => {
		setQuantity(prevQuantity => Math.max(prevQuantity + change, 1)); 
	};

	const handleSizeSelect = (size) => {
		setSelectedSize(size);
	};

	const handleAddToCart = () => {
		if (product && selectedSize) { 
			const productToAdd = { 
				...product,
				quantity: quantity,
				size: selectedSize
			};
			dispatch(addProductToCart(productToAdd)); 
			setSuccessMessage("Sản phẩm đã được thêm vào giỏ hàng!");
			setTimeout(() => setSuccessMessage(""), 3000); 
		} else {
			alert('Vui lòng chọn kích thước sản phẩm!');
		}
	};

	if (!product) {
		return <div>Đang tải...</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col lg:flex-row gap-8 bg-white p-6 shadow-md rounded-lg">
				<div className="flex-1">
					<img src={product.image} alt={product.name} className="w-full rounded-lg" />
				</div>
				<div className="flex-1 flex flex-col gap-4">
					<h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>
					<p className="text-xl text-red-500 font-bold">{product.price} $</p>
					<p className="text-gray-600">{product.description}</p>
					
					{/* Phần chọn kích thước */}
					<div className="flex gap-4 mt-4">
						{['S', 'M', 'L', 'XL'].map(size => (
							<button
								key={size}
								className={`py-2 px-4 rounded-lg font-semibold ${selectedSize === size ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300`}
								onClick={() => handleSizeSelect(size)}
							>
								{size}
							</button>
						))}
					</div>
					
					<div className="mt-6 flex items-center gap-4">
						{/* Phần tăng giảm số lượng */}
						<div className="flex items-center gap-4">
							<button 
								className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
								onClick={() => handleQuantityChange(-1)}
							>
								-
							</button>
							<span className="text-xl font-semibold">{quantity}</span>
							<button 
								className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
								onClick={() => handleQuantityChange(1)}
							>
								+
							</button>
						</div>
						{/* Phần nút Thêm vào giỏ hàng */}
						<button
							className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 px-20"
							onClick={handleAddToCart}
						>
							Thêm vào giỏ hàng
						</button>
					</div>

					{/* Thông báo thành công */}
					{successMessage && (
						<div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg border border-green-300">
							{successMessage}
						</div>
					)}

					{/* Phần các mục phụ */}
					<div className="mt-8 flex flex-col gap-4 lg:flex-row lg:gap-8">
						<div className="flex-1 bg-gray-100 p-4 rounded-lg text-center shadow-md">
							<p className="text-lg font-semibold text-gray-700">In áo</p>
							<p className="text-gray-600">Thêm dịch vụ in ấn theo yêu cầu của bạn</p>
						</div>
						<div className="flex-1 bg-gray-100 p-4 rounded-lg text-center shadow-md">
							<p className="text-lg font-semibold text-gray-700">Giao hàng dự kiến</p>
							<p className="text-gray-600">Nhận hàng trong 3-5 ngày làm việc</p>
						</div>
						<div className="flex-1 bg-gray-100 p-4 rounded-lg text-center shadow-md">
							<p className="text-lg font-semibold text-gray-700">Hỗ trợ tư vấn</p>
							<p className="text-gray-600">Liên hệ với chúng tôi để được hỗ trợ thêm</p>
						</div>
					</div>
					<img src='https://file.hstatic.net/200000580329/file/bang_sz_70aeb65688a4497ca49c27ef1f0d9d91_grande.png' />
				</div>
			</div>
		</div>
	);
}

export default ProductDetail;
