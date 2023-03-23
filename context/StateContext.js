import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const Context = createContext()

export const StateContext = ({ children }) => {
	const [showBag, setShowBag] = useState(false)
	const [bagItems, setBagItems] = useState([])
	const [totalPrice, setTotalPrice] = useState(0)
	const [totalQuantities, setTotalQuantities] = useState(0)
	const [qty, setQty] = useState(1)

	let foundProduct
	let index

	const onAdd = (product, quantity) => {
		const checkProductInBag = bagItems.find((item) => item._id === product._id)

		setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
		setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)

		if (checkProductInBag) {
			const updatedBagItems = bagItems.map((bagItem) => {
				if (bagItem._id === product._id) return {
					...bagItem,
					quantity: bagItem.quantity + quantity
				}
				return bagItem
			})
			setBagItems(updatedBagItems)
		} else {
			product.quantity = quantity
			setBagItems([...bagItems, { ...product }])
		}

		toast.success(`${qty} ${product.name} added to the bag.`)
	}

	const onRemove = (product) => {
		foundProduct = bagItems.find((item) => item._id === product._id)
		const newBagItems = bagItems.filter((item) => item._id !== product._id)

		setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity)
		setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity)
		setBagItems(newBagItems)
	}

	const toggleBagItemQuantity = (id, value) => {
		foundProduct = bagItems.find((item) => item._id === id)
		index = bagItems.findIndex((product) => product._id === id)

		const newBagItems = bagItems.filter((item) => item._id !== id)
		if (value === 'inc') {
			setBagItems([...newBagItems.slice(0, index), { ...foundProduct, quantity: foundProduct.quantity + 1 }, ...newBagItems.slice(index)])
			setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
			setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
		} else if (value === 'dec') {
			if (foundProduct.quantity > 1) {
				setBagItems([...newBagItems.slice(0, index), { ...foundProduct, quantity: foundProduct.quantity - 1 }, ...newBagItems.slice(index)])
				setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
				setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
			}
		}
	}

	const incQty = () => {
		setQty((prevQty) => prevQty + 1)
	}

	const decQty = () => {
		setQty((prevQty) => {
			if (prevQty - 1 < 1) return 1
			return prevQty - 1
		})
	}

	return (
		<Context.Provider
			value={{
				showBag: showBag,
				setShowBag: setShowBag,
				bagItems: bagItems,
				totalPrice,
				totalQuantities,
				qty,
				incQty,
				decQty,
				onAdd,
				toggleBagItemQuantity,
				onRemove,
				setQty,
				setBagItems: setBagItems,
				setTotalPrice,
				setTotalQuantities
			}}
		>
			{children}
		</Context.Provider>
	)

}

export const useStateContext = () => useContext(Context)