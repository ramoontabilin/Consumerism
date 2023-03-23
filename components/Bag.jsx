import React, { useRef } from 'react'
import Link from 'next/link'
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai'
import { TiDeleteOutline } from 'react-icons/ti'

import { toast, Toast } from 'react-hot-toast'
import { useStateContext } from '../context/StateContext'
import { urlFor } from '../lib/client'
import getStripe from '../lib/getStripe'

const Bag = () => {
	const bagRef = useRef()
	const { totalPrice, totalQuantities, bagItems, setShowBag, toggleBagItemQuantity, onRemove } = useStateContext()

	const handleCheckout = async () => {
		const stripe = await getStripe()

		const response = await fetch('/api/stripe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/JSON'
			},
			body: JSON.stringify(bagItems),
		})

		if (Response.statusCode === 500) return

		const data = await response.json()

		toast.loading('Redirecting...')

		stripe.redirectToCheckout({ sessionId: data.id })
	}

	return (
		<div className='bag-wrapper' ref={bagRef}>
			<div className='bag-container'>
				<button
					type='button'
					className='bag-heading'
					onClick={() => setShowBag(false)}
				>
					<AiOutlineLeft />
					<span className='heading'>Your Bag</span>
					<span className='bag-num-items'>({totalQuantities} items)</span>
				</button>

				{bagItems.length < 1 && (
					<div className='empty-bag'>
						<AiOutlineShopping size={150} />
						<h3>Your shopping bag is empty</h3>
						<Link href='/'>
							<button
								type='button'
								onClick={() => setShowBag(false)}
								className='btn'
							>
								Continue Shopping
							</button>
						</Link>
					</div>
				)}

				<div className='product-container'>
					{bagItems.length >= 1 && bagItems.map((item, index) => (
						<div className='product' key={item._id}>
							<img
								src={urlFor(item?.image[0])}
								alt='product-image'
								className='bag-product-image'
							/>
							<div className='item-desc'>
								<div className='flex top'>
									<h5>{item.name}</h5>
									<h4>${item.price}</h4>
								</div>
								<div className='flex bottom'>
									<div>
										<p className='quantity-desc'>
											<span className='minus' onClick={() => toggleBagItemQuantity(item._id, 'dec')}><AiOutlineMinus /></span>
											<span className='num'>{item.quantity}</span>
											<span className='plus' onClick={() => toggleBagItemQuantity(item._id, 'inc')}><AiOutlinePlus /></span>
										</p>
									</div>
									<button
										type='button'
										className='remove-item'
										onClick={() => onRemove(item)}
									>
										<TiDeleteOutline />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
				{bagItems.length >= 1 && (
					<div className='bag-bottom'>
						<div className='total'>
							<h3>Subtotal:</h3>
							<h3>${totalPrice}</h3>
						</div>
						<div className='btn-container'>
							<button
								type='button'
								className='btn'
								onClick={handleCheckout}
							>
								Pay with Stripe
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Bag