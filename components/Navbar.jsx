import React from 'react'
import Link from 'next/link'
import { AiOutlineShopping } from 'react-icons/ai'

import Bag from './Bag'

import { useStateContext } from '../context/StateContext'

const Navbar = () => {
	const { showBag, setShowBag, totalQuantities } = useStateContext()

	return (
		<div className='navbar-container'>
			<p className='logo'>
				<Link href={'/'}>Consumerism</Link>
			</p>

			<button
				type='button'
				className='bag-icon'
				onClick={() => setShowBag(true)}
			>
				<AiOutlineShopping />
				<span className='bag-item-qty'>{totalQuantities}</span>
			</button>

			{showBag && <Bag />}
		</div>
	)
}

export default Navbar