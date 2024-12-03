import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, message } from 'antd';
import AuthSidebar from '../components/AuthSidebar'; // Reuse the AuthSidebar component
import { ServiceApi } from '../services/Api';
import { updateUserRequest, setShowAuthModal , loginSuccess } from '../store/redux/AuthSlice';

export default function Password() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isSubmitting = useSelector((state) => state.auth.fetching);

    const [form] = Form.useForm();
    const [oldPasswordValid, setOldPasswordValid] = useState(true);

    useEffect(() => {
        if (!user) {
            dispatch(setShowAuthModal(true));
        }
    }, [user]);

	const onFinish = async (values) => {
		if (!user) return;
	
		try {
			
			const loginResponse = await ServiceApi.login({
				email: user.email,
				password: values.oldPassword,
			});
	
			if (loginResponse.ok && loginResponse.status === 200) {
				
				setOldPasswordValid(true); 
				await ServiceApi.updateUser(user.id, { password: values.newPassword }); 
				message.success('Cập nhật mật khẩu thành công');
	
				
				const reLoginResponse = await ServiceApi.login({
					email: user.email,
					password: values.newPassword,
				});
	
				if (reLoginResponse.ok && reLoginResponse.status === 200) { 
					
					dispatch(loginSuccess(reLoginResponse.data)); 
					message.success('Đăng nhập thành công với mật khẩu mới');
				} else {
					message.error('Có lỗi khi đăng nhập lại với mật khẩu mới');
				}
			} else {
				
				setOldPasswordValid(false);
				message.error('Mật khẩu cũ không đúng!');
			}
		} catch (error) {
			message.error('Có lỗi xảy ra khi cập nhật mật khẩu');
		}
	};
	
	

    return (
        <div className="container py-10 mx-auto min-h-[calc(100vh_-_139px)]">
            <div className="grid grid-cols-5 gap-6">
                {/* Sidebar */}
                <AuthSidebar />
                
                {/* Password Change Form */}
                <div className="grid col-span-4 p-6 bg-white shadow-md">
                    <p className="text-3xl text-center">Đổi Mật Khẩu</p>
                    <Form
                        size="large"
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        {/* Old Password */}
                        <Form.Item
                            name="oldPassword"
                            label="Mật khẩu cũ"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        {!oldPasswordValid && (
                            <p className="text-red-500">Mật khẩu cũ không đúng!</p>
                        )}

                        {/* New Password */}
                        <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        {/* Confirm New Password */}
                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            rules={[ 
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' }, 
                                ({ getFieldValue }) => ({ 
                                    validator(_, value) { 
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve(); 
                                        }
                                        return Promise.reject(new Error('Mật khẩu không khớp!')); 
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        {/* Submit Button */}
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmitting}
                            className="w-full mt-5"
                        >
                            Lưu
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}
