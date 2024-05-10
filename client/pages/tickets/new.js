import React from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
function NewTicket() {
    const [title, setTitle] = React.useState('')
    const [price, setPrice] = React.useState('')

    const {doRequest,errors}=useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price
        },
        onSuccess: (tickets) => {
            Router.push('/')
        }
    })

    function handleChange(e) {
        const { name, value } = e.target;
        if (name === 'title') {
            setTitle(value)
        } else if (name === 'price') {
            setPrice(value)
        }
    }
    const onBlur = () => {
       const value=parseFloat(price)

      if(isNaN(value)){
        return 
      }

      setPrice(value.toFixed(2));
    }

    const onSubmit = (e) => {
        e.preventDefault()
        doRequest()
    }
  return (
    // write a create ticket form-group  with Title and price and submit button bootstrap
    <div>
        <h1>Create Ticket</h1>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input value={title} name='title' onChange={handleChange} type="text" className="form-control" id="title" placeholder="Enter title" />
            </div>
            <div className="form-group">
                <label htmlFor="price">Price</label>
                <input onBlur={onBlur} name='price' value={price} onChange={handleChange} type="number" className="form-control" id="price" placeholder="Enter price" />
            </div>
            {errors}
            <button type="submit" className="btn btn-primary mt-3">Submit</button>

        </form>
    </div>
  )
}

export default NewTicket