1.复习react基本概念，函数组件、类组件和基本hook使用方法
2.写了一个购物车demo
```JavaScript
import React,{ useState } from "react";

export default function CartSamples () {
    const [goods,setGoods] = useState([
        {id:1,name:"前端"},
        {id:2,name:"Java"}
    ])

    const [text,setText] = useState('')

    const [cart,setCart] = useState([]);
    // let cart = [];

    const addGoods = () => {
        setGoods([
            ...goods,
            {
                id:goods.length + 1,
                name:text,
            }
        ])
        setText('');
    }

    const addToCart = good => {
        let copyCart = [...cart];
        let item = copyCart.find(item => item.id === good.id)
        if(item){
            item.num = item.num + 1;
        }else{
            copyCart.push({...good,num:1});
        }
        setCart(copyCart)
    }

    const add = good => {
        let copyCart = [...cart];
        let item = copyCart.find(item => item.id === good.id)
        item.num = item.num + 1;
        setCart(copyCart)
    }

    const minus = good => {
        let copyCart = [...cart];
        let item = copyCart.find(item => item.id === good.id)
        item.num = item.num - 1;
        setCart(copyCart)
    }

    const handleChange = e => {
        setText(e.target.value);
    }

    return (
        <div style={{width:"400px"}}>
            <input type="text" onChange={handleChange} value={text} />
            <button onClick={addGoods}>添加商品</button>
            <ul>
                {
                    goods.map(item => (
                        <li key={item.id}>
                            {item.name}
                            <button onClick={() => addToCart(item)}>加购</button>
                        </li>
                    ))
                }
            </ul>
            <Cart data={cart} add={add} minus={minus} />
        </div>
    )
}

const Cart = ({data,add,minus}) => (
    <div>
        <table>
            <tbody> 
                {
                    data.map(d => (
                        <tr key={d.id}>
                            <td>{d.name}</td>
                            <td>
                                <button onClick={() => add(d)}>+</button>
                                {d.num}
                                <button onClick={() => minus(d)}>-</button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>
)
```