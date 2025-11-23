const validators = {
	/**
	 * Validates an email address.
	 * 
	 * @param {string} email - The email address to validate.
	 * @returns {bool} True if the email is valid, false otherwise.
	 */
	isValidEmail: (email) => {
		const pattern = /^[^@]+@[^@\.]+\.[^@]+$/i;

		// Do not allow spaces or the word mailto:
		if (/\s/.test(email)) return false;
		if (/mailto/.test(email)) return false;
		
		return pattern.test(email);
	},

	/**
	 * Validates a password by checking if the password is at least 8 characters long, contains a number,
	 * an uppercase letter, and a lowercase letter. Adjust the regex as necessary.
	 * 
	 * @param {string} password - The password to validate.
	 * @returns {bool} True if the password meets the criteria, false otherwise.
	 */
	isValidPassword: (password) => {
		// (?=.*\d) looks anywhere in the string for a number
		// (?=.*[a-z]) looks anywhere in the string for a lowercase letter
		// (?=.*[A-Z]) looks anywhere in the string for an uppercase letter
		// (?=.*[!@#\-_~$%^&*()]) looks anywhere in the string for a special character
		// (?=\S*$) must not contain any spaces
		// . matches any character but line breaks
		// {8,20} quantifier - must contain 8 to 20 characters
		const pattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#\-_~$%^&*()])(?=\S*$).{8,20}$/;
		return pattern.test(password);
	},

	/**
	 * This method will not only validate the password but return exactly why it failed validation.
	 * 
	 * @param {string} password
	 * @returns {array} An array of errors
	 */
	validatePassword: (password) => {
		const errors = [];

		// Must be at least 8 characters
		if (password.length < 8) {
			errors.push('Minimum of 8 characters');
		}
		// Must contain a number
		if (!/\d/.test(password)) {
			errors.push('At least 1 number');
		}
		// Must contain at least 1 uppercase character
		if (!/[A-Z]/.test(password)) {
			errors.push('At least 1 uppercase character');
		}
		// Must contain at least 1 lowercase character
		if (!/[a-z]/.test(password)) {
			errors.push('At least 1 lowercase character');
		}
		// Must contain at least 1 special character
		if (!/[!@#\-_~$%^&*()]/.test(password)) {
			errors.push('At least 1 of the following special characters: !@#-_~$%^&*()');
		}
		// Maximum of 20 characters
		if (password.length > 20) {
			errors.push('Maximum of 20 characters');
		}
		// No spaces
		if (/[^\S]/.test(password)) {
			errors.push('Must not contain any spaces');
		}

		return errors;
	}
}

export default validators;
