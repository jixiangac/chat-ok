
import {
    Form,
    Input,
    Button,
    Selector,
  } from 'antd-mobile';


const ApplyForm = (props)=>{


    return <Form
                name='form'
                footer={
                <Button block type='submit' color='primary' size='large'>
                    提交
                </Button>
                }
            >
                <Form.Item 
                  name='name' 
                  label='名称'
                  rules={[{ required: true }]}>
                    <Input placeholder='请输入名称' />
                </Form.Item>
                <Form.Item 
                  name='passphrase' 
                  label='密码短语'
                  rules={[{ required: true }]}>
                    <Input placeholder='请输入密码短语' />
                </Form.Item>
                <Form.Item 
                  name='apikey' 
                  label='Api Key'
                  rules={[{ required: true }]}>
                    <Input placeholder='请输入Api Key' />
                </Form.Item>
                <Form.Item 
                  name='screctkey' 
                  label='Screct Key'
                  rules={[{ required: true }]}>
                    <Input placeholder='请输入Screct Key' />
                </Form.Item>
                <Form.Item 
                  name='type' 
                  label='申请类型'
                  rules={[{ required: true }]}>
                    <Selector
                        columns={3}
                        multiple={false}
                        options={[
                        { label: '邀请', value: '1' },
                        { label: '付费', value: '2' },
                        { label: '合作', value: '3' },
                        ]}
                    />
                </Form.Item>
            </Form>
  
};


export default ApplyForm;