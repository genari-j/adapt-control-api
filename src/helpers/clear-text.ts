const removeAccentsAndSpecialChars = (text: string) => {
	return text
		.normalize('NFD')
		.replace(/[^\w\s.]/g, '')
		.replace(/[\u0307]/g, '')
}

export const cleanString = (text: string) => {
	text = text.toLowerCase()
	text = removeAccentsAndSpecialChars(text)
	text = text.replace(/[^\w\s.]/g, '')

	return text
}
