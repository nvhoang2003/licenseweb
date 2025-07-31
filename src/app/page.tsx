"use client"
import { Form, InputNumber, Button, Typography, Input } from "antd";
import 'antd/dist/reset.css';
import ILicenseSetup from "@/types/LicenseSetup";
import CryptoJS from "crypto-js";

const AES_KEY = "exlIptwPhJOivnYuXiEZT5duSbEpfBuB"; // 32 ký tự
const AES_IV = "tkZ5nEqxNKJlvGxQ"; // 16 ký tự

const { Title } = Typography;

export default function Home() {
  const [form] = Form.useForm<ILicenseSetup>();

  const onFinish = (values: ILicenseSetup) => {
    // Lấy dữ liệu license
    const licenseData = { concurrentAccount: values.concurrentAccount };
    // Hardcode key và iv
    const keyWordArray = CryptoJS.enc.Utf8.parse(AES_KEY);
    const ivWordArray = CryptoJS.enc.Utf8.parse(AES_IV);
    // Chuỗi hóa dữ liệu
    const dataString = JSON.stringify(licenseData);
    // Mã hóa AES
    const encrypted = CryptoJS.AES.encrypt(dataString, keyWordArray, {
      iv: ivWordArray,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    // Tạo file .lic và download
    const blob = new Blob([encrypted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${values.name}.lic`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Title>Tool Tạo File License</Title>

      {/* <Card style={{width: "100%", maxWidth: "500px", height: ""}}> */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ concurrentAccount: 1, name: "" }}
          style={{width: "100%", maxWidth: "500px", border: "1px solid rgb(217 217 217)", padding: "15px", borderRadius: '6px', height: "fit-content"}}
        >
          <Form.Item
            label="Tên đơn vị"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đơn vị!' },
            ]}
          >
            <Input style={{ width: '100%' }} placeholder="Vui lòng nhập tên đơn vị"/>
          </Form.Item>
          <Form.Item
            label="Số người dùng truy cập tối đa"
            name="concurrentAccount"
            rules={[
              { required: true, message: 'Vui lòng nhập số người dùng truy cập tối đa!' },
              { type: 'number', min: 1, message: 'Phải lớn hơn 0!' },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item style={{display: 'flex', justifyContent: 'end'}}>
            <Button type="primary" htmlType="submit">
              Tạo License
            </Button>
          </Form.Item>
        </Form>
      {/* </Card> */}
    </div>
  );
}
