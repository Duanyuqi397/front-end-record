import React from "react";
import { Input,Button } from "antd";

function KFormCreate(Comp){
    return class extends React.Component {
        constructor(props){
            super(props);

            this.options = {};
            this.state = {};
        }

        handleChange = e => {
            const { name,value } = e.target;
            // console.log(name,value);
            this.setState({[name]:value},() => {
                this.validateField(name);
            })
        }

        getFieldDec = (field,option) => {
            this.options[field] = option;
            return InputComp => (
                <div>
                    {
                        React.cloneElement(InputComp,{
                            name:field,
                            value:this.state[field] || '',
                            onChange:this.handleChange
                        })
                    }
                    {
                        this.state[field + 'Message'] && (
                            <p style={{color: 'red'}}>{this.state[field + 'Message']}</p>
                        )
                    }
                </div>
            )
        }

        validateField = field => {
            const rules = this.options[field].rules;
            const ret = !rules.some(rule => {
                if(rule.required){
                    if(!this.state[field]){
                        this.setState({
                            [field + 'Message']: rule.message
                        })
                        return true;
                    }
                }
            })

            if(ret){
                //校验成功
                this.setState({
                    [field + 'Message']: ''
                })
            }

            return ret;
        }

        validate = cb => {
            const rets = Object.keys(this.options).map(field => this.validateField(field))

            const ret = rets.every(v => v ==true);
            cb(ret,this.state);
        }

        render(){
            return <Comp getFieldDec={this.getFieldDec} validate={this.validate} />
        }
    }
}


class KForm extends React.Component {
    onSubmit = () => {
        console.log('submit');
        this.props.validate((isValid,data) => {
            if(isValid){
                console.log('登陆成功',data)
            }else{
                alert('校验失败')
            }
        });
    }
    render(){
        const { getFieldDec } = this.props;
        return (
            <div>
                {
                    getFieldDec('uname',{
                        rules:[{ required:true,message:'用户名必填' }]
                    })(<Input />)
                }
                {
                    getFieldDec('pwd',{
                        rules:[{ required:true,message:'密码必填' }]
                    })(<Input />)
                }
                {
                    getFieldDec('验证码',{
                        rules:[{ required:false,message:'123' }]
                    })(<Input />)
                }
                <Button onClick={this.onSubmit}>登陆</Button>
            </div>
        )
    }
}

export default KFormCreate(KForm);